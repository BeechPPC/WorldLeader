import { getCurrentUser } from './auth'
import { prisma } from './db'

type AdminResult =
  | { authorized: true; userId: string }
  | { authorized: false; error: string; status: number }

export async function requireAdmin(): Promise<AdminResult> {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return { authorized: false, error: 'Not authenticated', status: 401 }
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.userId },
    select: { role: true },
  })

  if (!user || user.role !== 'ADMIN') {
    return { authorized: false, error: 'Forbidden', status: 403 }
  }

  return { authorized: true, userId: currentUser.userId }
}
