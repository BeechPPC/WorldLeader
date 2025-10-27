'use client'

import Link from 'next/link'

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p className="text-sm text-gray-500 italic">
              Last Updated: {new Date().toLocaleDateString()}
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">1. Introduction</h2>
              <p>
                WorldLeader.io ("we", "us", "our") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our entertainment platform.
              </p>
              <p className="font-bold text-blue-400">
                By using WorldLeader.io, you consent to the practices described in this Privacy Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">2. Information We Collect</h2>

              <h3 className="text-xl font-bold text-purple-400 mt-4">2.1 Information You Provide</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Account Information:</strong> Email address, username, password (encrypted)</li>
                <li><strong>Profile Information:</strong> Country, continent selection</li>
                <li><strong>Payment Information:</strong> Processed by third-party payment providers (we do not store credit card details)</li>
                <li><strong>Communications:</strong> Messages you send to us</li>
              </ul>

              <h3 className="text-xl font-bold text-purple-400 mt-4">2.2 Automatically Collected Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Cookies:</strong> Session cookies for authentication and functionality</li>
                <li><strong>Log Data:</strong> Server logs for security and performance monitoring</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">3. How We Use Your Information</h2>
              <p>We use collected information for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Providing and maintaining the Service</li>
                <li>Processing transactions and managing your account</li>
                <li>Displaying your username and rank on leaderboards</li>
                <li>Sending service-related notifications</li>
                <li>Improving and optimizing the platform</li>
                <li>Preventing fraud and ensuring security</li>
                <li>Complying with legal obligations</li>
                <li>Communicating updates, changes, or promotions (you can opt-out)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">4. Public Information</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="font-bold text-yellow-400 mb-2">Your Leaderboard Information is PUBLIC:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-yellow-200">
                  <li>Your username is visible to all users</li>
                  <li>Your country flag is visible to all users</li>
                  <li>Your current rankings are visible to all users</li>
                  <li>Your continent affiliation is visible to all users</li>
                </ul>
              </div>
              <p className="font-bold text-red-400">
                DO NOT use your real name or personally identifiable information as your username if you wish to remain anonymous.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">5. Information Sharing and Disclosure</h2>

              <h3 className="text-xl font-bold text-purple-400 mt-4">We may share your information with:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Payment Processors:</strong> To process transactions (subject to their privacy policies)</li>
                <li><strong>Service Providers:</strong> Hosting, analytics, and technical support providers</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
              </ul>

              <h3 className="text-xl font-bold text-purple-400 mt-4">We do NOT:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Sell your personal information to third parties</li>
                <li>Share your email address publicly</li>
                <li>Share your payment information (processed securely by third parties)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">6. Data Security</h2>
              <p>
                We implement reasonable security measures to protect your information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of passwords and sensitive data</li>
                <li>Secure HTTPS connections</li>
                <li>Regular security audits and monitoring</li>
                <li>Access controls and authentication systems</li>
              </ul>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mt-4">
                <p className="font-bold text-orange-400">
                  However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your information.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">7. Data Retention</h2>
              <p>
                We retain your information for as long as:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your account is active</li>
                <li>Needed to provide you services</li>
                <li>Required for legal, tax, or accounting purposes</li>
                <li>Necessary to resolve disputes or enforce our agreements</li>
              </ul>
              <p>
                You may request account deletion, but we may retain certain information as required by law or for legitimate business purposes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">8. Your Rights and Choices</h2>
              <p>
                Depending on your location, you may have rights to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Data Portability:</strong> Request your data in a portable format</li>
                <li><strong>Object:</strong> Object to certain processing of your data</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at <span className="text-blue-400 font-semibold">[YOUR CONTACT EMAIL]</span>
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">9. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar technologies for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for authentication and core functionality</li>
                <li><strong>Analytics:</strong> Understanding how users interact with the platform</li>
                <li><strong>Preferences:</strong> Remembering your settings and choices</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings, but disabling cookies may limit functionality.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">10. Third-Party Services</h2>
              <p>
                Our Service may contain links to third-party websites or services (e.g., payment processors). We are not responsible for their privacy practices. Please review their privacy policies before providing them with information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">11. Children's Privacy</h2>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="font-bold text-red-400">
                  WorldLeader.io is NOT intended for children under 18 years of age.
                </p>
              </div>
              <p>
                We do not knowingly collect personal information from children under 18. If we discover we have collected information from a child under 18, we will delete it immediately. If you believe we have information about a child, please contact us.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">12. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. These countries may have different data protection laws. By using the Service, you consent to such transfers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">13. California Privacy Rights (CCPA)</h2>
              <p>
                If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Right to know what personal information is collected, used, and shared</li>
                <li>Right to delete personal information</li>
                <li>Right to opt-out of the sale of personal information (we do not sell your data)</li>
                <li>Right to non-discrimination for exercising your rights</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">14. European Privacy Rights (GDPR)</h2>
              <p>
                If you are in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR):
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">15. Changes to Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of the Service after changes constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mt-8">16. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our privacy practices, contact us at:
              </p>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-4">
                <p className="font-semibold">Email: <span className="text-blue-400">[YOUR CONTACT EMAIL]</span></p>
              </div>
            </section>

            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6 my-8">
              <h2 className="text-2xl font-black text-blue-400 mb-3">📝 Summary</h2>
              <p className="text-white font-semibold mb-2">
                We collect information to provide our entertainment service. Your username and rankings are public. We protect your data but cannot guarantee 100% security. You have rights to access, correct, or delete your information. Contact us with any questions.
              </p>
            </div>
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
