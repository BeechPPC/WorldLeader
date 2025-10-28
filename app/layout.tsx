import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://world-leader.vercel.app'),
  title: {
    default: 'WorldLeader.io - Climb the Global Leaderboard',
    template: '%s | WorldLeader.io',
  },
  description: 'Compete globally and climb to #1 on WorldLeader.io. Purchase positions, overtake rivals, and dominate continental and worldwide rankings. Join the ultimate competitive leaderboard.',
  keywords: [
    'global leaderboard',
    'competitive ranking',
    'world rankings',
    'leaderboard game',
    'position climbing',
    'competitive gaming',
    'global competition',
    'continental rankings',
    'worldwide leaderboard',
    'competitive platform',
  ],
  authors: [{ name: 'WorldLeader.io' }],
  creator: 'WorldLeader.io',
  publisher: 'WorldLeader.io',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'WorldLeader.io - Climb the Global Leaderboard',
    description: 'Compete globally and climb to #1. Purchase positions, overtake rivals, and dominate continental and worldwide rankings.',
    siteName: 'WorldLeader.io',
    images: [
      {
        url: '/og-image.png', // You'll need to create this image
        width: 1200,
        height: 630,
        alt: 'WorldLeader.io - Global Competitive Leaderboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorldLeader.io - Climb the Global Leaderboard',
    description: 'Compete globally and climb to #1. Purchase positions, overtake rivals, and dominate rankings.',
    images: ['/og-image.png'], // Same image as OpenGraph
    creator: '@worldleaderio', // Replace with your actual Twitter handle
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'your-google-verification-code', // Add after setting up Google Search Console
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'gaming',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'WorldLeader.io',
    applicationCategory: 'GameApplication',
    description: 'Compete globally and climb to #1 on WorldLeader.io. Purchase positions, overtake rivals, and dominate continental and worldwide rankings.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://world-leader.vercel.app',
    offers: {
      '@type': 'Offer',
      category: 'Competitive Gaming Platform',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f3f4f6',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#f3f4f6',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f3f4f6',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
