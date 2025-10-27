'use client'

import Link from 'next/link'

export default function TermsPage() {
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
          <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p className="text-sm text-gray-500 italic">
              Last Updated: {new Date().toLocaleDateString()}
            </p>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 my-8">
              <h2 className="text-2xl font-black text-yellow-400 mb-3">⚠️ IMPORTANT NOTICE</h2>
              <p className="text-yellow-200 font-bold text-lg">
                WorldLeader.io is a ENTERTAINMENT PLATFORM ONLY. This is a fun, gamified social ranking system with NO REAL-WORLD VALUE, NO PRIZES, and NO TANGIBLE BENEFITS. By using this service, you acknowledge that all purchases are for entertainment purposes only and are NON-REFUNDABLE.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">1. Acceptance of Terms</h2>
              <p>
                By accessing or using WorldLeader.io ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use the Service.
              </p>
              <p className="font-bold text-blue-400">
                You must be at least 18 years old to use this Service. By registering, you confirm you are of legal age.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">2. Nature of the Service</h2>
              <p className="font-bold text-lg text-purple-400">
                WorldLeader.io is STRICTLY FOR ENTERTAINMENT PURPOSES ONLY.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Rankings have NO real-world significance or value</li>
                <li>There are NO prizes, rewards, or tangible benefits</li>
                <li>Positions on leaderboards are purely virtual and for fun</li>
                <li>This is NOT gambling, NOT a competition with prizes, and NOT an investment</li>
                <li>You are purchasing digital entertainment experiences, not any form of ownership, equity, or rights</li>
                <li>Rankings can change at any time and are not guaranteed</li>
                <li>The Service may be modified or discontinued at any time without notice</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">3. Purchases and Payments</h2>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="font-black text-red-400 text-xl mb-2">ALL SALES ARE FINAL</p>
                <p className="text-red-200">
                  By making a purchase, you acknowledge and agree that:
                </p>
              </div>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="font-bold">ALL PURCHASES ARE NON-REFUNDABLE under any circumstances</li>
                <li>You are paying for entertainment value only, with no expectation of return</li>
                <li>Climbing positions on the leaderboard has no monetary or real-world value</li>
                <li>Purchases do not constitute an investment and will never generate returns</li>
                <li>We reserve the right to refuse service or cancel transactions at our discretion</li>
                <li>Prices may change at any time without notice</li>
                <li>You will not attempt chargebacks, disputes, or claims for refunds</li>
                <li>Payment processing is handled by third-party providers subject to their own terms</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">4. No Refund Policy</h2>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6">
                <p className="font-bold text-xl text-orange-400 mb-3">ABSOLUTELY NO REFUNDS</p>
                <p>
                  You expressly acknowledge and agree that you will NOT receive any refund for any reason, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>Change of mind</li>
                  <li>Not achieving desired rank</li>
                  <li>Being overtaken by other users</li>
                  <li>Service modifications or discontinuation</li>
                  <li>Account suspension or termination</li>
                  <li>Technical issues or bugs</li>
                  <li>Dissatisfaction with the Service</li>
                  <li>Any other reason whatsoever</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">5. User Conduct</h2>
              <p>You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use offensive, abusive, or inappropriate usernames</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Attempt to manipulate, hack, or exploit the Service</li>
                <li>Use automated systems or bots</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to reverse engineer or copy the Service</li>
                <li>Make false or misleading claims about the Service</li>
              </ul>
              <p className="font-bold text-red-400">
                We reserve the right to suspend or terminate accounts that violate these terms, with NO REFUNDS.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">6. Disclaimer of Warranties</h2>
              <p className="uppercase font-bold">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>We do not guarantee the accuracy of rankings or data</li>
                <li>We are not responsible for technical failures or data loss</li>
                <li>We make no warranties about the suitability of the Service for any purpose</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">7. Limitation of Liability</h2>
              <div className="bg-gray-800/50 border border-gray-600/50 rounded-xl p-6">
                <p className="uppercase font-bold mb-3">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>WorldLeader.io and its operators SHALL NOT BE LIABLE for any damages arising from use of the Service</li>
                  <li>This includes direct, indirect, incidental, consequential, or punitive damages</li>
                  <li>Our total liability shall not exceed the amount you paid in the last 30 days</li>
                  <li>We are not liable for any lost profits, data, or opportunities</li>
                  <li>We are not responsible for third-party actions or services</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">8. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless WorldLeader.io and its operators from any claims, damages, losses, or expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Any claims you make regarding refunds or damages</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">9. Arbitration and Dispute Resolution</h2>
              <p className="font-bold">
                Any disputes arising from these Terms or use of the Service shall be resolved through binding arbitration, NOT through court litigation.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You waive your right to a jury trial</li>
                <li>You waive your right to participate in class action lawsuits</li>
                <li>Arbitration will be conducted individually, not as a class</li>
                <li>The arbitrator's decision is final and binding</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">10. Modifications to Service and Terms</h2>
              <p>
                We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or discontinue the Service at any time without notice</li>
                <li>Change these Terms at any time (continued use constitutes acceptance)</li>
                <li>Change pricing, features, or functionality</li>
                <li>Suspend or terminate accounts without notice or refund</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">11. Account Termination</h2>
              <p>
                We may terminate or suspend your account at any time, for any reason, without notice or refund. Reasons may include but are not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violation of these Terms</li>
                <li>Fraudulent or suspicious activity</li>
                <li>Chargebacks or payment disputes</li>
                <li>Abusive behavior toward other users or staff</li>
                <li>Any reason we deem appropriate</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">12. Intellectual Property</h2>
              <p>
                All content, designs, logos, and materials on WorldLeader.io are our property or licensed to us. You may not copy, reproduce, or distribute any content without permission.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">13. Governing Law</h2>
              <p>
                These Terms are governed by the laws of [YOUR JURISDICTION], without regard to conflict of law provisions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">14. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full effect.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">15. Contact Information</h2>
              <p>
                For questions about these Terms, contact us at: <span className="text-blue-400 font-semibold">[YOUR CONTACT EMAIL]</span>
              </p>
            </section>

            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-8 my-8">
              <h2 className="text-3xl font-black text-red-400 mb-4">⚠️ FINAL ACKNOWLEDGMENT</h2>
              <p className="text-white font-bold text-lg mb-4">
                BY USING WORLDLEADER.IO, YOU EXPLICITLY ACKNOWLEDGE AND AGREE THAT:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-red-100">
                <li>This is entertainment only with no real-world value</li>
                <li>All purchases are completely non-refundable</li>
                <li>You have no right to refunds under any circumstances</li>
                <li>Rankings have no monetary value or real-world significance</li>
                <li>You will not pursue legal action, chargebacks, or refund claims</li>
                <li>You accept all risks associated with using the Service</li>
                <li>You have read and understood these Terms in their entirety</li>
              </ul>
            </div>

            <p className="text-center text-gray-400 italic mt-12">
              If you do not agree to these Terms, you must immediately stop using WorldLeader.io.
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
