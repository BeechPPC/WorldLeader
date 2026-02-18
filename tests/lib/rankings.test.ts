import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@/lib/db'
import { recalculateRankings, getUsersOvertaken, getLeaderboard, getNewUserStartingRank } from '@/lib/rankings'

const mockPrisma = vi.mocked(prisma)

// Mock Prisma's Continent enum
vi.mock('@prisma/client', () => ({
  Continent: {
    AFRICA: 'AFRICA',
    ASIA: 'ASIA',
    EUROPE: 'EUROPE',
    NORTH_AMERICA: 'NORTH_AMERICA',
    SOUTH_AMERICA: 'SOUTH_AMERICA',
    OCEANIA: 'OCEANIA',
    ANTARCTICA: 'ANTARCTICA',
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('recalculateRankings', () => {
  it('assigns sequential ranks by positions desc, tie-break by createdAt', async () => {
    const users = [
      { id: 'u1', totalPositionsPurchased: 100, continent: 'EUROPE', createdAt: new Date('2024-01-01') },
      { id: 'u2', totalPositionsPurchased: 50, continent: 'EUROPE', createdAt: new Date('2024-01-02') },
      { id: 'u3', totalPositionsPurchased: 50, continent: 'ASIA', createdAt: new Date('2024-01-01') },
    ]

    mockPrisma.user.findMany.mockResolvedValue(users as never)
    mockPrisma.$transaction.mockResolvedValue([] as never)

    await recalculateRankings()

    expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
      orderBy: [
        { totalPositionsPurchased: 'desc' },
        { createdAt: 'asc' },
      ],
    })
    expect(mockPrisma.$transaction).toHaveBeenCalled()
  })
})

describe('getUsersOvertaken', () => {
  it('returns correct user IDs in rank range, excludes self', async () => {
    mockPrisma.user.findMany.mockResolvedValue([
      { id: 'u2' },
      { id: 'u3' },
    ] as never)

    const result = await getUsersOvertaken('u1', 5, 2, 'EUROPE' as never)

    expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
      where: {
        continent: 'EUROPE',
        id: { not: 'u1' },
        currentContinentRank: {
          gte: 2,
          lt: 5,
        },
      },
      select: { id: true },
    })
    expect(result).toEqual(['u2', 'u3'])
  })
})

describe('getLeaderboard', () => {
  it('filters by continent and applies limit', async () => {
    mockPrisma.user.findMany.mockResolvedValue([] as never)

    await getLeaderboard('EUROPE' as never, 50)

    expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
      where: { continent: 'EUROPE' },
      orderBy: { currentContinentRank: 'asc' },
      take: 50,
      select: {
        id: true,
        username: true,
        countryCode: true,
        currentContinentRank: true,
        currentGlobalRank: true,
        continent: true,
        totalPositionsPurchased: true,
      },
    })
  })

  it('returns global leaderboard when no continent specified', async () => {
    mockPrisma.user.findMany.mockResolvedValue([] as never)

    await getLeaderboard(undefined, 100)

    expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
        orderBy: { currentGlobalRank: 'asc' },
      })
    )
  })
})

describe('getNewUserStartingRank', () => {
  it('returns count + 1', async () => {
    mockPrisma.user.count.mockResolvedValue(42 as never)

    const rank = await getNewUserStartingRank('EUROPE' as never)

    expect(rank).toBe(43)
    expect(mockPrisma.user.count).toHaveBeenCalledWith({
      where: { continent: 'EUROPE' },
    })
  })
})
