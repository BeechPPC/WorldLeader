import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { searchParams } = request.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const status = searchParams.get('status') || undefined
  const search = searchParams.get('search') || undefined
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}

  if (status && ['COMPLETED', 'PENDING', 'FAILED'].includes(status)) {
    where.paymentStatus = status
  }

  if (search) {
    where.user = {
      username: { contains: search, mode: 'insensitive' },
    }
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      skip,
      take: limit,
      include: {
        user: { select: { username: true, email: true } },
      },
    }),
    prisma.transaction.count({ where }),
  ])

  return NextResponse.json({
    transactions: transactions.map((t) => ({
      id: t.id,
      username: t.user.username,
      email: t.user.email,
      amountUsd: t.amountUsd,
      positionsPurchased: t.positionsPurchased,
      paymentStatus: t.paymentStatus,
      timestamp: t.timestamp.toISOString(),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
