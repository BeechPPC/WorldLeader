'use client'

import Link from 'next/link'

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen content-wrapper overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-black to-purple-950" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Header */}
      <header className="relative border-b border-gray-800/50 bg-black/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-4xl animate-pulse">🌍</div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              WorldLeader.io
            </div>
          </Link>
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            ⚠️ Important Disclaimer
          </h1>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p className="text-sm text-gray-500 italic">
              Last Updated: {new Date().toLocaleDateString()}
            </p>

            <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-8 my-8">
              <h2 className="text-3xl font-black text-red-400 mb-4 uppercase">⚠️ READ THIS CAREFULLY</h2>
              <p className="text-white font-bold text-xl mb-4">
                WorldLeader.io is a FUN, ENTERTAINMENT-ONLY platform with ABSOLUTELY NO real-world value, benefits, prizes, or returns.
              </p>
              <p className="text-red-200 font-semibold text-lg">
                By using this service, you acknowledge that you are spending money purely for entertainment, similar to going to a movie, playing video games, or other recreational activities. YOU WILL NOT GET YOUR MONEY BACK.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">Entertainment Platform Only</h2>
              <p className="font-bold text-lg text-yellow-400">
                WorldLeader.io is NOT:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-lg">
                <li className="font-bold">NOT a game with prizes or rewards</li>
                <li className="font-bold">NOT an investment or financial opportunity</li>
                <li className="font-bold">NOT a competition with tangible benefits</li>
                <li className="font-bold">NOT gambling or a game of chance</li>
                <li className="font-bold">NOT a cryptocurrency, NFT, or digital asset platform</li>
                <li className="font-bold">NOT a way to make money or earn returns</li>
                <li className="font-bold">NOT a professional ranking or credibility system</li>
                <li className="font-bold">NOT affiliated with any government, organization, or official entity</li>
              </ul>

              <p className="font-bold text-lg text-blue-400 mt-6">
                WorldLeader.io IS:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-lg">
                <li className="font-bold text-green-400">Pure entertainment and fun</li>
                <li className="font-bold text-green-400">A social experiment and leaderboard game</li>
                <li className="font-bold text-green-400">A platform for friendly competition</li>
                <li className="font-bold text-green-400">Digital entertainment with no real-world value</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">No Real-World Value</h2>
              <div className="bg-orange-500/20 border border-orange-500/50 rounded-xl p-6">
                <p className="font-black text-xl text-orange-400 mb-3">
                  YOUR RANK HAS ZERO REAL-WORLD VALUE
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Being #1 on the leaderboard means nothing outside of this platform</li>
                  <li>Rankings do not translate to any real-world status, authority, or credibility</li>
                  <li>You cannot use your rank for professional purposes, bragging rights, or any real-world benefits</li>
                  <li>Your position is purely virtual and exists only for entertainment</li>
                  <li>Ranks can change at any time and are not permanent</li>
                  <li>Other users can surpass you at any time</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">Absolutely No Refunds</h2>
              <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-6">
                <p className="font-black text-2xl text-red-400 mb-4 uppercase">
                  🚫 ALL SALES ARE FINAL - NO REFUNDS
                </p>
                <p className="text-red-200 font-bold text-lg mb-4">
                  When you make a purchase on WorldLeader.io, you are paying for ENTERTAINMENT ONLY. You will NOT receive a refund under ANY circumstances.
                </p>
                <p className="text-white font-semibold">
                  This includes but is not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3 text-red-100">
                  <li>Changing your mind after purchase</li>
                  <li>Not liking your new rank</li>
                  <li>Being overtaken by other users</li>
                  <li>Not reaching #1 position</li>
                  <li>The service being modified or discontinued</li>
                  <li>Your account being suspended or terminated</li>
                  <li>Technical issues or bugs</li>
                  <li>Buyer's remorse or regret</li>
                  <li>Financial hardship</li>
                  <li>Any other reason whatsoever</li>
                </ul>
                <p className="text-red-300 font-bold text-lg mt-4">
                  Think of it like buying a movie ticket - once you've watched the movie (or made the purchase), you don't get your money back.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">No Guarantees</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>We do not guarantee</strong> that the Service will always be available</li>
                <li><strong>We do not guarantee</strong> you will reach or maintain any specific rank</li>
                <li><strong>We do not guarantee</strong> the Service will continue operating indefinitely</li>
                <li><strong>We do not guarantee</strong> error-free or uninterrupted service</li>
                <li><strong>We do not guarantee</strong> that other users won't surpass you</li>
                <li><strong>We do not guarantee</strong> any specific features or functionality</li>
                <li><strong>We reserve the right</strong> to modify, suspend, or terminate the Service at any time</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">Not Financial Advice</h2>
              <div className="bg-purple-500/20 border border-purple-500/50 rounded-xl p-6">
                <p className="font-bold text-purple-400 text-xl mb-3">
                  Nothing on WorldLeader.io constitutes financial, investment, or professional advice.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Do not spend money you cannot afford to lose on entertainment</li>
                  <li>We are not financial advisors or investment professionals</li>
                  <li>Any money spent should be considered gone forever</li>
                  <li>There is no return on investment (ROI)</li>
                  <li>This is not a wealth-building opportunity</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">User Responsibility</h2>
              <p className="font-bold text-lg">
                You are solely responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Any money you spend on the platform</li>
                <li>Understanding this is entertainment only</li>
                <li>Reading and accepting the Terms of Service</li>
                <li>Making informed decisions about purchases</li>
                <li>Not spending more than you can afford to lose</li>
                <li>Understanding there are no refunds</li>
                <li>Any consequences of using the Service</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">Age Restriction</h2>
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                <p className="font-black text-red-400 text-xl">
                  🔞 YOU MUST BE 18+ TO USE THIS SERVICE
                </p>
                <p className="text-red-200 mt-2">
                  WorldLeader.io is only for adults aged 18 and over. By using the Service, you confirm you are of legal age.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">Data and Privacy</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your username and rankings are publicly visible</li>
                <li>We may collect and use data as described in our Privacy Policy</li>
                <li>We implement security measures but cannot guarantee 100% security</li>
                <li>You are responsible for keeping your account secure</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">Changes to Service</h2>
              <p>
                We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Change pricing at any time</li>
                <li>Modify features and functionality</li>
                <li>Change the rules or mechanics</li>
                <li>Suspend or terminate accounts without refund</li>
                <li>Discontinue the Service entirely</li>
                <li>Make any other changes we deem necessary</li>
              </ul>
              <p className="font-bold text-yellow-400 mt-3">
                None of these changes will entitle you to a refund.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">No Liability</h2>
              <p>
                WorldLeader.io and its operators are not liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Any money you spend on the platform</li>
                <li>Loss of rank or position</li>
                <li>Service interruptions or errors</li>
                <li>Data loss or security breaches</li>
                <li>Emotional distress or disappointment</li>
                <li>Any damages arising from use of the Service</li>
                <li>Third-party actions or services</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">Legal Action and Disputes</h2>
              <div className="bg-gray-800/50 border border-gray-600/50 rounded-xl p-6">
                <p className="font-bold text-lg mb-3">
                  By using WorldLeader.io, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Resolve disputes through binding arbitration, not court litigation</li>
                  <li>Waive your right to participate in class action lawsuits</li>
                  <li>Not pursue chargebacks or payment disputes</li>
                  <li>Not make false claims or fraudulent refund requests</li>
                  <li>Accept that all sales are final and non-refundable</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">Contact Information</h2>
              <p>
                For questions about this Disclaimer, contact us at:
              </p>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-4">
                <p className="font-semibold">Email: <span className="text-blue-400">[YOUR CONTACT EMAIL]</span></p>
              </div>
              <p className="text-sm text-gray-400 italic mt-4">
                Note: Contacting us does not entitle you to a refund or special treatment.
              </p>
            </section>

            <div className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border-2 border-red-500/50 rounded-xl p-8 my-8">
              <h2 className="text-3xl font-black text-red-400 mb-4 uppercase">🚨 Final Warning</h2>
              <p className="text-white font-bold text-xl mb-4">
                DO NOT USE WORLDLEADER.IO IF YOU:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-lg text-red-100">
                <li>Expect to get your money back</li>
                <li>Think rankings have real-world value</li>
                <li>Are looking for an investment opportunity</li>
                <li>Cannot afford to spend money on entertainment</li>
                <li>Do not understand this is for fun only</li>
                <li>Are under 18 years of age</li>
                <li>Have not read the Terms of Service</li>
              </ul>
              <p className="text-yellow-300 font-bold text-lg mt-6">
                By using WorldLeader.io, you confirm that you understand and accept all of these disclaimers and warnings.
              </p>
            </div>

            <p className="text-center text-gray-400 italic text-lg mt-12 font-semibold">
              This is entertainment. Have fun, but understand what you're paying for.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800/50 bg-black/50 mt-12">
        <div className="container mx-auto text-center text-gray-400">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
          <p className="text-sm">
            <span className="font-bold text-purple-400">WorldLeader.io</span> - Entertainment Only
          </p>
          <p className="text-xs mt-2">© {new Date().getFullYear()} - For Entertainment Purposes Only</p>
        </div>
      </footer>
    </div>
  )
}
