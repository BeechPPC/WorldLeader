import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { recalculateRankings, getUsersOvertaken } from '@/lib/rankings'
import { sendOvertakenEmail } from '@/lib/notifications'
import { z } from 'zod'

const purchaseSchema = z.object({
  amountUsd: z.number().positive().max(10000),
})

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = purchaseSchema.parse(body)

    const positionsPurchased = Math.floor(validatedData.amountUsd) // $1 = 1 position

    // Get user's current data
    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const oldContinentRank = user.currentContinentRank

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: user.id,
        amountUsd: validatedData.amountUsd,
        positionsPurchased,
        paymentStatus: 'COMPLETED', // Mock payment - always successful
      },
    })

    // Update user's total positions purchased
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totalPositionsPurchased: {
          increment: positionsPurchased,
        },
      },
    })

    // Recalculate all rankings
    await recalculateRankings()

    // Get updated user data
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        continent: true,
        currentContinentRank: true,
        currentGlobalRank: true,
        totalPositionsPurchased: true,
      },
    })

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to get updated user data' },
        { status: 500 }
      )
    }

    const newContinentRank = updatedUser.currentContinentRank

    // Get users who were overtaken and send them notifications
    if (newContinentRank < oldContinentRank) {
      const overtakenUserIds = await getUsersOvertaken(
        user.id,
        oldContinentRank,
        newContinentRank,
        user.continent
      )

      // Send notification emails to overtaken users
      for (const userId of overtakenUserIds) {
        const overtakenUser = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            email: true,
            username: true,
            currentContinentRank: true,
          },
        })

        if (overtakenUser) {
          await sendOvertakenEmail(
            overtakenUser.email,
            overtakenUser.username,
            user.username,
            user.continent.replace('_', ' '),
            overtakenUser.currentContinentRank
          )
        }
      }
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      positionsMoved: oldContinentRank - newContinentRank,
      message: newContinentRank === 1
        ? "You're the Continental Leader!"
        : `You climbed ${oldContinentRank - newContinentRank} positions!`,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Purchase error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
