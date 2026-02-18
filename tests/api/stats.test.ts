import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@/lib/db'

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data: unknown, init?: { status?: number }) => ({
      data,
      status: init?.status || 200,
    })),
  },
}))

const mockPrisma = vi.mocked(prisma)

import { GET } from '@/app/api/stats/route'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /api/stats', () => {
  it('returns correct aggregated stats', async () => {
    mockPrisma.user.count.mockResolvedValue(150 as never)
    mockPrisma.user.aggregate.mockResolvedValue({
      _sum: { totalPositionsPurchased: 5000 },
    } as never)
    mockPrisma.user.groupBy.mockResolvedValue([
      { continent: 'EUROPE' },
      { continent: 'ASIA' },
      { continent: 'NORTH_AMERICA' },
    ] as never)

    const response = await GET()

    expect(response.data).toEqual({
      totalUsers: 150,
      totalPositionsClimbed: 5000,
      continentsActive: 3,
    })
  })

  it('returns zeros on error', async () => {
    mockPrisma.user.count.mockRejectedValue(new Error('DB down') as never)

    const response = await GET()

    expect(response.data).toEqual({
      totalUsers: 0,
      totalPositionsClimbed: 0,
      continentsActive: 0,
    })
    expect(response.status).toBe(500)
  })
})
