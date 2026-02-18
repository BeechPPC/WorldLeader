import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [totalUsers, positionsAgg, continentGroups] = await Promise.all([
      prisma.user.count(),
      prisma.user.aggregate({ _sum: { totalPositionsPurchased: true } }),
      prisma.user.groupBy({ by: ['continent'] }),
    ])

    return NextResponse.json({
      totalUsers,
      totalPositionsClimbed: positionsAgg._sum.totalPositionsPurchased ?? 0,
      continentsActive: continentGroups.length,
    })
  } catch {
    return NextResponse.json(
      { totalUsers: 0, totalPositionsClimbed: 0, continentsActive: 0 },
      { status: 500 }
    )
  }
}
