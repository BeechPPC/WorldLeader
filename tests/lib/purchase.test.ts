import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@/lib/db'
import * as rankings from '@/lib/rankings'
import * as email from '@/lib/email'

vi.mock('@/lib/rankings', () => ({
  recalculateRankings: vi.fn(),
  getUsersOvertaken: vi.fn(),
}))

vi.mock('@/lib/email', () => ({
  sendOvertakenEmail: vi.fn(),
}))

const mockPrisma = vi.mocked(prisma)
const mockRankings = vi.mocked(rankings)
const mockEmail = vi.mocked(email)

// Import after mocks are set up
import { fulfillPurchase } from '@/lib/purchase'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('fulfillPurchase', () => {
  it('returns early if transaction is already COMPLETED (idempotency)', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: 'tx-1',
      userId: 'u1',
      paymentStatus: 'COMPLETED',
      positionsPurchased: 10,
      amountUsd: 10,
    } as never)

    await fulfillPurchase('tx-1')

    expect(mockPrisma.transaction.update).not.toHaveBeenCalled()
    expect(mockRankings.recalculateRankings).not.toHaveBeenCalled()
  })

  it('throws if transaction not found', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue(null as never)

    await expect(fulfillPurchase('tx-missing')).rejects.toThrow('Transaction tx-missing not found')
  })

  it('throws if user not found', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: 'tx-1',
      userId: 'u-missing',
      paymentStatus: 'PENDING',
      positionsPurchased: 10,
    } as never)
    mockPrisma.user.findUnique.mockResolvedValue(null as never)

    await expect(fulfillPurchase('tx-1')).rejects.toThrow('User u-missing not found')
  })

  it('happy path: marks COMPLETED, increments positions, recalculates rankings', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: 'tx-1',
      userId: 'u1',
      paymentStatus: 'PENDING',
      positionsPurchased: 5,
    } as never)

    // First findUnique (initial user lookup)
    mockPrisma.user.findUnique
      .mockResolvedValueOnce({
        id: 'u1',
        username: 'alice',
        continent: 'EUROPE',
        currentContinentRank: 10,
      } as never)
      // Second findUnique (after recalculate - updatedUser)
      .mockResolvedValueOnce({
        id: 'u1',
        username: 'alice',
        continent: 'EUROPE',
        currentContinentRank: 10, // same rank = no overtaken
      } as never)
      // Third findUnique (buyer for catching-up)
      .mockResolvedValueOnce({
        id: 'u1',
        username: 'alice',
        continent: 'EUROPE',
        currentContinentRank: 10,
        totalPositionsPurchased: 15,
      } as never)

    mockPrisma.user.findMany.mockResolvedValue([] as never) // no nearby users
    mockPrisma.transaction.update.mockResolvedValue({} as never)
    mockPrisma.user.update.mockResolvedValue({} as never)
    mockRankings.recalculateRankings.mockResolvedValue(undefined)
    mockRankings.getUsersOvertaken.mockResolvedValue([])

    await fulfillPurchase('tx-1')

    expect(mockPrisma.transaction.update).toHaveBeenCalledWith({
      where: { id: 'tx-1' },
      data: { paymentStatus: 'COMPLETED' },
    })
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { totalPositionsPurchased: { increment: 5 } },
    })
    expect(mockRankings.recalculateRankings).toHaveBeenCalled()
  })

  it('creates notifications and RankEvents for overtaken users', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: 'tx-1',
      userId: 'u1',
      paymentStatus: 'PENDING',
      positionsPurchased: 20,
    } as never)

    mockPrisma.user.findUnique
      .mockResolvedValueOnce({
        id: 'u1',
        username: 'alice',
        continent: 'EUROPE',
        currentContinentRank: 5,
      } as never)
      .mockResolvedValueOnce({
        id: 'u1',
        username: 'alice',
        continent: 'EUROPE',
        currentContinentRank: 2, // moved up from 5 to 2
      } as never)
      // overtakenUser lookup
      .mockResolvedValueOnce({
        id: 'u2',
        email: 'bob@test.com',
        username: 'bob',
        currentContinentRank: 4,
      } as never)
      // buyer for catching-up
      .mockResolvedValueOnce({
        id: 'u1',
        username: 'alice',
        continent: 'EUROPE',
        currentContinentRank: 2,
        totalPositionsPurchased: 50,
      } as never)

    mockPrisma.transaction.update.mockResolvedValue({} as never)
    mockPrisma.user.update.mockResolvedValue({} as never)
    mockPrisma.notification.create.mockResolvedValue({} as never)
    mockPrisma.rankEvent.create.mockResolvedValue({} as never)
    mockPrisma.user.findMany.mockResolvedValue([] as never) // no nearby users
    mockRankings.recalculateRankings.mockResolvedValue(undefined)
    mockRankings.getUsersOvertaken.mockResolvedValue(['u2'])
    mockEmail.sendOvertakenEmail.mockResolvedValue(undefined as never)

    await fulfillPurchase('tx-1')

    expect(mockPrisma.notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'u2',
        }),
      })
    )
    expect(mockPrisma.rankEvent.create).toHaveBeenCalledWith({
      data: {
        climberId: 'u1',
        affectedUserId: 'u2',
        continent: 'EUROPE',
        climbedToRank: 2,
        eventType: 'OVERTAKEN',
      },
    })
  })

  it('catching-up: creates alerts when gap <= 5', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: 'tx-1',
      userId: 'u1',
      paymentStatus: 'PENDING',
      positionsPurchased: 5,
    } as never)

    mockPrisma.user.findUnique
      .mockResolvedValueOnce({
        id: 'u1',
        username: 'alice',
        continent: 'EUROPE',
        currentContinentRank: 5,
      } as never)
      .mockResolvedValueOnce({
        id: 'u1',
        username: 'alice',
        continent: 'EUROPE',
        currentContinentRank: 5, // no movement
      } as never)
      // buyer for catching-up
      .mockResolvedValueOnce({
        id: 'u1',
        username: 'alice',
        continent: 'EUROPE',
        currentContinentRank: 5,
        totalPositionsPurchased: 45,
      } as never)

    // nearby user with gap of 3
    mockPrisma.user.findMany.mockResolvedValue([
      { id: 'u3', username: 'charlie', totalPositionsPurchased: 48, currentContinentRank: 4 },
    ] as never)

    mockPrisma.notification.findFirst.mockResolvedValue(null as never) // no existing dedup
    mockPrisma.notification.create.mockResolvedValue({} as never)
    mockPrisma.transaction.update.mockResolvedValue({} as never)
    mockPrisma.user.update.mockResolvedValue({} as never)
    mockRankings.recalculateRankings.mockResolvedValue(undefined)

    await fulfillPurchase('tx-1')

    // Should create a catching-up notification for charlie
    expect(mockPrisma.notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'u3',
          message: expect.stringContaining('Watch out!'),
        }),
      })
    )
  })

  it('catching-up: deduplicates within 24h', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: 'tx-1',
      userId: 'u1',
      paymentStatus: 'PENDING',
      positionsPurchased: 5,
    } as never)

    mockPrisma.user.findUnique
      .mockResolvedValueOnce({
        id: 'u1',
        username: 'alice',
        continent: 'EUROPE',
        currentContinentRank: 5,
      } as never)
      .mockResolvedValueOnce({
        id: 'u1',
        username: 'alice',
        continent: 'EUROPE',
        currentContinentRank: 5,
      } as never)
      .mockResolvedValueOnce({
        id: 'u1',
        username: 'alice',
        continent: 'EUROPE',
        currentContinentRank: 5,
        totalPositionsPurchased: 45,
      } as never)

    mockPrisma.user.findMany.mockResolvedValue([
      { id: 'u3', username: 'charlie', totalPositionsPurchased: 48, currentContinentRank: 4 },
    ] as never)

    // Existing notification = dedup should skip
    mockPrisma.notification.findFirst.mockResolvedValue({ id: 'n-existing' } as never)
    mockPrisma.notification.create.mockResolvedValue({} as never)
    mockPrisma.transaction.update.mockResolvedValue({} as never)
    mockPrisma.user.update.mockResolvedValue({} as never)
    mockRankings.recalculateRankings.mockResolvedValue(undefined)

    await fulfillPurchase('tx-1')

    // notification.create should NOT be called for catching-up since dedup found existing
    expect(mockPrisma.notification.create).not.toHaveBeenCalled()
  })

  it('errors in notifications do not crash fulfillment', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: 'tx-1',
      userId: 'u1',
      paymentStatus: 'PENDING',
      positionsPurchased: 20,
    } as never)

    mockPrisma.user.findUnique
      .mockResolvedValueOnce({
        id: 'u1',
        username: 'alice',
        continent: 'EUROPE',
        currentContinentRank: 5,
      } as never)
      .mockResolvedValueOnce({
        id: 'u1',
        username: 'alice',
        continent: 'EUROPE',
        currentContinentRank: 2,
      } as never)
      // overtakenUser lookup throws
      .mockRejectedValueOnce(new Error('DB error'))
      // buyer for catching-up
      .mockResolvedValueOnce({
        id: 'u1',
        username: 'alice',
        continent: 'EUROPE',
        currentContinentRank: 2,
        totalPositionsPurchased: 50,
      } as never)

    mockPrisma.transaction.update.mockResolvedValue({} as never)
    mockPrisma.user.update.mockResolvedValue({} as never)
    mockPrisma.user.findMany.mockResolvedValue([] as never)
    mockRankings.recalculateRankings.mockResolvedValue(undefined)
    mockRankings.getUsersOvertaken.mockResolvedValue(['u2'])

    // Should not throw despite notification error
    await expect(fulfillPurchase('tx-1')).resolves.not.toThrow()
  })
})
