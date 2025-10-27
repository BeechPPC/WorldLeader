import { NextRequest, NextResponse } from 'next/server'
import { getLeaderboard } from '@/lib/rankings'
import { Continent } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const continentParam = searchParams.get('continent')
    const limitParam = searchParams.get('limit')

    const continent = continentParam ? (continentParam as Continent) : undefined
    const limit = limitParam ? parseInt(limitParam) : 100

    const leaderboard = await getLeaderboard(continent, limit)

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
