import { redirect } from 'next/navigation'

// ============================================
// Root Page
// ============================================
// This page just redirects immediately.
// Logged in  → /dashboard (handled by middleware later)
// Not logged in → /login
// ============================================

export default function RootPage() {
  redirect('/login')
}