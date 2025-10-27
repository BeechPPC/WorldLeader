import { prisma } from './db'
import { Continent } from '@prisma/client'

export async function recalculateRankings() {
  // Get all users ordered by positions purchased (desc)
  const allUsers = await prisma.user.findMany({
    orderBy: [
      { totalPositionsPurchased: 'desc' },
      { createdAt: 'asc' }, // Tie-breaker: earlier registration = higher rank
    ],
  })

  // Calculate global ranks
  const globalUpdates = allUsers.map((user, index) => ({
    where: { id: user.id },
    data: { currentGlobalRank: index + 1 },
  }))

  // Calculate continent ranks
  const continentUpdates: Array<{ where: { id: string }, data: { currentContinentRank: number } }> = []

  for (const continent of Object.values(Continent)) {
    const continentUsers = allUsers.filter(u => u.continent === continent)
    continentUsers.forEach((user, index) => {
      continentUpdates.push({
        where: { id: user.id },
        data: { currentContinentRank: index + 1 },
      })
    })
  }

  // Execute all updates in a transaction
  await prisma.$transaction([
    ...globalUpdates.map(update => prisma.user.update(update)),
    ...continentUpdates.map(update => prisma.user.update(update)),
  ])
}

export async function getUsersOvertaken(
  userId: string,
  oldRank: number,
  newRank: number,
  continent: Continent
): Promise<string[]> {
  // Get users who were overtaken (their ranks got pushed down)
  const overtakenUsers = await prisma.user.findMany({
    where: {
      continent,
      id: { not: userId },
      currentContinentRank: {
        gte: newRank,
        lt: oldRank,
      },
    },
    select: { id: true },
  })

  return overtakenUsers.map(u => u.id)
}

export async function getLeaderboard(
  continent?: Continent,
  limit: number = 100
) {
  const where = continent ? { continent } : {}
  const orderBy = continent
    ? { currentContinentRank: 'asc' as const }
    : { currentGlobalRank: 'asc' as const }

  return prisma.user.findMany({
    where,
    orderBy,
    take: limit,
    select: {
      id: true,
      username: true,
      countryCode: true,
      currentContinentRank: true,
      currentGlobalRank: true,
      continent: true,
    },
  })
}

export async function getNewUserStartingRank(continent: Continent): Promise<number> {
  const count = await prisma.user.count({
    where: { continent },
  })
  return count + 1
}
