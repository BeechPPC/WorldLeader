import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limit'
import { resetPassword, verifyResetToken } from '@/lib/password-reset'
import { hashPassword } from '@/lib/auth'
import { validatePasswordStrength } from '@/lib/password-validation'

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// Verify token endpoint (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      )
    }

    const verification = await verifyResetToken(token)

    return NextResponse.json({
      valid: verification.valid,
    })
  } catch (error) {
    console.error('Verify reset token error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Reset password endpoint (POST)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 password reset attempts per hour
    const rateLimitResult = await rateLimit(request, {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000,
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many password reset attempts. Please try again later.',
          retryAfter: new Date(rateLimitResult.resetTime).toISOString(),
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime),
        }
      )
    }

    const body = await request.json()
    const validatedData = resetPasswordSchema.parse(body)

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

    // Hash the new password
    const hashedPassword = await hashPassword(validatedData.password)

    // Reset the password
    const success = await resetPassword(validatedData.token, hashedPassword)

    if (!success) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
