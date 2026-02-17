import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const sessionId = request.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const transaction = await prisma.transaction.findUnique({
      where: { stripeSessionId: sessionId },
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Verify the transaction belongs to the current user
    if (transaction.userId !== currentUser.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({
      status: transaction.paymentStatus,
      positionsPurchased: transaction.positionsPurchased,
    })
  } catch (error) {
    console.error('Checkout status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
