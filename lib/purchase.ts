import * as Sentry from '@sentry/nextjs'
import { prisma } from './db'
import { recalculateRankings, getUsersOvertaken } from './rankings'
import { sendOvertakenEmail } from './email'

/**
 * Fulfills a purchase transaction: marks it COMPLETED, increments user positions,
 * recalculates rankings, and sends overtaken notifications.
 * Idempotent — returns early if the transaction is already COMPLETED.
 */
export async function fulfillPurchase(transactionId: string) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  })

  if (!transaction) {
    throw new Error(`Transaction ${transactionId} not found`)
  }

  // Idempotency: if already completed, skip
  if (transaction.paymentStatus === 'COMPLETED') {
    return
  }

  const user = await prisma.user.findUnique({
    where: { id: transaction.userId },
  })

  if (!user) {
    throw new Error(`User ${transaction.userId} not found`)
  }

  const oldContinentRank = user.currentContinentRank

  // Mark transaction as completed
  await prisma.transaction.update({
    where: { id: transactionId },
    data: { paymentStatus: 'COMPLETED' },
  })

  // Increment user's total positions
  await prisma.user.update({
    where: { id: user.id },
    data: {
      totalPositionsPurchased: {
        increment: transaction.positionsPurchased,
      },
    },
  })

  // Recalculate all rankings
  await recalculateRankings()

  // Get updated user data for notification context
  const updatedUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      username: true,
      continent: true,
      currentContinentRank: true,
    },
  })

  if (!updatedUser) return

  const newContinentRank = updatedUser.currentContinentRank

  // Send overtaken notifications
  if (newContinentRank < oldContinentRank) {
    const overtakenUserIds = await getUsersOvertaken(
      user.id,
      oldContinentRank,
      newContinentRank,
      user.continent
    )

    for (const userId of overtakenUserIds) {
      try {
        const overtakenUser = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            username: true,
            currentContinentRank: true,
          },
        })

        if (overtakenUser) {
          const positionsLost = overtakenUser.currentContinentRank - oldContinentRank + 1

          await sendOvertakenEmail(
            overtakenUser.email,
            overtakenUser.username,
            user.username,
            user.continent.replace('_', ' '),
            overtakenUser.currentContinentRank,
            positionsLost
          )

          await prisma.notification.create({
            data: {
              userId: overtakenUser.id,
              message: `${user.username} just overtook you on the ${user.continent.replace('_', ' ')} leaderboard! You're now ranked #${overtakenUser.currentContinentRank}.`,
            },
          })
        }
      } catch (notificationError) {
        console.error('Notification error for user', userId, notificationError)
        Sentry.captureException(notificationError)
      }
    }
  }
}
