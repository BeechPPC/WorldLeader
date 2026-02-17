'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import confetti from 'canvas-confetti'

type Status = 'loading' | 'PENDING' | 'COMPLETED' | 'FAILED'

function PurchaseSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<Status>('loading')
  const [positionsPurchased, setPositionsPurchased] = useState(0)
  const confettiFired = useRef(false)

  useEffect(() => {
    if (status === 'COMPLETED' && !confettiFired.current) {
      confettiFired.current = true
      const duration = 2000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#3b82f6', '#8b5cf6', '#ec4899'],
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#3b82f6', '#8b5cf6', '#ec4899'],
        })
        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }, [status])

  useEffect(() => {
    if (!sessionId) {
      router.push('/leaderboard')
      return
    }

    let cancelled = false

    const poll = async () => {
      try {
        const res = await fetch(`/api/checkout/status?session_id=${sessionId}`)
        if (!res.ok) {
          setStatus('FAILED')
          return
        }
        const data = await res.json()
        setPositionsPurchased(data.positionsPurchased)

        if (data.status === 'COMPLETED' || data.status === 'FAILED') {
          setStatus(data.status)
          return
        }

        setStatus('PENDING')
        if (!cancelled) {
          setTimeout(poll, 2000)
        }
      } catch {
        if (!cancelled) {
          setTimeout(poll, 2000)
        }
      }
    }

    poll()

    return () => {
      cancelled = true
    }
  }, [sessionId, router])

  return (
    <div className="max-w-md w-full text-center">
      {status === 'loading' || status === 'PENDING' ? (
        <div>
          <div className="text-8xl mb-6 animate-spin">🌍</div>
          <h1 className="text-3xl font-black text-white mb-4">Processing Payment...</h1>
          <p className="text-gray-400 mb-8">
            Hang tight while we confirm your payment and update the leaderboard.
          </p>
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      ) : status === 'COMPLETED' ? (
        <div>
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="text-4xl font-black text-white mb-4">Payment Successful!</h1>
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 mb-8">
            <p className="text-gray-300 text-lg">
              You climbed <span className="font-black text-3xl text-blue-400">{positionsPurchased}</span>
              <span className="font-bold text-purple-400 text-xl ml-2">position{positionsPurchased !== 1 ? 's' : ''}</span>
            </p>
          </div>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xl font-black rounded-2xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
          >
            View Leaderboard 🏆
          </Link>
        </div>
      ) : (
        <div>
          <div className="text-8xl mb-6">😔</div>
          <h1 className="text-3xl font-black text-white mb-4">Payment Failed</h1>
          <p className="text-gray-400 mb-8">
            Something went wrong with your payment. No charges were made.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xl font-black rounded-2xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
            >
              Try Again
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 text-lg font-bold rounded-2xl transition-all border border-gray-700/50"
            >
              Back to Leaderboard
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PurchaseSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="max-w-md w-full text-center">
            <div className="text-8xl mb-6 animate-spin">🌍</div>
            <h1 className="text-3xl font-black text-white mb-4">Loading...</h1>
          </div>
        }
      >
        <PurchaseSuccessContent />
      </Suspense>
    </div>
  )
}
