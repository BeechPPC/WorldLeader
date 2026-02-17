import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const sessionId = body.sessionId

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    const transaction = await prisma.transaction.findUnique({
      where: { stripeSessionId: sessionId },
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Verify ownership
    if (transaction.userId !== currentUser.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Only mark PENDING transactions as FAILED
    if (transaction.paymentStatus !== 'PENDING') {
      return NextResponse.json({
        status: transaction.paymentStatus,
        message: 'Transaction is no longer pending',
      })
    }

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { paymentStatus: 'FAILED' },
    })

    return NextResponse.json({ success: true, status: 'FAILED' })
  } catch (error) {
    console.error('Cancel checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
