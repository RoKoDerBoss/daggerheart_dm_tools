import type { Metadata, Viewport } from 'next'
import { Inter, Cormorant_Upright } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { DiceLayout } from '@/components/DiceLayout'

const inter = Inter({ subsets: ['latin'] })
const cormorantUpright = Cormorant_Upright({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant'
})

const siteUrl = process.env.SITE_URL || 'https://your-domain.netlify.app'

export const metadata: Metadata = {
  title: {
    default: 'Daggerheart DM Tools - Essential Tools for Game Masters',
    template: '%s | Daggerheart DM Tools'
  },
  description: 'A comprehensive collection of tools for Daggerheart tabletop RPG Game Masters. Generate loot, calculate battle points, and manage your campaigns with ease.',
  keywords: [
    'Daggerheart',
    'DM Tools',
    'Game Master',
    'RPG',
    'Tabletop',
    'Loot Generator',
    'Battle Points',
    'Campaign Management',
    'TTRPG'
  ],
  authors: [{ name: 'Daggerheart Community' }],
  creator: 'Daggerheart Community',
  publisher: 'Daggerheart Community',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Daggerheart DM Tools - Essential Tools for Game Masters',
    description: 'A comprehensive collection of tools for Daggerheart tabletop RPG Game Masters. Generate loot, calculate battle points, and manage your campaigns with ease.',
    siteName: 'Daggerheart DM Tools',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Daggerheart DM Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daggerheart DM Tools - Essential Tools for Game Masters',
    description: 'A comprehensive collection of tools for Daggerheart tabletop RPG Game Masters.',
    images: ['/og-image.png'],
  },
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
  verification: {
    // Add your verification codes here when you have them
    // google: 'your-google-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f9fa' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Additional meta tags for better SEO */}
        <meta name="application-name" content="Daggerheart DM Tools" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Daggerheart DM Tools" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1a1a1a" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${inter.className} ${cormorantUpright.variable} bg-fantasy text-foreground antialiased`}
        suppressHydrationWarning
      >
        <Navbar />
        <main className="min-h-screen">
          <DiceLayout>
            {children}
          </DiceLayout>
        </main>
      </body>
    </html>
  )
} 