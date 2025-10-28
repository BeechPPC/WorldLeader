import { NextRequest } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store (for production, use Redis or similar)
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

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = { maxRequests: 5, windowMs: 15 * 60 * 1000 } // 5 requests per 15 minutes
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  // Get client identifier (IP address or forwarded IP)
  const identifier =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'

  const key = `${identifier}-${request.nextUrl.pathname}`
  const now = Date.now()

  // Initialize or get existing entry
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

  // Increment count
  store[key].count++

  // Check if limit exceeded
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

export function getRateLimitHeaders(
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(resetTime).toISOString(),
  }
}
