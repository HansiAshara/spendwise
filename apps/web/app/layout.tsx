// ============================================
// Root Layout
// ============================================
// Next.js built-in font loading — faster than
// Google Fonts CSS import, no layout shift
// ============================================

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NetworkStatus from '@/components/ui/NetworkStatus'

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
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('spendwise_theme');
                  var theme = saved || 'light';
                  if (theme === 'system') {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <NetworkStatus />
        {children}
      </body>
    </html>
  )
}