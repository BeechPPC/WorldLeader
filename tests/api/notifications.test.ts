import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@/lib/db'
import * as auth from '@/lib/auth'

vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('next/server', () => ({
  NextRequest: vi.fn(),
  NextResponse: {
    json: vi.fn((data: unknown, init?: { status?: number }) => ({
      data,
      status: init?.status || 200,
    })),
  },
}))

const mockPrisma = vi.mocked(prisma)
const mockAuth = vi.mocked(auth)

import { GET } from '@/app/api/notifications/route'
import { POST } from '@/app/api/notifications/read/route'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /api/notifications', () => {
  it('returns 401 when not authenticated', async () => {
    mockAuth.getCurrentUser.mockResolvedValue(null)

    const response = await GET()

    expect(response.status).toBe(401)
    expect(response.data).toEqual({ error: 'Unauthorized' })
  })

  it('returns notifications and unread count', async () => {
    mockAuth.getCurrentUser.mockResolvedValue({
      userId: 'u1',
      email: 'test@test.com',
      username: 'testuser',
    })

    const mockNotifications = [
      { id: 'n1', message: 'Test notification', readStatus: false, createdAt: new Date() },
    ]

    mockPrisma.notification.findMany.mockResolvedValue(mockNotifications as never)
    mockPrisma.notification.count.mockResolvedValue(1 as never)

    const response = await GET()

    expect(response.status).toBe(200)
    expect(response.data).toEqual({
      unreadCount: 1,
      notifications: mockNotifications,
    })
  })
})

describe('POST /api/notifications/read', () => {
  it('returns 401 when not authenticated', async () => {
    mockAuth.getCurrentUser.mockResolvedValue(null)

    const request = {
      json: () => Promise.resolve({}),
    } as never

    const response = await POST(request)

    expect(response.status).toBe(401)
  })

  it('marks single notification as read when id provided', async () => {
    mockAuth.getCurrentUser.mockResolvedValue({
      userId: 'u1',
      email: 'test@test.com',
      username: 'testuser',
    })

    mockPrisma.notification.updateMany.mockResolvedValue({ count: 1 } as never)

    const request = {
      json: () => Promise.resolve({ id: 'n1' }),
    } as never

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
      where: { id: 'n1', userId: 'u1' },
      data: { readStatus: true },
    })
  })

  it('marks all notifications as read when no id provided', async () => {
    mockAuth.getCurrentUser.mockResolvedValue({
      userId: 'u1',
      email: 'test@test.com',
      username: 'testuser',
    })

    mockPrisma.notification.updateMany.mockResolvedValue({ count: 5 } as never)

    const request = {
      json: () => Promise.resolve({}),
    } as never

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: 'u1', readStatus: false },
      data: { readStatus: true },
    })
  })
})
