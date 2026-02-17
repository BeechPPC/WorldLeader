import { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { getRedis } from './redis'

// ── In-memory fallback (same as original) ─────────────────────────────

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 10 * 60 * 1000)

function inMemoryRateLimit(
  identifier: string,
  pathname: string,
  config: RateLimitConfig
): { success: boolean; remaining: number; resetTime: number } {
  const key = `${identifier}-${pathname}`
  const now = Date.now()

  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + config.windowMs,
    }
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: store[key].resetTime,
    }
  }

  store[key].count++

  if (store[key].count > config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: store[key].resetTime,
    }
  }

  return {
    success: true,
    remaining: config.maxRequests - store[key].count,
    resetTime: store[key].resetTime,
  }
}

// ── Upstash limiter cache ─────────────────────────────────────────────

const limiterCache = new Map<string, Ratelimit>()

function getUpstashLimiter(config: RateLimitConfig): Ratelimit | null {
  const redis = getRedis()
  if (!redis) return null

  const cacheKey = `${config.maxRequests}:${config.windowMs}`
  let limiter = limiterCache.get(cacheKey)

  if (!limiter) {
    const windowSeconds = Math.ceil(config.windowMs / 1000)
    const windowStr = `${windowSeconds} s` as `${number} s`

    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.maxRequests, windowStr),
      prefix: 'wl-rl',
    })
    limiterCache.set(cacheKey, limiter)
  }

  return limiter
}

// ── Public API (unchanged exports) ────────────────────────────────────

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = { maxRequests: 5, windowMs: 15 * 60 * 1000 }
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  const identifier =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'

  const pathname = request.nextUrl.pathname

  // Try Upstash first
  const limiter = getUpstashLimiter(config)
  if (limiter) {
    try {
      const key = `${identifier}-${pathname}`
      const result = await limiter.limit(key)
      return {
        success: result.success,
        remaining: result.remaining,
        resetTime: result.reset,
      }
    } catch (error) {
      console.warn('Upstash rate limit failed, falling back to in-memory:', error)
    }
  }

  // Fallback to in-memory
  return inMemoryRateLimit(identifier, pathname, config)
}

export function getRateLimitHeaders(
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(resetTime).toISOString(),
  }
}
