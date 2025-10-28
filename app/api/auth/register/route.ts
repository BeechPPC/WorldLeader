import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth'
import { getNewUserStartingRank, recalculateRankings } from '@/lib/rankings'
import { sendWelcomeEmail } from '@/lib/email'
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limit'
import { validatePasswordStrength } from '@/lib/password-validation'
import { z } from 'zod'
import { Continent } from '@prisma/client'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  continent: z.nativeEnum(Continent),
  countryCode: z.string().length(2),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 registration attempts per 15 minutes
    const rateLimitResult = await rateLimit(request, {
      maxRequests: 3,
      windowMs: 15 * 60 * 1000,
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many registration attempts. Please try again later.',
          retryAfter: new Date(rateLimitResult.resetTime).toISOString(),
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime),
        }
      )
    }

    // Verify database connection first
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set')
      return NextResponse.json(
        { error: 'Server configuration error: Database URL not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Validate password strength
    const passwordStrength = validatePasswordStrength(validatedData.password)
    if (!passwordStrength.isValid) {
      return NextResponse.json(
        {
          error: 'Password does not meet security requirements',
          feedback: passwordStrength.feedback,
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username },
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Get starting rank for the continent
    const startingContinentRank = await getNewUserStartingRank(validatedData.continent)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
        continent: validatedData.continent,
        countryCode: validatedData.countryCode,
        currentContinentRank: startingContinentRank,
        currentGlobalRank: 0, // Will be set by recalculateRankings
      },
    })

    // Recalculate all rankings
    await recalculateRankings()

    // Get updated rank after recalculation
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { currentContinentRank: true },
    })

    // Send welcome email with actual starting rank
    await sendWelcomeEmail(
      user.email,
      user.username,
      user.continent,
      updatedUser?.currentContinentRank || startingContinentRank
    )

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    })

    // Set auth cookie
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        continent: user.continent,
        countryCode: user.countryCode,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    // Enhanced error logging for debugging
    console.error('Registration error:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('PrismaClient')) {
      console.error('Database connection issue detected')
      return NextResponse.json(
        {
          error: 'Database connection failed',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}
