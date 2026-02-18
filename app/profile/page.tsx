'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { getUserBadges, getAllBadgeDefinitions } from '@/lib/badges'
import NotificationBell from '@/components/NotificationBell'

interface BattleLogEntry {
  id: string
  type: 'outgoing' | 'incoming'
  climber: { username: string; countryCode: string }
  affectedUser: { username: string; countryCode: string }
  continent: string
  climbedToRank: number
  createdAt: string
}

interface ProfileData {
  profile: {
    id: string
    username: string
    email: string
    continent: string
    countryCode: string
    currentContinentRank: number
    currentGlobalRank: number
    totalPositionsPurchased: number
    joinedAt: string
  }
  stats: {
    totalSpent: number
    continentUsersCount: number
    globalUsersCount: number
    continentPercentile: number
    globalPercentile: number
  }
  transactions: Array<{
    id: string
    amountUsd: number
    positionsPurchased: number
    timestamp: string
    status: string
  }>
  notifications: Array<{
    id: string
    message: string
    readStatus: boolean
    createdAt: string
  }>
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

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
    fetchBattleLog()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')

      if (response.status === 401) {
        router.push('/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      setProfileData(data)
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchBattleLog = async () => {
    try {
      const response = await fetch('/api/profile/battle-log')
      if (response.ok) {
        const data = await response.json()
        setBattleLog(data.battleLog)
      }
    } catch {
      // Silent fail — battle log is non-critical
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen content-wrapper flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen content-wrapper flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Failed to load profile</p>
        </div>
      </div>
    )
  }

  const { profile, stats, transactions, notifications } = profileData
  const joinedDate = new Date(profile.joinedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen content-wrapper py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Profile</h1>
            <p className="text-gray-400 mt-1">Manage your account and track your progress</p>
          </div>
          <div className="flex gap-3 items-center">
            <NotificationBell />
            <Link
              href="/leaderboard"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              View Leaderboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* User Info Card */}
          <div className="lg:col-span-1 bg-gray-900/50 backdrop-blur rounded-lg border border-gray-800 p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-100 mb-1">{profile.username}</h2>
              <p className="text-gray-400 text-sm mb-4">{profile.email}</p>
              <div className="inline-flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
                <span className="text-2xl">{profile.countryCode === 'US' ? '🇺🇸' : '🌍'}</span>
                <span className="text-gray-300">{profile.continent.replace('_', ' ')}</span>
              </div>
              <p className="text-gray-500 text-sm mt-4">Member since {joinedDate}</p>
            </div>
          </div>

          {/* Ranking Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Continental Rank */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-gray-400 text-sm font-medium">Continental Rank</h3>
                <span className="text-2xl">🌎</span>
              </div>
              <p className="text-4xl font-bold text-white mb-2">#{profile.currentContinentRank}</p>
              <p className="text-sm text-gray-400">
                Top {stats.continentPercentile}% in {profile.continent.replace('_', ' ')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                out of {stats.continentUsersCount.toLocaleString()} players
              </p>
            </div>

            {/* Global Rank */}
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-gray-400 text-sm font-medium">Global Rank</h3>
                <span className="text-2xl">🌍</span>
              </div>
              <p className="text-4xl font-bold text-white mb-2">#{profile.currentGlobalRank}</p>
              <p className="text-sm text-gray-400">
                Top {stats.globalPercentile}% worldwide
              </p>
              <p className="text-xs text-gray-500 mt-1">
                out of {stats.globalUsersCount.toLocaleString()} players
              </p>
            </div>

            {/* Positions Purchased */}
            <div className="bg-gradient-to-br from-green-600/20 to-green-900/20 border border-green-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-gray-400 text-sm font-medium">Positions Purchased</h3>
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{profile.totalPositionsPurchased}</p>
              <p className="text-sm text-gray-400">Total positions climbed</p>
            </div>

            {/* Total Spent */}
            <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-900/20 border border-yellow-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-gray-400 text-sm font-medium">Total Spent</h3>
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-4xl font-bold text-white mb-2">${stats.totalSpent.toFixed(2)}</p>
              <p className="text-sm text-gray-400">Investment in rankings</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-900/50 backdrop-blur rounded-lg border border-gray-800 p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
            <span>🏆</span> Achievements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {(() => {
              const earned = getUserBadges({
                totalPositionsPurchased: profile.totalPositionsPurchased,
                currentGlobalRank: profile.currentGlobalRank,
              })
              const earnedIds = new Set(earned.map(b => b.id))
              const all = getAllBadgeDefinitions()
              return all.map((badge) => {
                const isEarned = earnedIds.has(badge.id)
                return (
                  <div
                    key={badge.id}
                    className={`rounded-xl p-4 border text-center transition-all ${
                      isEarned
                        ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/50'
                        : 'bg-gray-800/30 border-gray-700/50 opacity-40'
                    }`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <div className={`text-sm font-bold ${isEarned ? 'text-white' : 'text-gray-500'}`}>
                      {badge.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{badge.description}</div>
                    {!isEarned && (
                      <div className="text-xs text-gray-600 mt-1 font-semibold">Locked</div>
                    )}
                  </div>
                )
              })
            })()}
          </div>
        </div>

        {/* Transactions & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction History */}
          <div className="bg-gray-900/50 backdrop-blur rounded-lg border border-gray-800 p-6">
            <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
              <span>💳</span> Recent Transactions
            </h3>
            {transactions.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">📊</div>
                <p className="text-gray-400 font-semibold mb-4">No transactions yet</p>
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl transition-all hover:scale-105"
                >
                  Start Climbing
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      {/* Arrow indicator */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.status === 'COMPLETED'
                          ? 'bg-green-500/20 text-green-400'
                          : transaction.status === 'PENDING'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                      </div>

                      {/* Position count */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-lg">
                          +{transaction.positionsPurchased} positions
                        </p>
                        <p className="text-gray-500 text-sm">
                          {formatRelativeTime(transaction.timestamp)}
                        </p>
                      </div>

                      {/* Amount and status */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-white font-bold">${transaction.amountUsd.toFixed(2)}</p>
                        <div className="flex items-center gap-1.5 justify-end mt-1">
                          <span className={`w-2 h-2 rounded-full ${
                            transaction.status === 'COMPLETED' ? 'bg-green-500' :
                            transaction.status === 'PENDING' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                          <span className={`text-xs font-medium ${
                            transaction.status === 'COMPLETED' ? 'text-green-400' :
                            transaction.status === 'PENDING' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {transaction.status === 'COMPLETED' ? 'Completed' :
                             transaction.status === 'PENDING' ? 'Pending' : 'Failed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-gray-900/50 backdrop-blur rounded-lg border border-gray-800 p-6">
            <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
              <span>🔔</span> Notifications
            </h3>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No notifications</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-lg p-4 border ${
                      notification.readStatus
                        ? 'bg-gray-800/30 border-gray-700'
                        : 'bg-blue-900/20 border-blue-800'
                    }`}
                  >
                    <p className="text-gray-300 text-sm mb-1">{notification.message}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(notification.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Battle Log */}
        <div className="bg-gray-900/50 backdrop-blur rounded-lg border border-gray-800 p-6 mt-6">
          <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
            <span>&#x2694;&#xFE0F;</span> Battle Log
          </h3>
          {battleLog.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No battles yet. Start climbing to create history!</p>
          ) : (
            <div className="space-y-3">
              {battleLog.map((entry) => (
                <div
                  key={entry.id}
                  className={`rounded-lg p-4 border flex items-center gap-4 ${
                    entry.type === 'outgoing'
                      ? 'bg-green-900/20 border-green-800'
                      : 'bg-red-900/20 border-red-800'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    entry.type === 'outgoing'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      {entry.type === 'outgoing' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      )}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200">
                      {entry.type === 'outgoing'
                        ? <>You overtook <Link href={`/u/${entry.affectedUser.username}`} className="font-bold text-green-400 hover:underline">@{entry.affectedUser.username}</Link> on {entry.continent.replace('_', ' ')}</>
                        : <><Link href={`/u/${entry.climber.username}`} className="font-bold text-red-400 hover:underline">@{entry.climber.username}</Link> overtook you on {entry.continent.replace('_', ' ')}</>
                      }
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(entry.createdAt)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      entry.type === 'outgoing' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      #{entry.climbedToRank}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Link
            href="/reset-password"
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors text-center"
          >
            Change Password
          </Link>
          <button
            onClick={() => {
              const url = `${window.location.origin}/u/${profile.username}`
              navigator.clipboard.writeText(url)
              toast.success('Profile link copied!')
            }}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors text-center"
          >
            Share Profile 🔗
          </button>
          <Link
            href="/leaderboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors text-center"
          >
            Purchase Positions
          </Link>
          <button
            onClick={() => router.push('/leaderboard')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all text-center"
          >
            Climb Higher! 🚀
          </button>
        </div>
      </div>
    </div>
  )
}
