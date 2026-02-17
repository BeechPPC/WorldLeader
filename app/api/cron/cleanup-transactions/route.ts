import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const cutoff = new Date(Date.now() - 25 * 60 * 60 * 1000) // 25 hours ago

    const result = await prisma.transaction.updateMany({
      where: {
        paymentStatus: 'PENDING',
        timestamp: { lt: cutoff },
      },
      data: { paymentStatus: 'FAILED' },
    })

    console.log(`Cron: Marked ${result.count} stale PENDING transactions as FAILED`)

    return NextResponse.json({
      success: true,
      cleaned: result.count,
    })
  } catch (error) {
    console.error('Cron cleanup error:', error)
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
  }
}
