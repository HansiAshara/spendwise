// ============================================
// MarketingNavbar Component
// ============================================
// Top nav for the public landing page.
// Shows Login/Get Started when logged out,
// or a Dashboard link if already logged in.
// ============================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import Logo from '@/components/ui/Logo'

export default function MarketingNavbar() {
    const { token } = useAuthStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 40,
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid var(--ink-border)',
            transition: 'background-color 0.2s, border-color 0.2s',
        }}>
            <div style={{
                maxWidth: '1140px', margin: '0 auto',
                padding: '14px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <Logo size={32} />
                    <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink-primary)', letterSpacing: '-0.3px' }}>SpendWise</span>
                </Link>

                <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <a href="#features" style={{ fontSize: '13px', color: 'var(--ink-secondary)', textDecoration: 'none', fontWeight: '500' }}>Features</a>
                    <a href="#how-it-works" style={{ fontSize: '13px', color: 'var(--ink-secondary)', textDecoration: 'none', fontWeight: '500' }}>How it works</a>

                    {mounted && token ? (
                        <Link href="/dashboard" className="btn btn-primary btn-sm">Go to Dashboard</Link>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Link href="/login" style={{ fontSize: '13px', color: 'var(--ink-secondary)', textDecoration: 'none', fontWeight: '500' }}>Sign in</Link>
                            <Link href="/register" className="btn btn-primary btn-sm">Get started free</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}