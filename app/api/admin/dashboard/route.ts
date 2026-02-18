import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/db'

export async function GET() {
  const auth = await requireAdmin()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    revenueAgg,
    completedCount,
    failedCount,
    pendingCount,
    revenueLastMonthAgg,
    recentTransactions,
    dailyRevenueRaw,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.aggregate({
      where: { paymentStatus: 'COMPLETED' },
      _sum: { amountUsd: true },
    }),
    prisma.transaction.count({ where: { paymentStatus: 'COMPLETED' } }),
    prisma.transaction.count({ where: { paymentStatus: 'FAILED' } }),
    prisma.transaction.count({ where: { paymentStatus: 'PENDING' } }),
    prisma.transaction.aggregate({
      where: {
        paymentStatus: 'COMPLETED',
        timestamp: { gte: thirtyDaysAgo },
      },
      _sum: { amountUsd: true },
    }),
    prisma.transaction.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20,
      include: {
        user: { select: { username: true, email: true } },
      },
    }),
    prisma.transaction.groupBy({
      by: ['timestamp'],
      where: {
        paymentStatus: 'COMPLETED',
        timestamp: { gte: thirtyDaysAgo },
      },
      _sum: { amountUsd: true },
    }),
  ])

  // Aggregate daily revenue by date string
  const dailyMap = new Map<string, number>()
  for (const row of dailyRevenueRaw) {
    const dateKey = row.timestamp.toISOString().split('T')[0]
    dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + (row._sum.amountUsd || 0))
  }

  // Fill in all 30 days
  const dailyRevenue: { date: string; revenue: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const dateKey = d.toISOString().split('T')[0]
    dailyRevenue.push({ date: dateKey, revenue: dailyMap.get(dateKey) || 0 })
  }

  return NextResponse.json({
    totalUsers,
    totalRevenue: revenueAgg._sum.amountUsd || 0,
    completedTransactions: completedCount,
    failedTransactions: failedCount,
    pendingTransactions: pendingCount,
    revenueLastMonth: revenueLastMonthAgg._sum.amountUsd || 0,
    recentTransactions: recentTransactions.map((t) => ({
      id: t.id,
      username: t.user.username,
      email: t.user.email,
      amountUsd: t.amountUsd,
      positionsPurchased: t.positionsPurchased,
      paymentStatus: t.paymentStatus,
      timestamp: t.timestamp.toISOString(),
    })),
    dailyRevenue,
  })
}
