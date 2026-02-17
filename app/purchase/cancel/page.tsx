'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PurchaseCancelContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [cleanedUp, setCleanedUp] = useState(false)

  useEffect(() => {
    if (!sessionId || cleanedUp) return

    // Mark the PENDING transaction as FAILED
    fetch('/api/checkout/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then(() => setCleanedUp(true))
      .catch(() => setCleanedUp(true))
  }, [sessionId, cleanedUp])

  return (
    <div className="max-w-md w-full text-center">
      <div className="text-8xl mb-6">🚫</div>
      <h1 className="text-3xl font-black text-white mb-4">Payment Cancelled</h1>
      <p className="text-gray-400 mb-8">
        No charges were made. Your payment was cancelled before processing.
      </p>

      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 mb-8">
        <p className="text-gray-300 text-sm">
          Changed your mind? You can try again anytime from the leaderboard.
        </p>
      </div>

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
  )
}

export default function PurchaseCancelPage() {
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
        <PurchaseCancelContent />
      </Suspense>
    </div>
  )
}
