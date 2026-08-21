// ============================================
// Dashboard Layout
// ============================================
// App shell wrapping all protected pages.
// Fix: use mounted state to prevent hydration
// mismatch between server and client render.
// ============================================

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import api from '@/lib/api'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { user, token, login, logout } = useAuthStore()

    // ── Hydration fix ─────────────────────────────────
    // mounted starts as false on BOTH server and client
    // so the first render always matches (no mismatch)
    // After mount, client sets it to true and shows content
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // This only runs in the browser — never on server
        setMounted(true)
    }, [])

    // ── Auth check ────────────────────────────────────
    useEffect(() => {
        // Only run after component has mounted in browser
        if (!mounted) return

        const fetchUser = async () => {
            if (token && !user) {
                try {
                    const response = await api.get('/api/auth/me')
                    const fetchedUser = response.data.data.user
                    login(fetchedUser, token)
                } catch {
                    logout()
                    router.push('/login')
                }
            }

            if (!token) {
                router.push('/login')
            }
        }

        fetchUser()
    }, [mounted, token])

    // ── Loading state ─────────────────────────────────
    // Show nothing until client has mounted
    // This prevents hydration mismatch completely
    if (!mounted) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: 'var(--page-bg)',
            }}>
                {/* Simple loading spinner */}
                <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    border: '3px solid var(--ink-border)',
                    borderTopColor: 'var(--primary-500)',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        )
    }

    // ── No token — show nothing while redirecting ──────
    if (!token) return null

    // ── Authenticated — show full layout ──────────────
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>

            {/* Fixed sidebar — 256px wide */}
            <Sidebar />

            {/* Main area — offset by sidebar width */}
            <div style={{
                flex: 1,
                marginLeft: '256px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: 'var(--page-bg)',
            }}>

                {/* Sticky top navbar */}
                <Navbar title="SpendWise" />

                {/* Scrollable page content */}
                <main
                    style={{
                        flex: 1,
                        padding: '28px',
                        overflowY: 'auto',
                    }}
                    className="page-animate dashboard-main"
                >
                    {children}
                </main>

            </div>
            <style>{`
                @media (max-width: 900px) {
                    .dashboard-content { margin-left: 0 !important; }
                    .dashboard-main    { padding: 20px 16px !important; padding-top: 64px !important; }
                }
            `}</style>
        </div>
    )
}