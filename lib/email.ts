import { Resend } from 'resend'

// Initialize Resend only if API key is available (allows builds without key)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL = process.env.EMAIL_FROM || 'WorldLeader.io <onboarding@resend.dev>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Helper to check if email service is configured
function isEmailConfigured(): boolean {
  return resend !== null && !!process.env.RESEND_API_KEY
}

// Email template wrapper with consistent branding
function getEmailTemplate(content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WorldLeader.io</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; text-align: center; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);">
              <h1 style="margin: 0; font-size: 32px; font-weight: 900; color: #ffffff; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);">
                🌍 WorldLeader.io
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #e0e7ff; font-weight: 600; letter-spacing: 1px;">
                YOUR POSITION. THE WORLD'S WATCHING.
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px; color: #e2e8f0;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0f172a; border-top: 1px solid #1e293b;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b;">
                      WorldLeader.io - Climb Your Continent. Conquer the World.
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #475569;">
                      <a href="${APP_URL}/profile" style="color: #60a5fa; text-decoration: none; margin: 0 8px;">Profile</a>
                      <span style="color: #334155;">•</span>
                      <a href="${APP_URL}/leaderboard" style="color: #60a5fa; text-decoration: none; margin: 0 8px;">Leaderboard</a>
                      <span style="color: #334155;">•</span>
                      <a href="${APP_URL}/terms" style="color: #60a5fa; text-decoration: none; margin: 0 8px;">Terms</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// Welcome Email
