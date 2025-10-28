import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  // Only allow in development or with secret key
  const secret = request.nextUrl.searchParams.get('secret')
  const isDev = process.env.NODE_ENV === 'development'

  if (!isDev && secret !== process.env.JWT_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const testEmail = request.nextUrl.searchParams.get('email') || 'test@example.com'

  try {
    // Check if Resend is configured
    const isConfigured = !!process.env.RESEND_API_KEY

    console.log('Email Test Configuration:', {
      resendConfigured: isConfigured,
      resendKeyExists: !!process.env.RESEND_API_KEY,
      resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 5) + '...',
      emailFrom: process.env.EMAIL_FROM,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
    })

    // Try to send test email
    const result = await sendWelcomeEmail(
      testEmail,
      'TestUser',
      'NORTH_AMERICA',
      999
    )

    return NextResponse.json({
      success: true,
      emailConfigured: isConfigured,
      emailResult: result,
      env: {
        resendKeySet: !!process.env.RESEND_API_KEY,
        emailFrom: process.env.EMAIL_FROM,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      }
    })
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        env: {
          resendKeySet: !!process.env.RESEND_API_KEY,
          emailFrom: process.env.EMAIL_FROM,
        }
      },
      { status: 500 }
    )
  }
}
