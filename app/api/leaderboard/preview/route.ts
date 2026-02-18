import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getCurrentUser()
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const positionsParam = request.nextUrl.searchParams.get('positions')
    const positions = positionsParam ? parseInt(positionsParam, 10) : 0

    if (!positions || positions < 1 || positions > 10000 || !Number.isInteger(positions)) {
      return NextResponse.json({ error: 'Invalid positions (1-10000)' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        totalPositionsPurchased: true,
        currentContinentRank: true,
        currentGlobalRank: true,
        continent: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const currentTotal = user.totalPositionsPurchased
    const newTotal = currentTotal + positions

    // Find up to 5 continental users who'd be overtaken
    const overtaken = await prisma.user.findMany({
      where: {
        id: { not: authUser.userId },
        continent: user.continent,
        totalPositionsPurchased: {
          gte: currentTotal,
          lt: newTotal,
        },
      },
      select: {
        username: true,
        currentContinentRank: true,
      },
      orderBy: { totalPositionsPurchased: 'desc' },
      take: 5,
    })

    // Predict new continental rank: count users in same continent with >= newTotal
    const continentAhead = await prisma.user.count({
      where: {
        id: { not: authUser.userId },
        continent: user.continent,
        totalPositionsPurchased: { gte: newTotal },
      },
    })
    const predictedContinentRank = continentAhead + 1

    // Predict new global rank: count all users with >= newTotal
    const globalAhead = await prisma.user.count({
      where: {
        id: { not: authUser.userId },
        totalPositionsPurchased: { gte: newTotal },
      },
    })
    const predictedGlobalRank = globalAhead + 1

    return NextResponse.json({
      currentContinentRank: user.currentContinentRank,
      currentGlobalRank: user.currentGlobalRank,
      predictedContinentRank,
      predictedGlobalRank,
      overtaken: overtaken.map((u) => ({
        username: u.username,
        currentRank: u.currentContinentRank,
      })),
    })
  } catch (error) {
    console.error('Preview error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
