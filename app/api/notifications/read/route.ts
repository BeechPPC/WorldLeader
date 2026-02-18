import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const { id } = body as { id?: string }

  if (id) {
    await prisma.notification.updateMany({
      where: { id, userId: user.userId },
      data: { readStatus: true },
    })
  } else {
    await prisma.notification.updateMany({
      where: { userId: user.userId, readStatus: false },
      data: { readStatus: true },
    })
  }

  return NextResponse.json({ success: true })
}
