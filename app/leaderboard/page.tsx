'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CONTINENTS } from '@/lib/countries'

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
  const [purchaseSuccess, setPurchaseSuccess] = useState('')

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchLeaderboard()
    }
  }, [selectedTab, user])

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/login')
        return
      }
      const data = await response.json()
      setUser(data.user)
      setSelectedTab(data.user.continent)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true)
    try {
      const continent = selectedTab === 'WORLD' ? '' : selectedTab
      const url = continent ? `/api/leaderboard?continent=${continent}` : '/api/leaderboard'
      const response = await fetch(url)
      const data = await response.json()
      setLeaderboard(data.leaderboard || [])
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLeaderboardLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    setPurchaseError('')
    setPurchaseSuccess('')
    setPurchasing(true)

    try {
      const amount = parseFloat(purchaseAmount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount')
      }

      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountUsd: amount }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Purchase failed')
      }

      setPurchaseSuccess(data.message)
      setPurchaseAmount('')
      await fetchCurrentUser()
      await fetchLeaderboard()

      setTimeout(() => {
        setShowPurchaseModal(false)
        setPurchaseSuccess('')
      }, 2000)
    } catch (err: any) {
      setPurchaseError(err.message)
    } finally {
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

            <div className="flex items-center gap-4">
              <div className="text-center md:text-right bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-3 rounded-xl border border-blue-500/30">
                <div className="text-white font-bold flex items-center gap-2 justify-center md:justify-end">
                  <span className="text-3xl">{getCountryFlag(user?.countryCode || '')}</span>
                  <span className="text-xl">{user?.username}</span>
                </div>
                <div className="text-sm text-gray-300 mt-1">
                  <span className="text-blue-400 font-bold">#{user?.currentContinentRank}</span> {user?.continent.replace('_', ' ')} |
                  <span className="text-purple-400 font-bold ml-1">#{user?.currentGlobalRank}</span> Global
                </div>
              </div>

              <div className="flex gap-2">
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
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Stats Section with Visual Progress */}
        <div className="mb-12">
          <div className="relative bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl border border-gray-700/50 overflow-hidden">
            {/* Globe Background Pattern */}
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

              {/* Visual Rank Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
                {/* Continental Rank Card */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-2 border-blue-500/50 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-5xl">{getContinentEmoji(user?.continent || '')}</div>
                      <div className="text-blue-400 font-bold text-sm">CONTINENTAL</div>
                    </div>
                    <div className="text-6xl font-black text-white mb-2">#{user?.currentContinentRank}</div>
                    <div className="text-gray-300 font-semibold mb-4">{user?.continent.replace('_', ' ')}</div>

                    {/* Progress Bar */}
                    <div className="bg-gray-800/50 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <div className="text-right text-xs text-gray-400 mt-1">Top {progressPercentage.toFixed(0)}%</div>
                  </div>
                </div>

                {/* Global Rank Card */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-5xl">🌐</div>
                      <div className="text-purple-400 font-bold text-sm">GLOBAL</div>
                    </div>
                    <div className="text-6xl font-black text-white mb-2">#{user?.currentGlobalRank}</div>
                    <div className="text-gray-300 font-semibold mb-4">Worldwide Ranking</div>

                    {/* Progress Bar */}
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

              {/* Call to Action */}
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
        {!leaderboardLoading && topThree.length >= 3 && (
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
                    <div className="relative bg-gradient-to-t from-gray-700 to-gray-500 rounded-t-3xl p-6 border-4 border-gray-400 h-48 flex flex-col items-center justify-end">
                      <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">
                        {getCountryFlag(topThree[1].countryCode)}
                      </div>
                      <div className="text-white font-black text-xl mb-2 text-center truncate w-full">
                        {topThree[1].username}
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
                    <div className="relative bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-3xl p-8 border-4 border-yellow-300 h-64 flex flex-col items-center justify-end shadow-2xl">
                      <div className="text-7xl mb-4 group-hover:scale-125 transition-transform animate-bounce">
                        {getCountryFlag(topThree[0].countryCode)}
                      </div>
                      <div className="text-white font-black text-2xl mb-3 text-center truncate w-full">
                        {topThree[0].username}
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
                    <div className="relative bg-gradient-to-t from-orange-800 to-orange-600 rounded-t-3xl p-6 border-4 border-orange-400 h-40 flex flex-col items-center justify-end">
                      <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">
                        {getCountryFlag(topThree[2].countryCode)}
                      </div>
                      <div className="text-white font-black text-xl mb-2 text-center truncate w-full">
                        {topThree[2].username}
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
                        <div className={`text-2xl font-black ${
                          isCurrentUser ? 'text-white' : 'text-gray-200 group-hover:text-white'
                        } transition-colors`}>
                          {entry.username}
                          {isCurrentUser && (
                            <span className="ml-3 text-blue-400 text-lg">(YOU)</span>
                          )}
                        </div>
                        {selectedTab === 'WORLD' && (
                          <div className="text-gray-400 text-sm font-semibold mt-1">
                            {getContinentEmoji(entry.continent)} {entry.continent.replace('_', ' ')}
                          </div>
                        )}
                      </div>

                      {/* Visual Indicator */}
                      {isCurrentUser && (
                        <div className="flex-shrink-0">
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

      {/* Purchase Modal - Same as before */}
      {showPurchaseModal && (
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

            <form onSubmit={handlePurchase} className="space-y-6">
              {purchaseError && (
                <div className="bg-red-500/20 border-2 border-red-500/50 rounded-2xl p-4 text-red-300 font-semibold text-center">
                  ⚠️ {purchaseError}
                </div>
              )}

              {purchaseSuccess && (
                <div className="bg-green-500/20 border-2 border-green-500/50 rounded-2xl p-4 text-green-300 font-semibold text-center">
                  ✅ {purchaseSuccess}
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
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-900/80 border-2 border-gray-600/50 rounded-2xl text-white text-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="Enter amount"
                />
                {purchaseAmount && (
                  <div className="mt-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-500/30 rounded-2xl p-4 text-center">
                    <p className="text-gray-300">
                      You will climb <span className="font-black text-3xl text-blue-400">{Math.floor(parseFloat(purchaseAmount) || 0)}</span>
                      <span className="font-bold text-purple-400 text-xl ml-2">positions</span>
                      <span className="text-3xl ml-2">⬆️</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPurchaseModal(false)
                    setPurchaseError('')
                    setPurchaseSuccess('')
                    setPurchaseAmount('')
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
                  {purchasing ? '⏳ Processing...' : '✨ Confirm'}
                </button>
              </div>
            </form>

            <p className="mt-6 text-xs text-gray-500 text-center italic">
              MVP Mode: Payment processing is simulated
            </p>
          </div>
        </div>
      )}

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
