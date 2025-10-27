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
  const [stats, setStats] = useState({ totalUsers: 0, totalClimbed: 0, continents: 7 })

  useEffect(() => {
    fetchTopLeaders()
    // Animate stats on load
    animateStats()
  }, [])

  const fetchTopLeaders = async () => {
    try {
      const response = await fetch('/api/leaderboard?limit=5')
      const data = await response.json()
      setTopLeaders(data.leaderboard || [])
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const animateStats = () => {
    // Simulated stats animation
    let users = 0
    let climbed = 0
    const interval = setInterval(() => {
      if (users < topLeaders.length) users++
      if (climbed < 1847) climbed += 47
      setStats({ totalUsers: users, totalClimbed: climbed, continents: 7 })
      if (users >= topLeaders.length && climbed >= 1847) clearInterval(interval)
    }, 50)
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
    return '🏅'
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
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-pulse">🌍</div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              WorldLeader.io
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transform"
            >
              Join Now
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Dramatically Enhanced */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 text-6xl opacity-10 animate-float">👑</div>
          <div className="absolute top-40 right-1/4 text-5xl opacity-10 animate-float animation-delay-2000">🏆</div>
          <div className="absolute bottom-20 left-1/3 text-4xl opacity-10 animate-float animation-delay-4000">⚡</div>
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          {/* Main Headline */}
          <div className="mb-6 relative">
            <h1 className="text-7xl md:text-8xl font-black mb-4 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Become the
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-gradient-reverse text-8xl md:text-9xl">
                WORLD LEADER
              </span>
            </h1>
          </div>

          {/* Taglines */}
          <p className="text-2xl md:text-3xl font-bold text-gray-200 mb-3 animate-fade-in">
            💪 Climb your continent. 🌍 Conquer the world.
          </p>
          <p className="text-xl text-purple-300 mb-12 animate-fade-in animation-delay-500 italic">
            Your position. The world's watching.
          </p>

          {/* Live Stats Bar */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12 animate-fade-in animation-delay-1000">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30 hover:scale-110 transition-transform">
              <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {stats.totalUsers}+
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Competitors</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 hover:scale-110 transition-transform">
              <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {stats.totalClimbed.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Positions Climbed</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-pink-500/30 hover:scale-110 transition-transform">
              <div className="text-3xl font-black bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                {stats.continents}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Continents</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xl font-black rounded-xl transition-all transform hover:scale-110 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/75 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                🚀 START YOUR CLIMB
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/leaderboard"
              className="px-10 py-5 bg-white/5 hover:bg-white/10 border-2 border-purple-500/50 hover:border-purple-400 text-white text-xl font-bold rounded-xl transition-all hover:scale-105 backdrop-blur-sm"
            >
              👀 View Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* Live Leaderboard Preview - Enhanced */}
      <section className="py-16 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-3 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              👑 HALL OF FAME
            </h2>
            <p className="text-gray-400 text-lg">The elite. The champions. The legends.</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block animate-spin text-6xl mb-4">🌍</div>
                <p className="text-gray-400">Loading champions...</p>
              </div>
            ) : topLeaders.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <p className="text-2xl font-bold text-gray-300 mb-2">Be the First Legend!</p>
                <p className="text-gray-400">No one has claimed the throne yet...</p>
                <Link
                  href="/register"
                  className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  Claim Your Throne
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-800/50">
                {topLeaders.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-all group ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10' : ''
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Rank with special styling */}
                    <div className={`text-5xl font-black min-w-[80px] text-center ${
                      entry.currentGlobalRank === 1 ? 'animate-pulse' : ''
                    }`}>
                      <div className="text-3xl mb-1">{getRankIcon(entry.currentGlobalRank)}</div>
                      <div className={
                        entry.currentGlobalRank === 1
                          ? 'text-yellow-400'
                          : entry.currentGlobalRank === 2
                          ? 'text-gray-300'
                          : entry.currentGlobalRank === 3
                          ? 'text-orange-400'
                          : 'text-gray-500'
                      }>
                        #{entry.currentGlobalRank}
                      </div>
                    </div>

                    {/* Flag */}
                    <div className="text-5xl group-hover:scale-110 transition-transform">
                      {getCountryFlag(entry.countryCode)}
                    </div>

                    {/* User info */}
                    <div className="flex-1">
                      <div className="font-black text-2xl text-gray-100 group-hover:text-white transition-colors">
                        {entry.username}
                      </div>
                      <div className="text-sm text-gray-400">
                        🌍 {entry.continent.replace('_', ' ')}
                      </div>
                    </div>

                    {/* Badge */}
                    {entry.currentGlobalRank === 1 && (
                      <div className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black text-sm rounded-full uppercase tracking-wide animate-pulse">
                        World Leader
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="text-center py-6 bg-gray-900/50 border-t border-gray-800/50">
              <Link
                href="/leaderboard"
                className="text-purple-400 hover:text-purple-300 font-bold text-lg inline-flex items-center gap-2 group"
              >
                See Full Rankings
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Gamified */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-black/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ⚡ HOW TO DOMINATE
            </h2>
            <p className="text-gray-400 text-lg">Three steps to world domination</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all hover:scale-105 hover:-translate-y-2">
              <div className="absolute -top-6 left-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                1
              </div>
              <div className="text-7xl mb-6 text-center group-hover:scale-110 transition-transform">🌍</div>
              <h3 className="text-2xl font-black mb-3 text-gray-100">
                Choose Your Battlefield
              </h3>
              <p className="text-gray-400">
                Pick your continent and country. Start at the bottom. The only way is <span className="text-blue-400 font-bold">UP</span>.
              </p>
            </div>

            <div className="group relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/50 transition-all hover:scale-105 hover:-translate-y-2">
              <div className="absolute -top-6 left-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                2
              </div>
              <div className="text-7xl mb-6 text-center group-hover:scale-110 transition-transform">📈</div>
              <h3 className="text-2xl font-black mb-3 text-gray-100">
                Purchase Power
              </h3>
              <p className="text-gray-400">
                $1 = Move up 1 position. Want to jump 50 spots? Invest $50. <span className="text-purple-400 font-bold">Simple. Powerful.</span>
              </p>
            </div>

            <div className="group relative bg-gradient-to-br from-pink-500/10 to-red-500/10 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/20 hover:border-pink-400/50 transition-all hover:scale-105 hover:-translate-y-2">
              <div className="absolute -top-6 left-8 bg-gradient-to-r from-pink-600 to-red-600 text-white font-black text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                3
              </div>
              <div className="text-7xl mb-6 text-center group-hover:scale-110 transition-transform">👑</div>
              <h3 className="text-2xl font-black mb-3 text-gray-100">
                Rule the World
              </h3>
              <p className="text-gray-400">
                Dominate your continent. Crush global competition. <span className="text-pink-400 font-bold">Become legendary.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/30">
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Ready to Make History?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of competitors fighting for global domination.
            </p>
            <Link
              href="/register"
              className="inline-block px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-2xl font-black rounded-2xl transition-all transform hover:scale-110 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/75"
            >
              🚀 START CLIMBING NOW
            </Link>
            <p className="mt-6 text-sm text-gray-500 italic">
              Your position. The world's watching.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800/50 bg-black/50">
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
