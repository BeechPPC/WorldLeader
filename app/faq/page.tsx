'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "What is WorldLeader.io?",
      answer: "WorldLeader.io is a FUN, ENTERTAINMENT-ONLY social ranking platform where users can climb leaderboards by making purchases. It's similar to a video game where you pay to advance - it's purely for fun and has NO real-world value, prizes, or benefits."
    },
    {
      question: "Is this gambling or a game of chance?",
      answer: "NO. This is NOT gambling. There are no prizes, rewards, or payouts. You cannot win money. When you purchase positions, you know exactly what you're getting - a higher rank on our entertainment leaderboard. It's similar to paying for in-game items in a video game."
    },
    {
      question: "Can I get a refund?",
      answer: "ABSOLUTELY NOT. All sales are 100% FINAL and NON-REFUNDABLE under any circumstances. This is clearly stated before every purchase. Think of it like buying a movie ticket - once you've purchased the entertainment, you don't get your money back. Please only spend what you can afford to lose on entertainment."
    },
    {
      question: "What do I get when I make a purchase?",
      answer: "You get entertainment value and the fun of seeing your name climb the leaderboard. For every $1 USD you spend, you move up 1 position on your continent and global rankings. That's it. There are NO prizes, NO rewards, NO tangible benefits, and NO real-world value."
    },
    {
      question: "Does my rank have any real-world value?",
      answer: "NO. Your rank is purely virtual and exists only for entertainment on our platform. Being #1 doesn't mean anything outside of WorldLeader.io. You can't use it for professional purposes, credibility, or any real-world benefits. It's just for fun."
    },
    {
      question: "Can I cash out or make money?",
      answer: "NO. This is NOT an investment, NOT a money-making opportunity, and there is NO way to cash out or earn returns. Any money you spend is gone forever - you're paying for entertainment, not an investment."
    },
    {
      question: "What happens if someone else passes my rank?",
      answer: "Other users can purchase positions and surpass you at any time. Your rank is not guaranteed or permanent. This is part of the competitive fun of the platform. If you want to reclaim your position, you'll need to purchase more positions."
    },
    {
      question: "Are there any prizes for being #1?",
      answer: "NO. There are absolutely NO prizes, rewards, cash payouts, or tangible benefits for any rank, including #1. The only 'prize' is the entertainment value and bragging rights on our platform."
    },
    {
      question: "Is this a scam?",
      answer: "NO. We are completely transparent about what you're getting. We clearly state this is ENTERTAINMENT ONLY with NO refunds, NO real-world value, and NO prizes. A scam would promise something and not deliver. We deliver exactly what we promise - a fun ranking system for entertainment purposes."
    },
    {
      question: "Who can use WorldLeader.io?",
      answer: "Only people aged 18 and older can use WorldLeader.io. By registering, you confirm you are of legal age. This service is not intended for minors."
    },
    {
      question: "Is my information public?",
      answer: "Your username, country flag, continent, and rankings are publicly visible to all users on the leaderboards. Your email address and payment information are kept private. DO NOT use personally identifiable information as your username if you want to remain anonymous."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards and payment methods through our third-party payment processor. Payment processing is handled securely. All purchases are FINAL and NON-REFUNDABLE."
    },
    {
      question: "Can I change my username or country?",
      answer: "Currently, username and country selection are permanent once set during registration. This is to maintain the integrity of the leaderboards and prevent manipulation."
    },
    {
      question: "What if there's a technical error or bug?",
      answer: "While we strive to maintain a reliable service, technical issues can occur. We are not liable for bugs, errors, or service interruptions. Technical issues do NOT entitle you to refunds. The service is provided 'as is' without guarantees."
    },
    {
      question: "Can my account be banned or suspended?",
      answer: "Yes. We reserve the right to suspend or terminate accounts that violate our Terms of Service, engage in abusive behavior, use offensive usernames, or attempt to manipulate the system. Account termination does NOT entitle you to refunds."
    },
    {
      question: "Will WorldLeader.io always be available?",
      answer: "We cannot guarantee the service will run forever. We reserve the right to modify, suspend, or discontinue the service at any time without notice or refunds. This is clearly stated in our Terms of Service."
    },
    {
      question: "Can I dispute a charge or do a chargeback?",
      answer: "You agree NOT to dispute charges or initiate chargebacks when you make a purchase. All sales are final. Fraudulent chargebacks or payment disputes will result in immediate account termination and may result in legal action."
    },
    {
      question: "Is this an investment or cryptocurrency?",
      answer: "NO. This is NOT an investment, NOT cryptocurrency, NOT an NFT, and NOT a financial instrument. You cannot earn returns, sell your rank, or trade positions. This is pure entertainment with zero investment value."
    },
    {
      question: "How is this different from mobile games?",
      answer: "It's very similar! Many mobile games let you pay to advance or unlock features. WorldLeader.io is like that - you're paying for the entertainment of climbing a leaderboard. The main difference is we're completely transparent that there are no prizes or real-world value."
    },
    {
      question: "What happens to my money when I make a purchase?",
      answer: "Your payment goes to WorldLeader.io as payment for entertainment services (climbing positions on the leaderboard). It's revenue for operating and maintaining the platform. You do NOT get equity, ownership, or any form of investment return."
    },
    {
      question: "Can I get my rank back if I delete my account?",
      answer: "NO. Once you delete your account, all data including your rank is permanently deleted and cannot be recovered. You will NOT receive any compensation or refunds for your previous purchases."
    },
    {
      question: "Are rankings rigged or manipulated?",
      answer: "No. Rankings are based purely on the purchases made by users. Everyone follows the same rules: $1 = 1 position up. We do not manipulate rankings or give special treatment to any users."
    },
    {
      question: "What if I accidentally made a purchase?",
      answer: "All purchases require explicit confirmation. Accidental purchases are NOT eligible for refunds. Please be careful when making purchases and only confirm when you're sure."
    },
    {
      question: "Can I transfer my rank to someone else?",
      answer: "NO. Accounts, usernames, and ranks are non-transferable. You cannot sell, trade, or gift your account or position to anyone else."
    },
    {
      question: "What's your refund policy?",
      answer: "We have a NO REFUND policy. All sales are 100% final and non-refundable under any circumstances, including but not limited to: change of mind, buyer's remorse, financial hardship, not liking your rank, being surpassed by others, service changes, account termination, or any other reason. This is stated clearly before every purchase."
    },
    {
      question: "Is this legal?",
      answer: "Yes. WorldLeader.io operates as an entertainment platform. We are completely transparent about what users are paying for (entertainment value only), we clearly state there are no refunds, and we don't make false promises. Users must be 18+ and agree to our Terms of Service."
    },
    {
      question: "How do I contact support?",
      answer: "You can contact us at [YOUR CONTACT EMAIL]. Please note that contacting support does NOT entitle you to refunds or special treatment. We can assist with technical issues and account questions, but all sales remain final."
    },
    {
      question: "Can I file a complaint or lawsuit?",
      answer: "By using WorldLeader.io, you agree to resolve disputes through binding arbitration, NOT court litigation. You waive your right to jury trials and class action lawsuits. This is clearly stated in our Terms of Service."
    },
    {
      question: "What should I know before spending money?",
      answer: "Before making any purchase, understand that: (1) This is ENTERTAINMENT ONLY, (2) There are ABSOLUTELY NO REFUNDS, (3) Rankings have NO real-world value, (4) There are NO prizes or rewards, (5) You're paying for FUN, not an investment, (6) Other users can surpass you, (7) Your rank is not permanent, (8) The service can change or shut down. Only spend what you can afford to lose on entertainment."
    },
    {
      question: "Is WorldLeader.io responsible if I spend too much?",
      answer: "NO. You are solely responsible for your spending decisions. We clearly warn that this is entertainment only with no refunds. We recommend only spending what you can comfortably afford to lose on entertainment, just like you would with movies, games, or other recreational activities."
    }
  ]

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
            Frequently Asked Questions
          </h1>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-black text-yellow-400 mb-2">⚠️ Important Reminder</h2>
            <p className="text-yellow-200 font-semibold">
              WorldLeader.io is ENTERTAINMENT ONLY. No refunds. No real-world value. No prizes. Just fun!
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden transition-all hover:border-gray-600/50"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-700/20 transition-colors"
                >
                  <span className="font-bold text-gray-100 text-lg pr-4">
                    {faq.question}
                  </span>
                  <span className="text-2xl text-purple-400 flex-shrink-0">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700/50">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-8 mt-12">
            <h2 className="text-2xl font-black text-blue-400 mb-4">Still Have Questions?</h2>
            <p className="text-gray-300 mb-4">
              If you have questions not answered here, please contact us at:
            </p>
            <p className="text-blue-400 font-bold text-lg mb-4">
              [YOUR CONTACT EMAIL]
            </p>
            <p className="text-sm text-gray-400 italic">
              Note: We cannot provide refunds or make exceptions to our policies. Please read our Terms of Service and Disclaimer before using the service.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4">Read our legal documents:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/terms"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition-transform"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="px-6 py-3 bg-gray-700/50 text-white font-bold rounded-xl hover:bg-gray-600/50 transition-colors border border-gray-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="/disclaimer"
                className="px-6 py-3 bg-red-600/20 text-red-400 font-bold rounded-xl hover:bg-red-600/30 transition-colors border border-red-500/50"
              >
                Disclaimer
              </Link>
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
