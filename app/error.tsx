'use client'

import * as Sentry from '@sentry/nextjs'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl mb-6">💥</div>
        <h1 className="text-3xl font-black text-white mb-4">Something went wrong</h1>
        <p className="text-gray-400 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xl font-black rounded-2xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
          >
            Try Again
          </button>
          <Link
            href="/leaderboard"
            className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 text-lg font-bold rounded-2xl transition-all border border-gray-700/50"
          >
            Back to Leaderboard
          </Link>
        </div>
      </div>
    </div>
  )
}