export async function sendWelcomeEmail(
  userEmail: string,
  username: string,
  continent: string,
  initialRank: number
) {
  const continentDisplay = continent.replace('_', ' ')

  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 64px; margin-bottom: 16px;">🚀</div>
      <h2 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 800; color: #ffffff;">
        Welcome to WorldLeader.io!
      </h2>
      <p style="margin: 0; font-size: 18px; color: #94a3b8;">
        Your journey to world domination begins now, <strong style="color: #60a5fa;">${username}</strong>
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #581c87 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border: 2px solid #3730a3;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #a5b4fc; font-size: 14px;">Your Continent:</td>
          <td style="padding: 8px 0; color: #ffffff; font-weight: 700; text-align: right; font-size: 16px;">${continentDisplay}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #a5b4fc; font-size: 14px;">Starting Rank:</td>
          <td style="padding: 8px 0; color: #fbbf24; font-weight: 700; text-align: right; font-size: 16px;">#${initialRank}</td>
        </tr>
      </table>
    </div>

    <div style="margin: 30px 0;">
      <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #ffffff;">
        How It Works
      </h3>
      <ul style="margin: 0; padding: 0; list-style: none;">
        <li style="padding: 12px 0; border-bottom: 1px solid #1e293b;">
          <span style="font-size: 24px; margin-right: 12px;">💰</span>
          <span style="color: #cbd5e1; font-size: 15px;"><strong style="color: #ffffff;">Buy Positions:</strong> $1 = 1 position climb</span>
        </li>
        <li style="padding: 12px 0; border-bottom: 1px solid #1e293b;">
          <span style="font-size: 24px; margin-right: 12px;">🏆</span>
          <span style="color: #cbd5e1; font-size: 15px;"><strong style="color: #ffffff;">Climb Rankings:</strong> Dominate your continent</span>
        </li>
        <li style="padding: 12px 0; border-bottom: 1px solid #1e293b;">
          <span style="font-size: 24px; margin-right: 12px;">🌍</span>
          <span style="color: #cbd5e1; font-size: 15px;"><strong style="color: #ffffff;">Go Global:</strong> Compete worldwide</span>
        </li>
        <li style="padding: 12px 0;">
          <span style="font-size: 24px; margin-right: 12px;">👑</span>
          <span style="color: #cbd5e1; font-size: 15px;"><strong style="color: #ffffff;">Reach #1:</strong> Become the World Leader</span>
        </li>
      </ul>
    </div>

    <div style="text-align: center; margin-top: 40px;">
      <a href="${APP_URL}/leaderboard" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);">
        Start Climbing 🚀
      </a>
    </div>

    <p style="margin: 30px 0 0 0; font-size: 13px; color: #64748b; text-align: center; font-style: italic;">
      The world is watching, ${username}. Will you rise to the top?
    </p>
  `

  const html = getEmailTemplate(content)

  // If Resend is not configured, log instead of sending
  if (!isEmailConfigured()) {
    console.log('📧 [EMAIL NOT CONFIGURED] Welcome email would be sent to:', userEmail)
    console.log('   Subject: 🌍 Welcome to WorldLeader.io - Your Journey Begins!')
    console.log('   Username:', username, '| Continent:', continent, '| Rank:', initialRank)
    return { success: true, data: { id: 'mock-email-id' } }
  }

  try {
    const { data, error } = await resend!.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: '🌍 Welcome to WorldLeader.io - Your Journey Begins!',
      html,
    })

    if (error) {
      console.error('Failed to send welcome email:', error)
      return { success: false, error }
    }

    console.log('✅ Welcome email sent:', { to: userEmail, id: data?.id })
    return { success: true, data }
  } catch (error) {
    console.error('Welcome email error:', error)
    return { success: false, error }
  }
}

// Overtaken Notification Email
export async function sendOvertakenEmail(
  userEmail: string,
  username: string,
  overtakenByUsername: string,
  continent: string,
  newRank: number,
  positionsLost: number
) {
  const continentDisplay = continent.replace('_', ' ')

  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 64px; margin-bottom: 16px;">⚔️</div>
      <h2 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 800; color: #ef4444;">
        You've Been Overtaken!
      </h2>
      <p style="margin: 0; font-size: 18px; color: #94a3b8;">
        <strong style="color: #60a5fa;">${overtakenByUsername}</strong> just climbed past you
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border: 2px solid #991b1b;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #fca5a5; font-size: 14px;">Leaderboard:</td>
          <td style="padding: 8px 0; color: #ffffff; font-weight: 700; text-align: right; font-size: 16px;">${continentDisplay}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #fca5a5; font-size: 14px;">Your New Rank:</td>
          <td style="padding: 8px 0; color: #fbbf24; font-weight: 700; text-align: right; font-size: 20px;">#${newRank}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #fca5a5; font-size: 14px;">Positions Lost:</td>
          <td style="padding: 8px 0; color: #ef4444; font-weight: 700; text-align: right; font-size: 16px;">-${positionsLost}</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #1e293b; border-left: 4px solid #ef4444; padding: 20px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
        <strong style="color: #ffffff;">${username},</strong> you're now ranked <strong style="color: #fbbf24;">#${newRank}</strong> on the ${continentDisplay} leaderboard.
        <strong style="color: #60a5fa;">${overtakenByUsername}</strong> is making their move.
      </p>
      <p style="margin: 16px 0 0 0; font-size: 15px; color: #94a3b8; font-style: italic;">
        Will you let them stay ahead, or fight back for your position?
      </p>
    </div>

    <div style="text-align: center; margin-top: 40px;">
      <a href="${APP_URL}/leaderboard" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);">
        Climb Higher ⚡
      </a>
    </div>

    <p style="margin: 30px 0 0 0; font-size: 13px; color: #64748b; text-align: center; font-style: italic;">
      The world is watching. Your position is on the line.
    </p>
  `

  const html = getEmailTemplate(content)

  // If Resend is not configured, log instead of sending
  if (!isEmailConfigured()) {
    console.log('📧 [EMAIL NOT CONFIGURED] Overtaken email would be sent to:', userEmail)
    console.log(`   Subject: ⚔️ ${overtakenByUsername} just overtook you on WorldLeader.io!`)
    console.log('   New Rank:', newRank, '| Positions Lost:', positionsLost)
    return { success: true, data: { id: 'mock-email-id' } }
  }

  try {
    const { data, error } = await resend!.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: `⚔️ ${overtakenByUsername} just overtook you on WorldLeader.io!`,
      html,
    })

    if (error) {
      console.error('Failed to send overtaken email:', error)
      return { success: false, error }
    }

    console.log('✅ Overtaken email sent:', { to: userEmail, id: data?.id })
    return { success: true, data }
  } catch (error) {
    console.error('Overtaken email error:', error)
    return { success: false, error }
  }
}

