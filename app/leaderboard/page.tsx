'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { CONTINENTS } from '@/lib/countries'
import { getUserBadges } from '@/lib/badges'
import NotificationBell from '@/components/NotificationBell'

interface User {
  id: string
  email: string
  username: string
  continent: string
  countryCode: string
  currentContinentRank: number
  currentGlobalRank: number
}

interface LeaderboardEntry {
  id: string
  username: string
  countryCode: string
  currentContinentRank: number
  currentGlobalRank: number
  continent: string
  totalPositionsPurchased: number
}

interface ActivityItem {
  id: string
  username: string
  continent: string
  positionsPurchased: number
  timestamp: string
}

function formatRelativeTime(dateString: string): string {
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const seconds = Math.floor((now - then) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

const getContinentEmoji = (continent: string) => {
  const emojiMap: { [key: string]: string } = {
    'AFRICA': '🌍',
    'ASIA': '🌏',
    'EUROPE': '🌍',
    'NORTH_AMERICA': '🌎',
    'SOUTH_AMERICA': '🌎',
    'OCEANIA': '🌏',
    'ANTARCTICA': '🧊',
    'WORLD': '🌐'
  }
  return emojiMap[continent] || '🌍'
}

const getContinentGradient = (continent: string) => {
  const gradients: { [key: string]: string } = {
    'AFRICA': 'from-yellow-500 via-orange-500 to-red-500',
    'ASIA': 'from-red-500 via-pink-500 to-purple-500',
    'EUROPE': 'from-blue-500 via-cyan-500 to-teal-500',
    'NORTH_AMERICA': 'from-green-500 via-emerald-500 to-teal-500',
    'SOUTH_AMERICA': 'from-lime-500 via-green-500 to-emerald-500',
    'OCEANIA': 'from-cyan-500 via-blue-500 to-indigo-500',
    'ANTARCTICA': 'from-blue-300 via-cyan-300 to-white',
    'WORLD': 'from-purple-500 via-pink-500 to-blue-500'
  }
  return gradients[continent] || 'from-blue-500 to-purple-500'
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<string>('WORLD')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [purchaseAmount, setPurchaseAmount] = useState('')
  const [purchasing, setPurchasing] = useState(false)
  const [purchaseError, setPurchaseError] = useState('')
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const previousRanksRef = useRef<Map<string, number>>(new Map())
  const [rankChanges, setRankChanges] = useState<Map<string, 'up' | 'down'>>(new Map())
  const [preview, setPreview] = useState<{
    currentContinentRank: number
    currentGlobalRank: number
    predictedContinentRank: number
    predictedGlobalRank: number
    overtaken: { username: string; currentRank: number }[]
  } | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        setUser(null)
        setSelectedTab('WORLD')
        return
      }
      const data = await response.json()
      setUser(data.user)
      setSelectedTab(data.user.continent)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null)
      setSelectedTab('WORLD')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchLeaderboard = useCallback(async () => {
    setLeaderboardLoading(true)
    try {
      const continent = selectedTab === 'WORLD' ? '' : selectedTab
      const url = continent ? `/api/leaderboard?continent=${continent}` : '/api/leaderboard'
      const response = await fetch(url)
      const data = await response.json()
      const entries: LeaderboardEntry[] = data.leaderboard || []

      // Detect rank changes
      if (previousRanksRef.current.size > 0) {
        const changes = new Map<string, 'up' | 'down'>()
        entries.forEach((entry) => {
          const rank = selectedTab === 'WORLD' ? entry.currentGlobalRank : entry.currentContinentRank
          const prevRank = previousRanksRef.current.get(entry.id)
          if (prevRank !== undefined && prevRank !== rank) {
            changes.set(entry.id, rank < prevRank ? 'up' : 'down')
          }
        })
        if (changes.size > 0) {
          setRankChanges(changes)
          setTimeout(() => setRankChanges(new Map()), 3000)
        }
      }

      // Store current ranks
      const newRanks = new Map<string, number>()
      entries.forEach((entry) => {
        const rank = selectedTab === 'WORLD' ? entry.currentGlobalRank : entry.currentContinentRank
        newRanks.set(entry.id, rank)
      })
      previousRanksRef.current = newRanks

      setLeaderboard(entries)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLeaderboardLoading(false)
    }
  }, [selectedTab])

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch('/api/activity')
        const data = await res.json()
        if (data.activity?.length) setActivity(data.activity)
      } catch {}
    }
    fetchActivity()
    const interval = setInterval(fetchActivity, 20000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!loading) {
      fetchLeaderboard()
    }
  }, [selectedTab, loading, fetchLeaderboard])

  // 30s polling with visibility pause
  useEffect(() => {
    if (loading) return

    let intervalId: ReturnType<typeof setInterval>

    const startPolling = () => {
      intervalId = setInterval(fetchLeaderboard, 30000)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(intervalId)
      } else {
        fetchLeaderboard()
        startPolling()
      }
    }

    startPolling()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [loading, fetchLeaderboard])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const fetchPreview = (amount: string) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    const num = parseInt(amount, 10)
    if (!num || num < 1) {
      setPreview(null)
      return
    }
    debounceTimerRef.current = setTimeout(async () => {
      setPreviewLoading(true)
      try {
        const res = await fetch(`/api/leaderboard/preview?positions=${num}`)
        if (res.ok) {
          const data = await res.json()
          setPreview(data)
        }
      } catch {} finally {
        setPreviewLoading(false)
      }
    }, 300)
  }

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    setPurchaseError('')
    setPurchasing(true)

    try {
      const amount = parseInt(purchaseAmount, 10)
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount')
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountUsd: amount }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err: any) {
      setPurchaseError(err.message)
      setPurchasing(false)
    }
  }

  const getCountryFlag = (countryCode: string) => {
    if (!countryCode || countryCode.length !== 2) return '🌍'
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  if (loading) {
    return (
      <div className="min-h-screen content-wrapper flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-spin">🌍</div>
          <div className="text-2xl font-bold text-gray-300">Loading WorldLeader...</div>
        </div>
      </div>
    )
  }

  const topThree = leaderboard.slice(0, 3)
  const restOfLeaderboard = leaderboard.slice(3)
  const currentRank = selectedTab === 'WORLD' ? user?.currentGlobalRank : user?.currentContinentRank
  const totalPlayers = leaderboard.length
  const progressPercentage = currentRank ? ((totalPlayers - currentRank + 1) / totalPlayers) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-4000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-gray-800/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="text-5xl group-hover:scale-110 transition-transform">🌍</div>
              <div className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                WorldLeader.io
              </div>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-center md:text-right bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-3 rounded-xl border border-blue-500/30">
                  <div className="text-white font-bold flex items-center gap-2 justify-center md:justify-end">
                    <span className="text-3xl">{getCountryFlag(user.countryCode)}</span>
                    <span className="text-xl">{user.username}</span>
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    <span className="text-blue-400 font-bold">#{user.currentContinentRank}</span> {user.continent.replace('_', ' ')} |
                    <span className="text-purple-400 font-bold ml-1">#{user.currentGlobalRank}</span> Global
                  </div>
                </div>

                <div className="flex gap-2">
                  <NotificationBell />
                  <Link
                    href="/profile"
                    className="px-4 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-xl transition-all flex items-center gap-2 border border-gray-700/50"
                  >
                    <span>👤</span>
                    <span className="hidden md:inline">Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-xl transition-all border border-gray-700/50"
                  >
                    <span className="hidden md:inline">Logout</span>
                    <span className="md:hidden">🚪</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-xl transition-all border border-gray-700/50 font-semibold"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all font-bold shadow-lg shadow-blue-500/25"
                >
                  Join to Compete
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Live Activity Ticker */}
      {activity.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 border-b border-gray-800/50 py-3">
          <div className="flex animate-ticker whitespace-nowrap">
            {[...activity, ...activity].map((item, i) => (
              <div key={`${item.id}-${i}`} className="inline-flex items-center gap-2 mx-6 text-sm">
                <span>{getContinentEmoji(item.continent)}</span>
                <span className="text-white font-bold">{item.username}</span>
                <span className="text-gray-400">climbed</span>
                <span className="text-blue-400 font-bold">+{item.positionsPurchased}</span>
                <span className="text-gray-500">{formatRelativeTime(item.timestamp)}</span>
                <span className="text-gray-700 mx-2">|</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Stats Section - Only for logged-in users */}
        {user ? (
          <div className="mb-12">
            <div className="relative bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl border border-gray-700/50 overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 right-10 text-[20rem] leading-none">🌍</div>
              </div>

              <div className="relative p-8 md:p-12">
                <div className="text-center mb-8">
                  <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    YOUR WORLD DOMINATION
                  </h1>
                  <p className="text-gray-400 text-lg">Track your ascent to global supremacy</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-2 border-blue-500/50 rounded-2xl p-6 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-5xl">{getContinentEmoji(user.continent)}</div>
                        <div className="text-blue-400 font-bold text-sm">CONTINENTAL</div>
                      </div>
                      <div className="text-6xl font-black text-white mb-2">#{user.currentContinentRank}</div>
                      <div className="text-gray-300 font-semibold mb-4">{user.continent.replace('_', ' ')}</div>
                      <div className="bg-gray-800/50 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="text-right text-xs text-gray-400 mt-1">Top {progressPercentage.toFixed(0)}%</div>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 rounded-2xl p-6 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-5xl">🌐</div>
                        <div className="text-purple-400 font-bold text-sm">GLOBAL</div>
                      </div>
                      <div className="text-6xl font-black text-white mb-2">#{user.currentGlobalRank}</div>
                      <div className="text-gray-300 font-semibold mb-4">Worldwide Ranking</div>
                      <div className="bg-gray-800/50 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="text-right text-xs text-gray-400 mt-1">Top {progressPercentage.toFixed(0)}%</div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setShowPurchaseModal(true)}
                    className="group relative inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-2xl font-black rounded-2xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
                  >
                    <span className="text-3xl">🚀</span>
                    <span>CLIMB HIGHER</span>
                    <span className="text-3xl group-hover:translate-x-2 transition-transform">→</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <div className="relative bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl border border-gray-700/50 overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 right-10 text-[20rem] leading-none">🌍</div>
              </div>
              <div className="relative p-8 md:p-12 text-center">
                <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  WORLD LEADERBOARD
                </h1>
                <p className="text-gray-400 text-lg mb-8">See who rules the world. Join to compete.</p>
                <Link
                  href="/register"
                  className="group relative inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-2xl font-black rounded-2xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
                >
                  <span className="text-3xl">🚀</span>
                  <span>JOIN TO COMPETE</span>
                  <span className="text-3xl group-hover:translate-x-2 transition-transform">→</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Continent Selector - More Visual */}
        <div className="mb-12">
          <h2 className="text-3xl font-black text-white mb-6 text-center">
            <span className="text-4xl mr-3">🌍</span>
            SELECT YOUR BATTLEGROUND
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedTab('WORLD')}
              className={`group relative overflow-hidden rounded-2xl p-6 transition-all transform hover:scale-105 ${
                selectedTab === 'WORLD'
                  ? 'ring-4 ring-purple-500 shadow-2xl shadow-purple-500/50'
                  : 'hover:ring-2 hover:ring-gray-600'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${getContinentGradient('WORLD')} ${
                selectedTab === 'WORLD' ? 'opacity-30' : 'opacity-10 group-hover:opacity-20'
              } transition-opacity`} />
              <div className="relative">
                <div className="text-6xl mb-3">🌐</div>
                <div className={`font-black text-lg ${selectedTab === 'WORLD' ? 'text-white' : 'text-gray-300'}`}>
                  WORLD
                </div>
              </div>
            </button>

            {CONTINENTS.map((continent) => (
              <button
                key={continent.value}
                onClick={() => setSelectedTab(continent.value)}
                className={`group relative overflow-hidden rounded-2xl p-6 transition-all transform hover:scale-105 ${
                  selectedTab === continent.value
                    ? 'ring-4 ring-blue-500 shadow-2xl shadow-blue-500/50'
                    : 'hover:ring-2 hover:ring-gray-600'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${getContinentGradient(continent.value)} ${
                  selectedTab === continent.value ? 'opacity-30' : 'opacity-10 group-hover:opacity-20'
                } transition-opacity`} />
                <div className="relative">
                  <div className="text-6xl mb-3">{getContinentEmoji(continent.value)}</div>
                  <div className={`font-black text-sm ${selectedTab === continent.value ? 'text-white' : 'text-gray-300'}`}>
                    {continent.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Podium Display for Top 3 */}
        {!leaderboardLoading && topThree.length >= 1 && (
          <div className="mb-12">
            <h2 className="text-4xl font-black text-white mb-8 text-center">
              <span className="text-5xl mr-3">🏆</span>
              THE CHAMPIONS
            </h2>

            <div className="flex items-end justify-center gap-4 md:gap-8 max-w-5xl mx-auto">
              {/* Second Place */}
              {topThree[1] && (
                <div className="flex-1 max-w-xs">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-3xl blur opacity-50" />
                    <div className={`relative bg-gradient-to-t from-gray-700 to-gray-500 rounded-t-3xl p-6 border-4 ${topThree[1].id === user?.id ? 'border-blue-400 ring-4 ring-blue-500/50' : 'border-gray-400'} min-h-48 flex flex-col items-center justify-end`}>
                      <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">
                        {getCountryFlag(topThree[1].countryCode)}
                      </div>
                      <div className="text-white font-black text-xl mb-2 text-center truncate w-full flex items-center justify-center gap-1">
                        {topThree[1].id === user?.id ? 'You' : topThree[1].username}
                        {rankChanges.get(topThree[1].id) === 'up' && (
                          <svg className="w-5 h-5 text-green-400 animate-rank-up" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                        )}
                        {rankChanges.get(topThree[1].id) === 'down' && (
                          <svg className="w-5 h-5 text-red-400 animate-rank-up" style={{ transform: 'rotate(180deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                        )}
                        {getUserBadges(topThree[1]).slice(-3).map(b => (
                          <span key={b.id} title={b.name} className="text-sm">{b.icon}</span>
                        ))}
                      </div>
                      <div className="text-7xl mb-2">🥈</div>
                      <div className="text-gray-200 font-black text-4xl">#2</div>
                    </div>
                  </div>
                </div>
              )}

              {/* First Place - Tallest */}
              {topThree[0] && (
                <div className="flex-1 max-w-xs">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-yellow-600 to-yellow-300 rounded-t-3xl blur opacity-60 animate-pulse" />
                    <div className={`relative bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-3xl p-8 border-4 ${topThree[0].id === user?.id ? 'border-blue-400 ring-4 ring-blue-500/50' : 'border-yellow-300'} min-h-64 flex flex-col items-center justify-end shadow-2xl`}>
                      <div className="text-7xl mb-4 group-hover:scale-125 transition-transform animate-bounce">
                        {getCountryFlag(topThree[0].countryCode)}
                      </div>
                      <div className="text-white font-black text-2xl mb-3 text-center truncate w-full flex items-center justify-center gap-1">
                        {topThree[0].id === user?.id ? 'You' : topThree[0].username}
                        {rankChanges.get(topThree[0].id) === 'up' && (
                          <svg className="w-6 h-6 text-green-400 animate-rank-up" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                        )}
                        {rankChanges.get(topThree[0].id) === 'down' && (
                          <svg className="w-6 h-6 text-red-400 animate-rank-up" style={{ transform: 'rotate(180deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                        )}
                        {getUserBadges(topThree[0]).slice(-3).map(b => (
                          <span key={b.id} title={b.name} className="text-sm">{b.icon}</span>
                        ))}
                      </div>
                      <div className="text-8xl mb-2 animate-pulse">👑</div>
                      <div className="text-white font-black text-5xl">#1</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Third Place */}
              {topThree[2] && (
                <div className="flex-1 max-w-xs">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-700 to-orange-400 rounded-t-3xl blur opacity-50" />
                    <div className={`relative bg-gradient-to-t from-orange-800 to-orange-600 rounded-t-3xl p-6 border-4 ${topThree[2].id === user?.id ? 'border-blue-400 ring-4 ring-blue-500/50' : 'border-orange-400'} min-h-40 flex flex-col items-center justify-end`}>
                      <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">
                        {getCountryFlag(topThree[2].countryCode)}
                      </div>
                      <div className="text-white font-black text-xl mb-2 text-center truncate w-full flex items-center justify-center gap-1">
                        {topThree[2].id === user?.id ? 'You' : topThree[2].username}
                        {rankChanges.get(topThree[2].id) === 'up' && (
                          <svg className="w-5 h-5 text-green-400 animate-rank-up" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                        )}
                        {rankChanges.get(topThree[2].id) === 'down' && (
                          <svg className="w-5 h-5 text-red-400 animate-rank-up" style={{ transform: 'rotate(180deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                        )}
                        {getUserBadges(topThree[2]).slice(-3).map(b => (
                          <span key={b.id} title={b.name} className="text-sm">{b.icon}</span>
                        ))}
                      </div>
                      <div className="text-7xl mb-2">🥉</div>
                      <div className="text-orange-100 font-black text-4xl">#3</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rest of Leaderboard - Visual Cards */}
        <div className="mb-12">
          <h2 className="text-3xl font-black text-white mb-6 text-center">
            <span className="text-4xl mr-3">⚔️</span>
            THE CONTENDERS
          </h2>

          {leaderboardLoading ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6 animate-spin inline-block">🌍</div>
              <p className="text-2xl text-gray-400 font-bold">Loading champions...</p>
            </div>
          ) : restOfLeaderboard.length === 0 && topThree.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700/50">
              <div className="text-9xl mb-6">🏆</div>
              <p className="text-3xl font-black text-gray-200 mb-3">Be the First Legend!</p>
              <p className="text-xl text-gray-400">Claim your throne and start your reign</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {restOfLeaderboard.map((entry) => {
                const rank = selectedTab === 'WORLD' ? entry.currentGlobalRank : entry.currentContinentRank
                const isCurrentUser = entry.id === user?.id

                return (
                  <div
                    key={entry.id}
                    className={`group relative overflow-hidden rounded-2xl transition-all transform hover:scale-[1.02] ${
                      isCurrentUser
                        ? 'ring-4 ring-blue-500 shadow-2xl shadow-blue-500/30'
                        : 'hover:shadow-xl'
                    }`}
                  >
                    <div className={`absolute inset-0 ${
                      isCurrentUser
                        ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30'
                        : 'bg-gradient-to-r from-gray-800/80 to-gray-900/80'
                    } backdrop-blur-sm`} />

                    <div className="relative flex items-center gap-6 p-6">
                      {/* Rank Badge */}
                      <div className={`flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl ${
                        isCurrentUser
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                          : 'bg-gradient-to-br from-gray-700 to-gray-600 text-gray-300'
                      }`}>
                        #{rank}
                      </div>

                      {/* Flag */}
                      <div className="text-6xl group-hover:scale-125 transition-transform">
                        {getCountryFlag(entry.countryCode)}
                      </div>

                      {/* Username */}
                      <div className="flex-1">
                        <div className={`text-2xl font-black flex items-center gap-2 ${
                          isCurrentUser ? 'text-white' : 'text-gray-200 group-hover:text-white'
                        } transition-colors`}>
                          {entry.username}
                          {isCurrentUser && (
                            <span className="text-blue-400 text-lg">(YOU)</span>
                          )}
                          {getUserBadges(entry).slice(-3).map(b => (
                            <span key={b.id} title={b.name} className="text-sm">{b.icon}</span>
                          ))}
                          {rankChanges.get(entry.id) === 'up' && (
                            <svg className="w-5 h-5 text-green-400 animate-rank-up flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                          )}
                          {rankChanges.get(entry.id) === 'down' && (
                            <svg className="w-5 h-5 text-red-400 animate-rank-up flex-shrink-0" style={{ transform: 'rotate(180deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                          )}
                        </div>
                        {selectedTab === 'WORLD' && (
                          <div className="text-gray-400 text-sm font-semibold mt-1">
                            {getContinentEmoji(entry.continent)} {entry.continent.replace('_', ' ')}
                          </div>
                        )}
                      </div>

                      {/* Visual Indicator + Share */}
                      {isCurrentUser && (
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <button
                            onClick={() => setShowShareModal(true)}
                            className="px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-xl text-sm text-purple-300 font-bold transition-all hover:scale-105"
                          >
                            Share
                          </button>
                          <div className="text-5xl animate-bounce">⭐</div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Purchase Modal - Only for logged-in users */}
      {user && showPurchaseModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-gray-700/50 rounded-3xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -z-10" />

            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-4xl font-black text-white mb-2">
                CLIMB HIGHER
              </h2>
              <p className="text-gray-300 font-semibold">
                Purchase positions to dominate the leaderboard
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-4 mb-6">
              <p className="text-center text-blue-300 font-black text-lg">
                💵 $1 USD = 1 Position Higher
              </p>
            </div>

            {/* Quick Purchase Presets */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[5, 10, 25, 50].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => { setPurchaseAmount(String(amount)); fetchPreview(String(amount)) }}
                  className={`py-3 rounded-xl font-black text-lg transition-all transform hover:scale-105 border-2 ${
                    purchaseAmount === String(amount)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-400 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-800/80 border-gray-600/50 text-gray-300 hover:border-blue-500/50 hover:text-white'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <form onSubmit={handlePurchase} className="space-y-6">
              {purchaseError && (
                <div className="bg-red-500/20 border-2 border-red-500/50 rounded-2xl p-4 text-red-300 font-semibold text-center">
                  ⚠️ {purchaseError}
                </div>
              )}

              <div>
                <label className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="10000"
                  step="1"
                  value={purchaseAmount}
                  onChange={(e) => { setPurchaseAmount(e.target.value); fetchPreview(e.target.value) }}
                  className="w-full px-6 py-4 bg-gray-900/80 border-2 border-gray-600/50 rounded-2xl text-white text-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="Enter amount"
                />
                {purchaseAmount && (
                  <div className="mt-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-500/30 rounded-2xl p-4 text-center">
                    <p className="text-gray-300">
                      You will climb <span className="font-black text-3xl text-blue-400">{parseInt(purchaseAmount, 10) || 0}</span>
                      <span className="font-bold text-purple-400 text-xl ml-2">positions</span>
                      <span className="text-3xl ml-2">⬆️</span>
                    </p>
                  </div>
                )}
                {purchaseAmount && preview && !previewLoading && (
                  <div className="mt-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-purple-500/30 rounded-2xl p-4">
                    <p className="text-center text-sm text-gray-300 mb-2 font-bold">Predicted Rank</p>
                    <div className="flex justify-center gap-6 text-center">
                      <div>
                        <span className="text-blue-400 font-black text-2xl">#{preview.predictedContinentRank}</span>
                        <p className="text-xs text-gray-400 mt-1">Continental</p>
                      </div>
                      <div className="border-l border-gray-600" />
                      <div>
                        <span className="text-purple-400 font-black text-2xl">#{preview.predictedGlobalRank}</span>
                        <p className="text-xs text-gray-400 mt-1">Global</p>
                      </div>
                    </div>
                    {preview.overtaken.length > 0 && (
                      <p className="text-center text-sm text-gray-300 mt-3">
                        You&apos;ll overtake{' '}
                        {preview.overtaken.map((u, i) => (
                          <span key={u.username}>
                            <span className="text-pink-400 font-bold">@{u.username}</span>
                            {i < preview.overtaken.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                )}
                {purchaseAmount && previewLoading && (
                  <div className="mt-3 text-center text-gray-500 text-sm py-2">Calculating preview...</div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPurchaseModal(false)
                    setPurchaseError('')
                    setPurchaseAmount('')
                    setPreview(null)
                  }}
                  className="flex-1 px-6 py-4 bg-gray-700/80 hover:bg-gray-600/80 border-2 border-gray-600/50 text-white font-black text-lg rounded-2xl transition-all hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={purchasing}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-black text-lg rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-blue-500/50"
                >
                  {purchasing ? '⏳ Redirecting...' : '✨ Pay with Stripe'}
                </button>
              </div>
            </form>

            <p className="mt-6 text-xs text-gray-500 text-center italic">
              🔒 Secure payment via Stripe
            </p>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {user && showShareModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-gray-700/50 rounded-3xl max-w-md w-full p-8 shadow-2xl relative">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔗</div>
              <h2 className="text-3xl font-black text-white mb-2">Share Your Rank</h2>
              <p className="text-gray-400">Let the world know where you stand</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  const url = `${window.location.origin}/u/${user.username}`
                  navigator.clipboard.writeText(url)
                  toast.success('Link copied!')
                }}
                className="w-full px-6 py-4 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-2xl font-bold border border-gray-700/50 transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Copy Profile Link
              </button>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/u/${user.username}`
                  const text = `I'm ranked #${user.currentGlobalRank} globally on WorldLeader.io! Can you beat me?`
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
                }}
                className="w-full px-6 py-4 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-2xl font-bold border border-gray-700/50 transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="mt-6 w-full px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-2xl font-bold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Toaster position="top-center" />

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800/50 bg-black/70 backdrop-blur-xl">
        <div className="container mx-auto text-center text-gray-400">
          <div className="flex justify-center gap-6 mb-4 flex-wrap">
            <Link href="/terms" className="hover:text-white transition-colors text-sm font-semibold">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors text-sm font-semibold">Privacy</Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors text-sm font-semibold">Disclaimer</Link>
            <Link href="/faq" className="hover:text-white transition-colors text-sm font-semibold">FAQ</Link>
          </div>
          <p className="text-sm">
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">WorldLeader.io</span> - Entertainment Only
          </p>
          <p className="text-xs mt-2">© {new Date().getFullYear()} - For Entertainment Purposes Only</p>
        </div>
      </footer>
    </div>
  )
}
