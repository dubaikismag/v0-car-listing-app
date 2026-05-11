import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'DubaiKisMag - Buy & Sell in Dubai',
  description: 'Dubai\'s premier classifieds marketplace. Buy and sell cars, properties, electronics, and more. Post free ads and connect with buyers in Dubai.',
  keywords: ['dubai classifieds', 'buy sell dubai', 'cars dubai', 'property dubai', 'dubaikismag'],
  authors: [{ name: 'DubaiKisMag' }],
  creator: 'DubaiKisMag',
  publisher: 'DubaiKisMag',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'DubaiKisMag - Buy & Sell in Dubai',
    description: 'Dubai\'s premier classifieds marketplace',
    url: 'https://dubaikismag.com',
    siteName: 'DubaiKisMag',
    locale: 'en_AE',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f59e0b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
