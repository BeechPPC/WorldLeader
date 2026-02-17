import { Redis } from '@upstash/redis'

const globalForRedis = globalThis as unknown as {
  redis: Redis | null | undefined
}

function createRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return null
  }

  return new Redis({ url, token })
}

export function getRedis(): Redis | null {
  if (globalForRedis.redis === undefined) {
    globalForRedis.redis = createRedisClient()
  }
  return globalForRedis.redis
}
