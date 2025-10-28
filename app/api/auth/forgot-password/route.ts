import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limit'
import { createPasswordResetToken } from '@/lib/password-reset'
import { sendPasswordResetEmail } from '@/lib/notifications'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 password reset requests per hour
    const rateLimitResult = await rateLimit(request, {
      maxRequests: 3,
      windowMs: 60 * 60 * 1000,
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many password reset requests. Please try again later.',
          retryAfter: new Date(rateLimitResult.resetTime).toISOString(),
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime),
        }
      )
    }

    const body = await request.json()
    const validatedData = forgotPasswordSchema.parse(body)

    // Create reset token (returns null if user doesn't exist)
    const resetToken = await createPasswordResetToken(validatedData.email)

    if (resetToken) {
      // Send password reset email
      await sendPasswordResetEmail(validatedData.email, resetToken)
    }

    // Always return success to prevent user enumeration
    // Don't reveal whether the email exists or not
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
