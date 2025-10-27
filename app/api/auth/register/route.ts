import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth'
import { getNewUserStartingRank, recalculateRankings } from '@/lib/rankings'
import { sendWelcomeEmail } from '@/lib/notifications'
import { z } from 'zod'
import { Continent } from '@prisma/client'

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(6),
  continent: z.nativeEnum(Continent),
  countryCode: z.string().length(2),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

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

    // Send welcome email
    await sendWelcomeEmail(user.email, user.username, user.continent)

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

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
