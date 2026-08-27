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

export default function MarketingNavbar() {
    const { token } = useAuthStore()
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        const saved = (localStorage.getItem('spendwise_theme') as 'light' | 'dark' | 'system') || 'light'
        const resolved = saved === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : saved
        setTheme(resolved as 'light' | 'dark')
    }, [])

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        localStorage.setItem('spendwise_theme', next)
        document.documentElement.setAttribute('data-theme', next)
    }

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
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '999px',
                        background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                    }}>💰</div>
                    <span style={{ fontSize: '17px', fontWeight: '600', color: 'var(--ink-primary)' }}>SpendWise</span>
                </Link>

                <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <a href="#features" style={{ fontSize: '13px', color: 'var(--ink-secondary)', textDecoration: 'none', fontWeight: '500' }}>Features</a>
                    <a href="#how-it-works" style={{ fontSize: '13px', color: 'var(--ink-secondary)', textDecoration: 'none', fontWeight: '500' }}>How it works</a>

                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle Theme"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        style={{
                            background: 'var(--hover-bg)',
                            border: '1px solid var(--ink-border)',
                            borderRadius: '8px',
                            padding: '5px 9px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--ink-primary)',
                            transition: 'all 0.15s',
                        }}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

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