import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { searchParams } = request.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const search = searchParams.get('search') || undefined
  const sort = searchParams.get('sort') || 'rank'
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { username: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  const orderBy =
    sort === 'positions' ? { totalPositionsPurchased: 'desc' as const } :
    sort === 'joined' ? { createdAt: 'desc' as const } :
    { currentGlobalRank: 'asc' as const }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        username: true,
        email: true,
        continent: true,
        countryCode: true,
        currentContinentRank: true,
        currentGlobalRank: true,
        totalPositionsPurchased: true,
        role: true,
        createdAt: true,
        _count: { select: { transactions: true } },
      },
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      continent: u.continent,
      countryCode: u.countryCode,
      continentRank: u.currentContinentRank,
      globalRank: u.currentGlobalRank,
      totalPositions: u.totalPositionsPurchased,
      role: u.role,
      transactionCount: u._count.transactions,
      joinedAt: u.createdAt.toISOString(),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
