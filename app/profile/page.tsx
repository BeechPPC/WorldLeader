'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

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

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
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
          <div className="flex gap-3">
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

        {/* Transactions & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction History */}
          <div className="bg-gray-900/50 backdrop-blur rounded-lg border border-gray-800 p-6">
            <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
              <span>💳</span> Recent Transactions
            </h3>
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-semibold">
                          +{transaction.positionsPurchased} positions
                        </p>
                        <p className="text-gray-400 text-sm">
                          {new Date(transaction.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">${transaction.amountUsd.toFixed(2)}</p>
                        <p className={`text-xs ${
                          transaction.status === 'COMPLETED' ? 'text-green-500' :
                          transaction.status === 'PENDING' ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {transaction.status}
                        </p>
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

        {/* Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/reset-password"
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors text-center"
          >
            Change Password
          </Link>
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
