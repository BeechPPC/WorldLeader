'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CONTINENTS, COUNTRIES_BY_CONTINENT } from '@/lib/countries'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    continent: '',
    countryCode: '',
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const availableCountries = formData.continent
    ? COUNTRIES_BY_CONTINENT[formData.continent]
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!acceptedTerms) {
      setError('You must accept the Terms of Service and acknowledge the disclaimers to continue.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Registration successful, redirect to leaderboard
      router.push('/leaderboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen content-wrapper flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            WorldLeader.io
          </Link>
          <h1 className="text-2xl font-bold text-gray-100 mt-4">Join the Competition</h1>
          <p className="text-gray-400 mt-2">Start your climb to world domination</p>
        </div>

        {/* Registration Form */}
        <div className="bg-gray-900/50 backdrop-blur rounded-lg border border-gray-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                minLength={3}
                maxLength={20}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Choose your username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Minimum 6 characters"
              />
            </div>

            {/* Continent */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Continent
              </label>
              <select
                required
                value={formData.continent}
                onChange={(e) =>
                  setFormData({ ...formData, continent: e.target.value, countryCode: '' })
                }
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">Select your continent</option>
                {CONTINENTS.map((continent) => (
                  <option key={continent.value} value={continent.value}>
                    {continent.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            {formData.continent && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country
                </label>
                <select
                  required
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="">Select your country</option>
                  {availableCountries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Terms and Conditions Acceptance */}
            <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 bg-gray-800 border-gray-600 rounded focus:ring-2 focus:ring-red-500"
                  required
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-200 leading-relaxed">
                  <span className="font-black text-red-400 block mb-2 text-base">⚠️ REQUIRED: I understand and agree that:</span>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                    <li className="font-bold">WorldLeader.io is FOR ENTERTAINMENT ONLY with NO real-world value</li>
                    <li className="font-bold">ALL purchases are 100% NON-REFUNDABLE under any circumstances</li>
                    <li className="font-bold">Rankings have NO prizes, rewards, or tangible benefits</li>
                    <li className="font-bold">I am 18+ years of age</li>
                    <li className="font-bold">I will NOT pursue refunds, chargebacks, or legal action</li>
                  </ul>
                  <p className="mt-3 text-xs">
                    I have read and agree to the{' '}
                    <Link href="/terms" target="_blank" className="text-blue-400 hover:text-blue-300 underline font-semibold">
                      Terms of Service
                    </Link>
                    ,{' '}
                    <Link href="/privacy" target="_blank" className="text-blue-400 hover:text-blue-300 underline font-semibold">
                      Privacy Policy
                    </Link>
                    , and{' '}
                    <Link href="/disclaimer" target="_blank" className="text-blue-400 hover:text-blue-300 underline font-semibold">
                      Disclaimer
                    </Link>
                    .
                  </p>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !acceptedTerms}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
            >
              {loading ? 'Creating Account...' : 'Start Your Climb'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
