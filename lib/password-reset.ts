import { randomBytes } from 'crypto'
import { prisma } from './db'

/**
 * Generate a secure random token for password reset
 */
export function generateResetToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Create a password reset token for a user
 * Token expires in 1 hour
 */
export async function createPasswordResetToken(email: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    // Return null but don't reveal that user doesn't exist
    return null
  }

  const resetToken = generateResetToken()
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

  await prisma.user.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  })

  return resetToken
}

/**
 * Verify a password reset token is valid
 */
export async function verifyResetToken(token: string): Promise<{ valid: boolean; userId?: string }> {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(), // Token must not be expired
      },
    },
  })

  if (!user) {
    return { valid: false }
  }

  return { valid: true, userId: user.id }
}

/**
 * Reset a user's password using a valid token
 */
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  const verification = await verifyResetToken(token)

  if (!verification.valid || !verification.userId) {
    return false
  }

  // Update password and clear reset token
  await prisma.user.update({
    where: { id: verification.userId },
    data: {
      password: newPassword, // Will be hashed by the caller
      resetToken: null,
      resetTokenExpiry: null,
    },
  })

  return true
}

/**
 * Clear expired reset tokens (can be run periodically)
 */
export async function clearExpiredResetTokens(): Promise<number> {
  const result = await prisma.user.updateMany({
    where: {
      resetTokenExpiry: {
        lt: new Date(),
      },
    },
    data: {
      resetToken: null,
      resetTokenExpiry: null,
    },
  })

  return result.count
}
