// ============================================
// Navbar Component
// ============================================
// Top bar of every dashboard page.
//
// Shows:
//   Left  → Page title + subtitle
//   Right → Current date + notification bell
//           + user avatar
//
// Receives title and subtitle as props
// because each page has different text
// ============================================

'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { getInitials } from '@/lib/utils'

interface NavbarProps {
    title: string   // e.g. "Dashboard"
    subtitle?: string  // e.g. "May 2025 — Here's your overview"
}

export default function Navbar({ title, subtitle }: NavbarProps) {
    const { user } = useAuthStore()

    // Format today's date nicely
    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    return (
        <header style={{
            height: '60px',
            backgroundColor: 'var(--card-bg)',
            borderBottom: '1px solid var(--ink-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky', // stays at top when page scrolls
            top: 0,
            zIndex: 30,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>

            {/* ── Left side — Page title ─────────────────── */}
            <div>
                <h1 style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'var(--ink-primary)',
                    margin: 0,
                    letterSpacing: '-0.3px',
                }}>
                    {title}
                </h1>
                {subtitle && (
                    <p style={{
                        fontSize: '12px',
                        color: 'var(--ink-muted)',
                        margin: 0,
                        marginTop: '1px',
                    }}>
                        {subtitle}
                    </p>
                )}
            </div>

            {/* ── Right side — Actions ───────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                {/* Current date pill */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '5px 10px',
                    background: 'var(--page-bg)',
                    border: '1px solid var(--ink-border)',
                    borderRadius: '20px',
                    fontSize: '11px',
                    color: 'var(--ink-muted)',
                    fontWeight: '500',
                }}>
                    {/* Calendar icon */}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {today}
                </div>

                {/* Notification bell */}
                <button style={{
                    width: '34px', height: '34px',
                    borderRadius: '50%',
                    border: '1px solid var(--ink-border)',
                    background: 'var(--card-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--ink-muted)',
                    position: 'relative',
                    transition: 'all 0.15s',
                }}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--primary-500)'
                        e.currentTarget.style.color = 'var(--primary-500)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--ink-border)'
                        e.currentTarget.style.color = 'var(--ink-muted)'
                    }}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    {/* Notification dot */}
                    <div style={{
                        position: 'absolute',
                        top: '7px', right: '7px',
                        width: '7px', height: '7px',
                        borderRadius: '50%',
                        background: 'var(--danger)',
                        border: '1.5px solid white',
                    }} />
                </button>

                {/* User avatar */}
                <div style={{
                    width: '34px', height: '34px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '600', color: 'white',
                    cursor: 'pointer',
                    border: '2px solid var(--primary-100)',
                    flexShrink: 0,
                }}>
                    {user ? getInitials(user.name) : '?'}
                </div>
            </div>
        </header>
    )
}