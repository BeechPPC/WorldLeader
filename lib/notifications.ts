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
