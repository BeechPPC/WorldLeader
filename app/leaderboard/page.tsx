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
    <div className="min-h-screen content-wrapper">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            WorldLeader.io
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-gray-300 font-semibold flex items-center gap-2">
                <span className="text-2xl">{getCountryFlag(user?.countryCode || '')}</span>
                {user?.username}
              </div>
              <div className="text-sm text-gray-400">
                Continent: #{user?.currentContinentRank} | Global: #{user?.currentGlobalRank}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* User Stats Card */}
        <div className="mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Your Position</h2>
              <div className="flex gap-6">
                <div>
                  <div className="text-gray-400 text-sm">Your Continent</div>
                  <div className="text-3xl font-bold text-blue-400">#{user?.currentContinentRank}</div>
                  <div className="text-gray-400 text-sm">{user?.continent.replace('_', ' ')}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Global Rank</div>
                  <div className="text-3xl font-bold text-purple-400">#{user?.currentGlobalRank}</div>
                  <div className="text-gray-400 text-sm">Worldwide</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-600/50"
            >
              Climb Higher
            </button>
          </div>
        </div>

        {/* Continent Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTab('WORLD')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedTab === 'WORLD'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🌍 WORLD LEADERS
          </button>
          {CONTINENTS.map((continent) => (
            <button
              key={continent.value}
              onClick={() => setSelectedTab(continent.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedTab === continent.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {continent.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900/50 backdrop-blur rounded-lg border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Leader
                </th>
                {selectedTab === 'WORLD' && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Continent
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {leaderboardLoading ? (
                <tr>
                  <td colSpan={selectedTab === 'WORLD' ? 3 : 2} className="px-6 py-8 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={selectedTab === 'WORLD' ? 3 : 2} className="px-6 py-8 text-center text-gray-400">
                    No leaders yet. Be the first!
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry) => {
                  const rank = selectedTab === 'WORLD' ? entry.currentGlobalRank : entry.currentContinentRank
                  const isCurrentUser = entry.id === user?.id

                  return (
                    <tr
                      key={entry.id}
                      className={`transition-colors ${
                        isCurrentUser
                          ? 'bg-blue-600/20 border-l-4 border-blue-500'
                          : 'hover:bg-gray-800/30'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-lg font-bold">
                          {getRankIcon(rank)}
                          <span
                            className={
                              rank === 1
                                ? 'text-yellow-400'
                                : rank === 2
                                ? 'text-gray-300'
                                : rank === 3
                                ? 'text-orange-400'
                                : 'text-gray-400'
                            }
                          >
                            #{rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {getCountryFlag(entry.countryCode)}
                          </span>
                          <span className={`font-semibold ${isCurrentUser ? 'text-blue-400' : 'text-gray-100'}`}>
                            {entry.username}
                            {isCurrentUser && ' (You)'}
                          </span>
                        </div>
                      </td>
                      {selectedTab === 'WORLD' && (
                        <td className="px-6 py-4 text-gray-300">
                          {entry.continent.replace('_', ' ')}
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Climb Higher</h2>
            <p className="text-gray-400 mb-6">
              How many positions do you want to climb? $1 USD = 1 position
            </p>

            <form onSubmit={handlePurchase} className="space-y-6">
              {purchaseError && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
                  {purchaseError}
                </div>
              )}

              {purchaseSuccess && (
                <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-green-400 text-sm">
                  {purchaseSuccess}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Enter amount"
                />
                {purchaseAmount && (
                  <p className="mt-2 text-sm text-gray-400">
                    You will climb <span className="font-bold text-blue-400">{Math.floor(parseFloat(purchaseAmount) || 0)} positions</span>
                  </p>
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
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={purchasing}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
                >
                  {purchasing ? 'Processing...' : 'Confirm Purchase'}
                </button>
              </div>
            </form>

            <p className="mt-4 text-xs text-gray-500 text-center">
              MVP Mode: Payment processing is simulated
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
