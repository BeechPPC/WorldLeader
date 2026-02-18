import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import PublicProfileClient from './PublicProfileClient'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      username: true,
      continent: true,
      currentContinentRank: true,
      currentGlobalRank: true,
    },
  })

  if (!user) {
    return { title: 'User Not Found - WorldLeader.io' }
  }

  const continentLabel = user.continent.replace('_', ' ')
  const title = `${user.username} - #${user.currentGlobalRank} Global | WorldLeader.io`
  const description = `${user.username} is ranked #${user.currentContinentRank} in ${continentLabel} and #${user.currentGlobalRank} globally on WorldLeader.io`
  const ogUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://worldleader.io'}/api/og/${user.username}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl],
    },
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      username: true,
      countryCode: true,
      continent: true,
      currentContinentRank: true,
      currentGlobalRank: true,
      totalPositionsPurchased: true,
      createdAt: true,
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <PublicProfileClient
      user={{
        username: user.username,
        countryCode: user.countryCode,
        continent: user.continent,
        currentContinentRank: user.currentContinentRank,
        currentGlobalRank: user.currentGlobalRank,
        totalPositionsPurchased: user.totalPositionsPurchased,
        createdAt: user.createdAt.toISOString(),
      }}
    />
  )
}
