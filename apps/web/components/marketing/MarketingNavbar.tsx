// ============================================
// MarketingNavbar Component
// ============================================
// Top nav for the public landing page.
// Shows Login/Get Started when logged out,
// or a Dashboard link if already logged in.
// ============================================

'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'

export default function MarketingNavbar() {
    const { token } = useAuthStore()

    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 40,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid var(--ink-border)',
        }}>
            <div style={{
                maxWidth: '1140px', margin: '0 auto',
                padding: '14px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '9px',
                        background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                    }}>💰</div>
                    <span style={{ fontSize: '17px', fontWeight: '600', color: 'var(--ink-primary)' }}>SpendWise</span>
                </Link>

                <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                    <a href="#features" style={{ fontSize: '13px', color: 'var(--ink-secondary)', textDecoration: 'none', fontWeight: '500' }}>Features</a>
                    <a href="#how-it-works" style={{ fontSize: '13px', color: 'var(--ink-secondary)', textDecoration: 'none', fontWeight: '500' }}>How it works</a>

                    {token ? (
                        <Link href="/dashboard" className="btn btn-primary btn-sm">Go to Dashboard</Link>
                    ) : (
                        <>
                            <Link href="/login" style={{ fontSize: '13px', color: 'var(--ink-secondary)', textDecoration: 'none', fontWeight: '500' }}>Sign in</Link>
                            <Link href="/register" className="btn btn-primary btn-sm">Get started free</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}