// ============================================
// Root Layout
// ============================================

import type { Metadata } from 'next'
import './globals.css'
import NetworkStatus from '@/components/ui/NetworkStatus'

export const metadata: Metadata = {
  title: 'SpendWise',
  description: 'Track expenses, set budgets and get AI-powered saving tips. Built for Sri Lankan students.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('spendwise_theme');
                  var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = 'light';
                  if (!saved || saved === 'system') {
                    theme = isDark ? 'dark' : 'light';
                  } else {
                    theme = saved;
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <NetworkStatus />
        {children}
      </body>
    </html>
  )
}