import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { fulfillPurchase } from '@/lib/purchase'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const transactionId = session.metadata?.transactionId

        if (!transactionId) {
          console.error('Webhook: No transactionId in session metadata')
          break
        }

        await fulfillPurchase(transactionId)
        console.log('Webhook: Fulfilled purchase for transaction', transactionId)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object
        const transactionId = session.metadata?.transactionId

        if (transactionId) {
          await prisma.transaction.update({
            where: { id: transactionId },
            data: { paymentStatus: 'FAILED' },
          })
          console.log('Webhook: Marked expired transaction as FAILED', transactionId)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
