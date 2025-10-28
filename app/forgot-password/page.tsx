'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
        toast.success('Check your email for reset instructions!')
      } else {
        toast.error(data.error || 'Failed to send reset email')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 p-4">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-4">✉️</div>
            <h1 className="text-3xl font-bold text-white mb-4">Check Your Email</h1>
            <p className="text-gray-200 mb-6">
              If an account exists with <strong>{email}</strong>, you will receive a password reset link.
            </p>
            <p className="text-sm text-gray-300 mb-6">
              The link will expire in 1 hour. Please check your spam folder if you don't see the email.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 p-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-2">Forgot Password?</h1>
        <p className="text-center text-gray-200 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
            ← Back to Login
          </Link>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-300 hover:text-blue-200 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
