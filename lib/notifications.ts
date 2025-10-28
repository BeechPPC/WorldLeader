import nodemailer from 'nodemailer'
import { prisma } from './db'

const transporter = nodemailer.createTransport({
  // For MVP, we'll use console logging instead of actual email
  // In production, configure with real SMTP settings
  streamTransport: true,
  newline: 'unix',
  buffer: true,
})

export async function sendOvertakenEmail(
  userEmail: string,
  username: string,
  overtakenByUsername: string,
  continent: string,
  newRank: number
) {
  const message = `${overtakenByUsername} just overtook you on the ${continent} leaderboard! You're now ranked #${newRank}. The world is watching - will you climb back?`

  // For MVP, just log to console
  console.log(`
    📧 EMAIL NOTIFICATION:
    To: ${userEmail}
    Subject: You've been overtaken on WorldLeader.io!
    Message: ${message}
  `)

  // Store notification in database
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  })

  if (user) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        message,
      },
    })
  }

  // Uncomment for production email sending:
  /*
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@worldleader.io',
    to: userEmail,
    subject: "You've been overtaken on WorldLeader.io!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">WorldLeader.io</h2>
        <p style="font-size: 16px; line-height: 1.6;">
          <strong>${overtakenByUsername}</strong> just overtook you on the <strong>${continent}</strong> leaderboard!
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          You're now ranked <strong>#${newRank}</strong>.
        </p>
        <p style="font-size: 14px; color: #666; font-style: italic;">
          The world is watching - will you climb back?
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/leaderboard"
           style="display: inline-block; margin-top: 20px; padding: 12px 24px;
                  background-color: #1e40af; color: white; text-decoration: none;
                  border-radius: 6px; font-weight: bold;">
          Climb Higher
        </a>
      </div>
    `,
  })
  */
}

export async function sendWelcomeEmail(
  userEmail: string,
  username: string,
  continent: string
) {
  console.log(`
    📧 WELCOME EMAIL:
    To: ${userEmail}
    Subject: Welcome to WorldLeader.io!
    Message: You're now competing in ${continent}. Climb to conquer the world!
  `)
}

export async function sendPasswordResetEmail(
  userEmail: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

  console.log(`
    📧 PASSWORD RESET EMAIL:
    To: ${userEmail}
    Subject: Reset Your WorldLeader.io Password
    Reset Link: ${resetUrl}

    This link expires in 1 hour.
  `)

  // For production email sending, uncomment below:
  /*
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@worldleader.io',
    to: userEmail,
    subject: 'Reset Your WorldLeader.io Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">WorldLeader.io - Password Reset</h2>
        <p style="font-size: 16px; line-height: 1.6;">
          You requested to reset your password. Click the button below to create a new password:
        </p>
        <a href="${resetUrl}"
           style="display: inline-block; margin: 20px 0; padding: 12px 24px;
                  background-color: #1e40af; color: white; text-decoration: none;
                  border-radius: 6px; font-weight: bold;">
          Reset Password
        </a>
        <p style="font-size: 14px; color: #666;">
          This link will expire in 1 hour.
        </p>
        <p style="font-size: 14px; color: #666;">
          If you didn't request this, please ignore this email. Your password will remain unchanged.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #999;">
          For security reasons, this link can only be used once.
        </p>
      </div>
    `,
  })
  */
}
