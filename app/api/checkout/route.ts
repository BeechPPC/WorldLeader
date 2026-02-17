import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getStripe } from '@/lib/stripe'
import { z } from 'zod'

const checkoutSchema = z.object({
  amountUsd: z.number().int().positive().max(10000),
})

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = checkoutSchema.parse(body)

    const positionsPurchased = validatedData.amountUsd // $1 = 1 position, already integer

    // Create PENDING transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: currentUser.userId,
        amountUsd: validatedData.amountUsd,
        positionsPurchased,
        paymentStatus: 'PENDING',
      },
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Create Stripe Checkout session
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${positionsPurchased} Leaderboard Position${positionsPurchased > 1 ? 's' : ''}`,
              description: `Climb ${positionsPurchased} position${positionsPurchased > 1 ? 's' : ''} on WorldLeader.io`,
            },
            unit_amount: 100, // $1.00 in cents
          },
          quantity: positionsPurchased,
        },
      ],
      metadata: {
        transactionId: transaction.id,
        userId: currentUser.userId,
      },
      success_url: `${appUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/purchase/cancel?session_id={CHECKOUT_SESSION_ID}`,
    })

    // Link Stripe session to transaction
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { stripeSessionId: session.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Checkout error:', error)
    Sentry.captureException(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
