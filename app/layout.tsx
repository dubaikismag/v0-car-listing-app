'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-geist-mono' })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <title>DubaiKismag - Buy &amp; Sell in Dubai</title>
        <meta name="description" content="Dubai's premier classifieds marketplace" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="icon" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/apple-touch-icon-tv4jcor3qKUge0g7yZk72wwXar34V7.png" />
      </head>
      <body className="font-sans antialiased bg-[#f8f7fc]">
        {children}
      </body>
    </html>
  )
}
