'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardData {
  totalUsers: number
  totalRevenue: number
  completedTransactions: number
  failedTransactions: number
  pendingTransactions: number
  revenueLastMonth: number
  recentTransactions: Transaction[]
  dailyRevenue: { date: string; revenue: number }[]
}

interface Transaction {
  id: string
  username: string
  email: string
  amountUsd: number
  positionsPurchased: number
  paymentStatus: string
  timestamp: string
}

interface UserResult {
  id: string
  username: string
  email: string
  continent: string
  countryCode: string
  continentRank: number
  globalRank: number
  totalPositions: number
  role: string
  transactionCount: number
  joinedAt: string
}

type StatusFilter = 'all' | 'COMPLETED' | 'PENDING' | 'FAILED'

export default function AdminPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [userSearch, setUserSearch] = useState('')
  const [userResults, setUserResults] = useState<UserResult[]>([])
  const [userSearching, setUserSearching] = useState(false)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/admin/dashboard')
      if (res.status === 403 || res.status === 401) {
        setError('Access Denied')
        return
      }
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setDashboard(data)
    } catch {
      setError('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const searchUsers = async () => {
    if (!userSearch.trim()) return
    setUserSearching(true)
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(userSearch)}`)
      if (res.ok) {
        const data = await res.json()
        setUserResults(data.users)
      }
    } catch {
      // Silent fail
    } finally {
      setUserSearching(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen content-wrapper flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen content-wrapper flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">&#x1F6AB;</div>
          <h1 className="text-2xl font-bold text-gray-100 mb-2">{error}</h1>
          <p className="text-gray-400 mb-6">You do not have permission to view this page.</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  if (!dashboard) return null

  const filteredTransactions = statusFilter === 'all'
    ? dashboard.recentTransactions
    : dashboard.recentTransactions.filter(t => t.paymentStatus === statusFilter)

  const maxDailyRevenue = Math.max(...dashboard.dailyRevenue.map(d => d.revenue), 1)

  return (
    <div className="min-h-screen content-wrapper py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Monitor platform activity and revenue</p>
          </div>
          <Link
            href="/profile"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Back to Profile
          </Link>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard label="Total Users" value={dashboard.totalUsers.toLocaleString()} color="blue" />
          <StatCard label="Total Revenue" value={`$${dashboard.totalRevenue.toFixed(2)}`} color="green" />
          <StatCard label="Completed" value={dashboard.completedTransactions.toLocaleString()} color="green" />
          <StatCard label="Failed" value={dashboard.failedTransactions.toLocaleString()} color="red" />
          <StatCard label="Pending" value={dashboard.pendingTransactions.toLocaleString()} color="yellow" />
          <StatCard label="Revenue (30d)" value={`$${dashboard.revenueLastMonth.toFixed(2)}`} color="purple" />
        </div>

        {/* Revenue Chart */}
        <div className="bg-gray-900/50 backdrop-blur rounded-lg border border-gray-800 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Daily Revenue (Last 30 Days)</h3>
          <div className="flex items-end gap-1 h-40">
            {dashboard.dailyRevenue.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  {day.date}: ${day.revenue.toFixed(2)}
                </div>
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t min-h-[2px]"
                  style={{ height: `${(day.revenue / maxDailyRevenue) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{dashboard.dailyRevenue[0]?.date}</span>
            <span>{dashboard.dailyRevenue[dashboard.dailyRevenue.length - 1]?.date}</span>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-900/50 backdrop-blur rounded-lg border border-gray-800 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Recent Transactions</h3>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 mb-4">
            {(['all', 'COMPLETED', 'PENDING', 'FAILED'] as StatusFilter[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab === 'all' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3 font-medium">Username</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Positions</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="text-gray-300">
                    <td className="py-3">
                      <Link href={`/u/${t.username}`} className="text-blue-400 hover:underline">
                        {t.username}
                      </Link>
                    </td>
                    <td className="py-3">${t.amountUsd.toFixed(2)}</td>
                    <td className="py-3">+{t.positionsPurchased}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        t.paymentStatus === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                        t.paymentStatus === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {t.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">
                      {new Date(t.timestamp).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Search */}
        <div className="bg-gray-900/50 backdrop-blur rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-gray-100 mb-4">User Search</h3>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
              placeholder="Search by username or email..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={searchUsers}
              disabled={userSearching}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {userSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {userResults.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="pb-3 font-medium">Username</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Continent</th>
                    <th className="pb-3 font-medium">Rank</th>
                    <th className="pb-3 font-medium">Positions</th>
                    <th className="pb-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {userResults.map((u) => (
                    <tr key={u.id} className="text-gray-300">
                      <td className="py-3">
                        <Link href={`/u/${u.username}`} className="text-blue-400 hover:underline">
                          {u.username}
                        </Link>
                        {u.role === 'ADMIN' && (
                          <span className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">Admin</span>
                        )}
                      </td>
                      <td className="py-3 text-gray-500">{u.email}</td>
                      <td className="py-3">{u.continent.replace('_', ' ')}</td>
                      <td className="py-3">#{u.globalRank}</td>
                      <td className="py-3">{u.totalPositions}</td>
                      <td className="py-3 text-gray-500">
                        {new Date(u.joinedAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-600/20 to-blue-900/20 border-blue-800',
    green: 'from-green-600/20 to-green-900/20 border-green-800',
    red: 'from-red-600/20 to-red-900/20 border-red-800',
    yellow: 'from-yellow-600/20 to-yellow-900/20 border-yellow-800',
    purple: 'from-purple-600/20 to-purple-900/20 border-purple-800',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color] || colorClasses.blue} border rounded-lg p-4`}>
      <p className="text-gray-400 text-xs font-medium mb-1">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  )
}
