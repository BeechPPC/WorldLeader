import { describe, it, expect, vi } from 'vitest'

// Mock next/headers before importing auth
vi.mock('next/headers', () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    })
  ),
}))

import { hashPassword, verifyPassword, createToken, verifyToken } from '@/lib/auth'

describe('hashPassword', () => {
  it('returns a hash that is not the plaintext password', async () => {
    const password = 'TestPassword123!'
    const hash = await hashPassword(password)
    expect(hash).not.toBe(password)
    expect(hash.length).toBeGreaterThan(0)
  })
})

describe('verifyPassword', () => {
  it('returns true for matching password', async () => {
    const password = 'TestPassword123!'
    const hash = await hashPassword(password)
    const result = await verifyPassword(password, hash)
    expect(result).toBe(true)
  })

  it('returns false for mismatched password', async () => {
    const hash = await hashPassword('TestPassword123!')
    const result = await verifyPassword('WrongPassword', hash)
    expect(result).toBe(false)
  })
})

describe('createToken + verifyToken', () => {
  it('roundtrips a JWT payload', async () => {
    const payload = { userId: 'user-1', email: 'test@test.com', username: 'testuser' }
    const token = await createToken(payload)
    const decoded = await verifyToken(token)
    expect(decoded).toMatchObject(payload)
  })

  it('returns null for invalid token', async () => {
    const result = await verifyToken('invalid-token')
    expect(result).toBeNull()
  })

  it('returns null for tampered token', async () => {
    const payload = { userId: 'user-1', email: 'test@test.com', username: 'testuser' }
    const token = await createToken(payload)
    const tampered = token.slice(0, -5) + 'xxxxx'
    const result = await verifyToken(tampered)
    expect(result).toBeNull()
  })
})
