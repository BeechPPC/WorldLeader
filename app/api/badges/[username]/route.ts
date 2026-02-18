import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserBadges } from '@/lib/badges'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      totalPositionsPurchased: true,
      currentGlobalRank: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ badges: getUserBadges(user) })
}
