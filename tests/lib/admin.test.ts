import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@/lib/db'
import * as auth from '@/lib/auth'

vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
}))

const mockPrisma = vi.mocked(prisma)
const mockAuth = vi.mocked(auth)

// Import after mocks
import { requireAdmin } from '@/lib/admin'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('requireAdmin', () => {
  it('returns 401 when not authenticated', async () => {
    mockAuth.getCurrentUser.mockResolvedValue(null)

    const result = await requireAdmin()

    expect(result).toEqual({
      authorized: false,
      error: 'Not authenticated',
      status: 401,
    })
  })

  it('returns 403 when user has role USER', async () => {
    mockAuth.getCurrentUser.mockResolvedValue({
      userId: 'u1',
      email: 'test@test.com',
      username: 'testuser',
    })
    mockPrisma.user.findUnique.mockResolvedValue({ role: 'USER' } as never)

    const result = await requireAdmin()

    expect(result).toEqual({
      authorized: false,
      error: 'Forbidden',
      status: 403,
    })
  })

  it('returns 403 when user not found in DB', async () => {
    mockAuth.getCurrentUser.mockResolvedValue({
      userId: 'u-missing',
      email: 'test@test.com',
      username: 'testuser',
    })
    mockPrisma.user.findUnique.mockResolvedValue(null as never)

    const result = await requireAdmin()

    expect(result).toEqual({
      authorized: false,
      error: 'Forbidden',
      status: 403,
    })
  })

  it('returns authorized when user has role ADMIN', async () => {
    mockAuth.getCurrentUser.mockResolvedValue({
      userId: 'u1',
      email: 'admin@test.com',
      username: 'admin',
    })
    mockPrisma.user.findUnique.mockResolvedValue({ role: 'ADMIN' } as never)

    const result = await requireAdmin()

    expect(result).toEqual({
      authorized: true,
      userId: 'u1',
    })
  })
})
