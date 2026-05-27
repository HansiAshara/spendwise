// ============================================
// Root Layout
// ============================================
// Next.js built-in font loading — faster than
// Google Fonts CSS import, no layout shift
// ============================================

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Load Inter font via Next.js font system
// This is the correct way in Next.js 13+
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title:       'SpendWise — Personal Finance Tracker',
  description: 'Track expenses, set budgets and get AI-powered saving tips. Built for Sri Lankan students.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}