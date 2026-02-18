import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { paymentStatus: 'COMPLETED' },
      orderBy: { timestamp: 'desc' },
      take: 10,
      select: {
        id: true,
        positionsPurchased: true,
        timestamp: true,
        user: {
          select: {
            username: true,
            continent: true,
          },
        },
      },
    })

    const activity = transactions.map((t) => ({
      id: t.id,
      username: t.user.username,
      continent: t.user.continent,
      positionsPurchased: t.positionsPurchased,
      timestamp: t.timestamp,
    }))

    return NextResponse.json({ activity })
  } catch (error) {
    console.error('Activity feed error:', error)
    return NextResponse.json({ activity: [] })
  }
}
