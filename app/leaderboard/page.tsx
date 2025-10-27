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

      // Refresh user and leaderboard
      await fetchCurrentUser()
      await fetchLeaderboard()

      // Close modal after 2 seconds
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

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '👑'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen content-wrapper flex items-center justify-center">
        <div className="text-gray-400 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen content-wrapper overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-black to-purple-950" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Header */}
      <header className="relative border-b border-gray-800/50 bg-black/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-4xl animate-pulse">🌍</div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              WorldLeader.io
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-gray-200 font-bold flex items-center gap-2">
                <span className="text-2xl">{getCountryFlag(user?.countryCode || '')}</span>
                {user?.username}
              </div>
              <div className="text-sm text-gray-400">
                Continent: <span className="text-blue-400 font-semibold">#{user?.currentContinentRank}</span> | Global: <span className="text-purple-400 font-semibold">#{user?.currentGlobalRank}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* User Stats Card */}
        <div className="mb-8 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-3xl font-black text-gray-100 mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Position
              </h2>
              <div className="flex gap-8">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30 hover:scale-105 transition-transform">
                  <div className="text-gray-300 text-sm uppercase tracking-wide mb-1">Your Continent</div>
                  <div className="text-4xl font-black text-blue-400 mb-1">#{user?.currentContinentRank}</div>
                  <div className="text-gray-400 text-sm">{user?.continent.replace('_', ' ')}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 hover:scale-105 transition-transform">
                  <div className="text-gray-300 text-sm uppercase tracking-wide mb-1">Global Rank</div>
                  <div className="text-4xl font-black text-purple-400 mb-1">#{user?.currentGlobalRank}</div>
                  <div className="text-gray-400 text-sm">Worldwide</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xl font-black rounded-xl transition-all transform hover:scale-110 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/75 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                🚀 Climb Higher
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        {/* Continent Tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedTab('WORLD')}
            className={`px-6 py-3 rounded-xl font-black transition-all transform hover:scale-105 ${
              selectedTab === 'WORLD'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50'
            }`}
          >
            🌍 WORLD LEADERS
          </button>
          {CONTINENTS.map((continent) => (
            <button
              key={continent.value}
              onClick={() => setSelectedTab(continent.value)}
              className={`px-6 py-3 rounded-xl font-black transition-all transform hover:scale-105 ${
                selectedTab === continent.value
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50'
              }`}
            >
              {continent.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
          <table className="w-full">
            <thead className="bg-gray-800/80 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-300 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-300 uppercase tracking-wider">
                  Leader
                </th>
                {selectedTab === 'WORLD' && (
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-300 uppercase tracking-wider">
                    Continent
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {leaderboardLoading ? (
                <tr>
                  <td colSpan={selectedTab === 'WORLD' ? 3 : 2} className="px-6 py-20 text-center">
                    <div className="inline-block animate-spin text-6xl mb-4">🌍</div>
                    <p className="text-gray-400">Loading champions...</p>
                  </td>
                </tr>
              ) : leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={selectedTab === 'WORLD' ? 3 : 2} className="px-6 py-20 text-center">
                    <div className="text-6xl mb-4">🏆</div>
                    <p className="text-2xl font-bold text-gray-300 mb-2">Be the First Legend!</p>
                    <p className="text-gray-400">No one has claimed the throne yet...</p>
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, index) => {
                  const rank = selectedTab === 'WORLD' ? entry.currentGlobalRank : entry.currentContinentRank
                  const isCurrentUser = entry.id === user?.id

                  return (
                    <tr
                      key={entry.id}
                      className={`transition-all group ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-l-4 border-blue-500'
                          : index === 0 && rank === 1
                          ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className={`flex items-center gap-3 text-lg font-black ${
                          rank === 1 ? 'animate-pulse' : ''
                        }`}>
                          {getRankIcon(rank) && <span className="text-3xl">{getRankIcon(rank)}</span>}
                          <span
                            className={
                              rank === 1
                                ? 'text-yellow-400 text-2xl'
                                : rank === 2
                                ? 'text-gray-300 text-2xl'
                                : rank === 3
                                ? 'text-orange-400 text-2xl'
                                : 'text-gray-500 text-xl'
                            }
                          >
                            #{rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl group-hover:scale-110 transition-transform">
                            {getCountryFlag(entry.countryCode)}
                          </span>
                          <div>
                            <div className={`font-black text-xl ${isCurrentUser ? 'text-blue-400' : 'text-gray-100 group-hover:text-white'} transition-colors`}>
                              {entry.username}
                              {isCurrentUser && ' (You)'}
                            </div>
                          </div>
                        </div>
                      </td>
                      {selectedTab === 'WORLD' && (
                        <td className="px-6 py-5">
                          <div className="text-gray-300 font-semibold">
                            🌍 {entry.continent.replace('_', ' ')}
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-gray-700/50 rounded-2xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -z-10" />

            <h2 className="text-3xl font-black text-gray-100 mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🚀 Climb Higher
            </h2>
            <p className="text-gray-300 mb-6 font-semibold">
              How many positions do you want to climb?
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mb-6">
              <p className="text-sm text-blue-300 text-center font-bold">
                💵 $1 USD = 1 Position Up
              </p>
            </div>

            <form onSubmit={handlePurchase} className="space-y-6">
              {purchaseError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300 text-sm font-semibold">
                  ⚠️ {purchaseError}
                </div>
              )}

              {purchaseSuccess && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-green-300 text-sm font-semibold">
                  ✅ {purchaseSuccess}
                </div>
              )}

              <div>
                <label className="block text-sm font-black text-gray-300 mb-2 uppercase tracking-wide">
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
                  className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-gray-100 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter amount"
                />
                {purchaseAmount && (
                  <div className="mt-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-3">
                    <p className="text-sm text-gray-300">
                      You will climb <span className="font-black text-xl text-blue-400">{Math.floor(parseFloat(purchaseAmount) || 0)}</span> <span className="font-bold text-purple-400">positions</span> ⬆️
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
                  className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 text-white font-bold rounded-xl transition-all hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={purchasing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-black rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/50"
                >
                  {purchasing ? '⏳ Processing...' : '✨ Confirm Purchase'}
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
      <footer className="py-8 px-4 border-t border-gray-800/50 bg-black/50 mt-12">
        <div className="container mx-auto text-center text-gray-400">
          <div className="flex justify-center gap-6 mb-4 flex-wrap">
            <Link href="/terms" className="hover:text-white transition-colors text-sm">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors text-sm">Disclaimer</Link>
            <Link href="/faq" className="hover:text-white transition-colors text-sm">FAQ</Link>
          </div>
          <p className="text-sm">
            <span className="font-bold text-purple-400">WorldLeader.io</span> - Entertainment Only
          </p>
          <p className="text-xs mt-2">© {new Date().getFullYear()} - For Entertainment Purposes Only</p>
        </div>
      </footer>
    </div>
  )
}
