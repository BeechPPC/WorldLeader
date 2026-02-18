import { vi } from 'vitest'

// Set test environment variables
process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-characters-long'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

// Mock Prisma client
vi.mock('@/lib/db', () => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
      groupBy: vi.fn(),
    },
    transaction: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
      groupBy: vi.fn(),
    },
    notification: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
      updateMany: vi.fn(),
    },
    rankEvent: {
      findMany: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn((args: unknown) => {
      if (Array.isArray(args)) return Promise.resolve(args)
      if (typeof args === 'function') return (args as (tx: unknown) => unknown)(mockPrisma)
      return Promise.resolve()
    }),
  }
  return { prisma: mockPrisma }
})

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}))
