import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      username: true,
      countryCode: true,
      continent: true,
      currentContinentRank: true,
      currentGlobalRank: true,
    },
  })

  if (!user) {
    return new Response('Not found', { status: 404 })
  }

  const continentLabel = user.continent.replace('_', ' ')

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          <span style={{ fontSize: '48px' }}>🌍</span>
          <span
            style={{
              fontSize: '36px',
              fontWeight: 900,
              background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            WorldLeader.io
          </span>
        </div>

        {/* Country code badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              background: 'rgba(59,130,246,0.2)',
              border: '2px solid rgba(59,130,246,0.5)',
              borderRadius: '16px',
              padding: '8px 24px',
              fontSize: '28px',
              fontWeight: 800,
              color: '#93c5fd',
              display: 'flex',
            }}
          >
            {user.countryCode}
          </div>
        </div>

        {/* Username */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 900,
            color: 'white',
            marginBottom: '12px',
            display: 'flex',
          }}
        >
          {user.username}
        </div>

        {/* Continent */}
        <div
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            marginBottom: '40px',
            display: 'flex',
          }}
        >
          {continentLabel}
        </div>

        {/* Rank cards */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(6,182,212,0.3))',
              border: '2px solid rgba(59,130,246,0.5)',
              borderRadius: '24px',
              padding: '24px 48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '20px', color: '#60a5fa', fontWeight: 700, display: 'flex' }}>
              CONTINENTAL
            </div>
            <div style={{ fontSize: '56px', fontWeight: 900, color: 'white', display: 'flex' }}>
              #{user.currentContinentRank}
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, rgba(147,51,234,0.3), rgba(236,72,153,0.3))',
              border: '2px solid rgba(147,51,234,0.5)',
              borderRadius: '24px',
              padding: '24px 48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '20px', color: '#a78bfa', fontWeight: 700, display: 'flex' }}>
              GLOBAL
            </div>
            <div style={{ fontSize: '56px', fontWeight: 900, color: 'white', display: 'flex' }}>
              #{user.currentGlobalRank}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
