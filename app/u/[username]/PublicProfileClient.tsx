'use client'

import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { getUserBadges } from '@/lib/badges'

interface BattleLogEntry {
  id: string
  type: 'outgoing' | 'incoming'
  climber: { username: string; countryCode: string }
  affectedUser: { username: string; countryCode: string }
  continent: string
  climbedToRank: number
  createdAt: string
}

interface PublicProfileProps {
  user: {
    username: string
    countryCode: string
    continent: string
    currentContinentRank: number
    currentGlobalRank: number
    totalPositionsPurchased: number
    createdAt: string
  }
  battleLog?: BattleLogEntry[]
}

const getContinentEmoji = (continent: string) => {
  const emojiMap: { [key: string]: string } = {
    'AFRICA': '🌍', 'ASIA': '🌏', 'EUROPE': '🌍',
    'NORTH_AMERICA': '🌎', 'SOUTH_AMERICA': '🌎',
    'OCEANIA': '🌏', 'ANTARCTICA': '🧊',
  }
  return emojiMap[continent] || '🌍'
}

const getCountryFlag = (countryCode: string) => {
  if (!countryCode || countryCode.length !== 2) return '🌍'
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
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

export default function PublicProfileClient({ user, battleLog = [] }: PublicProfileProps) {
  const profileUrl = `${window.location.origin}/u/${user.username}`
  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success('Link copied!')
  }

  const handleShareX = () => {
    const text = `I'm ranked #${user.currentGlobalRank} globally on WorldLeader.io! Can you beat me?`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      <Toaster position="top-center" />

      {/* Background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-gray-800/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-5xl group-hover:scale-110 transition-transform">🌍</div>
            <div className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              WorldLeader.io
            </div>
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all"
          >
            Join to Compete
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Profile Card */}
        <div className="relative bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl border border-gray-700/50 overflow-hidden p-8 md:p-12">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 text-[15rem] leading-none">🌍</div>
          </div>

          <div className="relative text-center">
            {/* Flag */}
            <div className="text-8xl mb-4">{getCountryFlag(user.countryCode)}</div>

            {/* Username */}
            <h1 className="text-5xl md:text-6xl font-black text-white mb-2">{user.username}</h1>

            {/* Continent */}
            <p className="text-xl text-gray-400 mb-8">
              {getContinentEmoji(user.continent)} {user.continent.replace('_', ' ')}
            </p>

            {/* Rank Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-2 border-blue-500/50 rounded-2xl p-5">
                <div className="text-blue-400 font-bold text-xs mb-1">CONTINENTAL</div>
                <div className="text-4xl font-black text-white">#{user.currentContinentRank}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 rounded-2xl p-5">
                <div className="text-purple-400 font-bold text-xs mb-1">GLOBAL</div>
                <div className="text-4xl font-black text-white">#{user.currentGlobalRank}</div>
              </div>
            </div>

            {/* Badges */}
            {getUserBadges(user).length > 0 && (
              <div className="flex justify-center gap-3 mb-6 flex-wrap">
                {getUserBadges(user).map(badge => (
                  <div
                    key={badge.id}
                    className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/50 rounded-xl px-4 py-2 flex items-center gap-2"
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <span className="text-sm font-bold text-white">{badge.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Battles */}
            {battleLog.length > 0 && (
              <div className="text-left mb-8 w-full max-w-md mx-auto">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">Recent Battles</h3>
                <div className="space-y-2">
                  {battleLog.map((entry) => (
                    <div
                      key={entry.id}
                      className={`rounded-lg px-4 py-3 border flex items-center gap-3 ${
                        entry.type === 'outgoing'
                          ? 'bg-green-900/20 border-green-800/50'
                          : 'bg-red-900/20 border-red-800/50'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        entry.type === 'outgoing' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          {entry.type === 'outgoing' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          )}
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-300">
                          {entry.type === 'outgoing'
                            ? <>Overtook <span className="font-bold text-green-400">@{entry.affectedUser.username}</span> on {entry.continent.replace('_', ' ')}</>
                            : <><span className="font-bold text-red-400">@{entry.climber.username}</span> overtook on {entry.continent.replace('_', ' ')}</>
                          }
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">{formatRelativeTime(entry.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member since */}
            <p className="text-gray-500 text-sm mb-8">Member since {joinedDate}</p>

            {/* Share buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={handleCopyLink}
                className="px-6 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-xl font-bold border border-gray-700/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Copy Link
              </button>
              <button
                onClick={handleShareX}
                className="px-6 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-xl font-bold border border-gray-700/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </button>
            </div>

            {/* CTA */}
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold text-lg group"
            >
              View Full Leaderboard
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800/50 bg-black/70 backdrop-blur-xl">
        <div className="container mx-auto text-center text-gray-400">
          <p className="text-sm">
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">WorldLeader.io</span> - Entertainment Only
          </p>
        </div>
      </footer>
    </div>
  )
}
