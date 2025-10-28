import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get current user from auth token
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch full user profile with transactions and notifications
    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
      include: {
        transactions: {
          orderBy: { timestamp: 'desc' },
          take: 10, // Get last 10 transactions
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Get last 5 notifications
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate statistics
    const totalSpent = await prisma.transaction.aggregate({
      where: { userId: user.id },
      _sum: { amountUsd: true },
    })

    // Get user's rank among all users in their continent
    const continentUsersCount = await prisma.user.count({
      where: { continent: user.continent },
    })

    // Get user's rank among all users globally
    const globalUsersCount = await prisma.user.count()

    // Calculate ranking percentile
    const continentPercentile = ((continentUsersCount - user.currentContinentRank + 1) / continentUsersCount) * 100
    const globalPercentile = ((globalUsersCount - user.currentGlobalRank + 1) / globalUsersCount) * 100

    return NextResponse.json({
      profile: {
        id: user.id,
        username: user.username,
        email: user.email,
        continent: user.continent,
        countryCode: user.countryCode,
        currentContinentRank: user.currentContinentRank,
        currentGlobalRank: user.currentGlobalRank,
        totalPositionsPurchased: user.totalPositionsPurchased,
        joinedAt: user.createdAt,
      },
      stats: {
        totalSpent: totalSpent._sum.amountUsd || 0,
        continentUsersCount,
        globalUsersCount,
        continentPercentile: Math.round(continentPercentile),
        globalPercentile: Math.round(globalPercentile),
      },
      transactions: user.transactions.map(t => ({
        id: t.id,
        amountUsd: t.amountUsd,
        positionsPurchased: t.positionsPurchased,
        timestamp: t.timestamp,
        status: t.paymentStatus,
      })),
      notifications: user.notifications.map(n => ({
        id: n.id,
        message: n.message,
        readStatus: n.readStatus,
        createdAt: n.createdAt,
      })),
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
