import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Props {
  params: Promise<{ username: string }>
}

export async function GET(_request: Request, { params }: Props) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const events = await prisma.rankEvent.findMany({
    where: {
      OR: [
        { climberId: user.id },
        { affectedUserId: user.id },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      climber: { select: { username: true, countryCode: true } },
      affectedUser: { select: { username: true, countryCode: true } },
    },
  })

  const battleLog = events.map((event) => ({
    id: event.id,
    type: event.climberId === user.id ? 'outgoing' as const : 'incoming' as const,
    climber: { username: event.climber.username, countryCode: event.climber.countryCode },
    affectedUser: { username: event.affectedUser.username, countryCode: event.affectedUser.countryCode },
    continent: event.continent,
    climbedToRank: event.climbedToRank,
    createdAt: event.createdAt.toISOString(),
  }))

  return NextResponse.json({ battleLog })
}
