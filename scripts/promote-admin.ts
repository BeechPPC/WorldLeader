import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]

  if (!email) {
    console.error('Usage: npm run db:promote-admin -- <email>')
    process.exit(1)
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, username: true, role: true },
  })

  if (!user) {
    console.error(`No user found with email: ${email}`)
    process.exit(1)
  }

  if (user.role === 'ADMIN') {
    console.log(`User ${user.username} is already an ADMIN.`)
    return
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: 'ADMIN' },
  })

  console.log(`Successfully promoted ${user.username} (${email}) to ADMIN.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