// Password Reset Email
export async function sendPasswordResetEmail(
  userEmail: string,
  username: string,
  resetToken: string
) {
  const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`

  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 64px; margin-bottom: 16px;">🔐</div>
      <h2 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 800; color: #ffffff;">
        Password Reset Request
      </h2>
      <p style="margin: 0; font-size: 18px; color: #94a3b8;">
        Hi <strong style="color: #60a5fa;">${username}</strong>, we received a request to reset your password
      </p>
    </div>

    <div style="background-color: #1e293b; border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0 0 12px 0; font-size: 15px; color: #cbd5e1; line-height: 1.6;">
        Click the button below to create a new password for your WorldLeader.io account.
      </p>
      <p style="margin: 0; font-size: 14px; color: #94a3b8;">
        <strong style="color: #fbbf24;">⏱️ This link expires in 1 hour.</strong>
      </p>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);">
        Reset Password 🔑
      </a>
    </div>

    <div style="background-color: #0f172a; border: 1px solid #1e293b; padding: 20px; margin: 24px 0; border-radius: 8px;">
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b;">
        <strong style="color: #94a3b8;">Security Tips:</strong>
      </p>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #64748b; line-height: 1.8;">
        <li>This link can only be used once</li>
        <li>If you didn't request this, ignore this email</li>
        <li>Your password won't change unless you click the link above</li>
      </ul>
    </div>

    <p style="margin: 30px 0 0 0; font-size: 13px; color: #64748b; text-align: center;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${resetUrl}" style="color: #60a5fa; word-break: break-all; font-size: 11px;">${resetUrl}</a>
    </p>
  `

  const html = getEmailTemplate(content)

  // If Resend is not configured, log instead of sending
  if (!isEmailConfigured()) {
    console.log('📧 [EMAIL NOT CONFIGURED] Password reset email would be sent to:', userEmail)
    console.log('   Subject: 🔐 Reset Your WorldLeader.io Password')
    console.log('   Reset URL:', resetUrl)
    return { success: true, data: { id: 'mock-email-id' } }
  }

  try {
    const { data, error } = await resend!.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: '🔐 Reset Your WorldLeader.io Password',
      html,
    })

    if (error) {
      console.error('Failed to send password reset email:', error)
      return { success: false, error }
    }

    console.log('✅ Password reset email sent:', { to: userEmail, id: data?.id })
    return { success: true, data }
  } catch (error) {
    console.error('Password reset email error:', error)
    return { success: false, error }
  }
}

// Achievement/Milestone Email (for future use)
export async function sendMilestoneEmail(
  userEmail: string,
  username: string,
  milestone: 'TOP_10' | 'TOP_5' | 'TOP_3' | 'NUMBER_1',
  rank: number,
  continent: string
) {
  const continentDisplay = continent.replace('_', ' ')

  const milestones = {
    TOP_10: { emoji: '🏅', title: 'Top 10!', color: '#10b981' },
    TOP_5: { emoji: '🏆', title: 'Top 5!', color: '#f59e0b' },
    TOP_3: { emoji: '🥉', title: 'Top 3!', color: '#cd7f32' },
    NUMBER_1: { emoji: '👑', title: 'World Leader!', color: '#fbbf24' },
  }

  const { emoji, title, color } = milestones[milestone]

  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 80px; margin-bottom: 16px;">${emoji}</div>
      <h2 style="margin: 0 0 16px 0; font-size: 32px; font-weight: 900; color: ${color};">
        ${title}
      </h2>
      <p style="margin: 0; font-size: 18px; color: #94a3b8;">
        Congratulations, <strong style="color: #60a5fa;">${username}</strong>!
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #581c87 100%); border-radius: 12px; padding: 32px; margin: 24px 0; border: 2px solid ${color}; text-align: center;">
      <p style="margin: 0 0 12px 0; font-size: 18px; color: #e0e7ff;">You're now ranked</p>
      <p style="margin: 0; font-size: 64px; font-weight: 900; color: ${color}; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);">
        #${rank}
      </p>
      <p style="margin: 12px 0 0 0; font-size: 16px; color: #a5b4fc;">on the ${continentDisplay} leaderboard</p>
    </div>

    <p style="margin: 30px 0; font-size: 16px; color: #cbd5e1; text-align: center; line-height: 1.6;">
      You've proven your dominance. The world is watching your rise to power.
      ${milestone === 'NUMBER_1' ? '<br><br><strong style="color: #fbbf24; font-size: 18px;">You are the World Leader! 👑</strong>' : ''}
    </p>

    <div style="text-align: center; margin-top: 40px;">
      <a href="${APP_URL}/leaderboard" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);">
        View Leaderboard 🌍
      </a>
    </div>
  `

  const html = getEmailTemplate(content)

  // If Resend is not configured, log instead of sending
  if (!isEmailConfigured()) {
    console.log('📧 [EMAIL NOT CONFIGURED] Milestone email would be sent to:', userEmail)
    console.log(`   Subject: ${emoji} You reached ${title} on WorldLeader.io!`)
    console.log('   Milestone:', milestone, '| Rank:', rank)
    return { success: true, data: { id: 'mock-email-id' } }
  }

  try {
    const { data, error } = await resend!.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: `${emoji} You reached ${title} on WorldLeader.io!`,
      html,
    })

    if (error) {
      console.error('Failed to send milestone email:', error)
      return { success: false, error }
    }

    console.log('✅ Milestone email sent:', { to: userEmail, id: data?.id })
    return { success: true, data }
  } catch (error) {
    console.error('Milestone email error:', error)
    return { success: false, error }
  }
}
