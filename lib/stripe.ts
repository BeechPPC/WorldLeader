import Stripe from 'stripe'

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(key, {
    apiVersion: '2026-01-28.clover',
  })
}

const globalForStripe = globalThis as unknown as {
  stripe: Stripe | undefined
}

export function getStripe(): Stripe {
  if (!globalForStripe.stripe) {
    globalForStripe.stripe = getStripeClient()
  }
  return globalForStripe.stripe
}
