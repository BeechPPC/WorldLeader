'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface LeaderboardEntry {
  id: string
  username: string
  countryCode: string
  currentGlobalRank: number
  continent: string
}

export default function HomePage() {
  const [topLeaders, setTopLeaders] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopLeaders()
  }, [])

  const fetchTopLeaders = async () => {
    try {
      const response = await fetch('/api/leaderboard?limit=10')
      const data = await response.json()
      setTopLeaders(data.leaderboard || [])
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
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

  return (
    <div className="min-h-screen content-wrapper">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            WorldLeader.io
          </div>
          <div className="space-x-4">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
            >
              Join the Competition
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 bg-clip-text text-transparent">
            WorldLeader.io
          </h1>
          <p className="text-3xl md:text-4xl font-bold text-gray-200 mb-4">
            Climb your continent. Conquer the world.
          </p>
          <p className="text-xl text-gray-400 mb-12">
            Your position. The world's watching.
          </p>

          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-600/50"
          >
            Start Your Climb
          </Link>
        </div>
      </section>

      {/* Live Leaderboard Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-100">
            🌍 Current World Leaders
          </h2>

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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Continent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                      Loading leaderboard...
                    </td>
                  </tr>
                ) : topLeaders.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                      Be the first to join! 🚀
                    </td>
                  </tr>
                ) : (
                  topLeaders.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-lg font-bold">
                          {getRankIcon(entry.currentGlobalRank)}
                          <span
                            className={
                              entry.currentGlobalRank === 1
                                ? 'text-yellow-400'
                                : entry.currentGlobalRank === 2
                                ? 'text-gray-300'
                                : entry.currentGlobalRank === 3
                                ? 'text-orange-400'
                                : 'text-gray-400'
                            }
                          >
                            #{entry.currentGlobalRank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {getCountryFlag(entry.countryCode)}
                          </span>
                          <span className="font-semibold text-gray-100">
                            {entry.username}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {entry.continent.replace('_', ' ')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/leaderboard"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              View Full Leaderboard →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-100">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2 text-gray-100">
                Choose Your Continent
              </h3>
              <p className="text-gray-400">
                Start at the bottom of your continental leaderboard
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-2 text-gray-100">
                Climb the Ranks
              </h3>
              <p className="text-gray-400">
                Purchase positions to move up - $1 = 1 position
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">👑</div>
              <h3 className="text-xl font-bold mb-2 text-gray-100">
                Dominate the World
              </h3>
              <p className="text-gray-400">
                Compete globally and become the World Leader
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800 bg-black/50">
        <div className="container mx-auto text-center text-gray-400">
          <p className="text-sm italic">Your position. The world's watching.</p>
          <p className="text-xs mt-2">WorldLeader.io - {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
