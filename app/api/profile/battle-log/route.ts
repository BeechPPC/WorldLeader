import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const skip = (page - 1) * limit

  const [events, total] = await Promise.all([
    prisma.rankEvent.findMany({
      where: {
        OR: [
          { climberId: user.userId },
          { affectedUserId: user.userId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        climber: { select: { username: true, countryCode: true } },
        affectedUser: { select: { username: true, countryCode: true } },
      },
    }),
    prisma.rankEvent.count({
      where: {
        OR: [
          { climberId: user.userId },
          { affectedUserId: user.userId },
        ],
      },
    }),
  ])

  const battleLog = events.map((event) => ({
    id: event.id,
    type: event.climberId === user.userId ? 'outgoing' as const : 'incoming' as const,
    climber: { username: event.climber.username, countryCode: event.climber.countryCode },
    affectedUser: { username: event.affectedUser.username, countryCode: event.affectedUser.countryCode },
    continent: event.continent,
    climbedToRank: event.climbedToRank,
    createdAt: event.createdAt.toISOString(),
  }))

  return NextResponse.json({
    battleLog,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
