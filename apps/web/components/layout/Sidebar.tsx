// ============================================
// Sidebar Component
// ============================================
// Fixed left navigation panel.
//
// Key concepts:
//   - usePathname() → gets current URL path
//     so we can highlight the active nav item
//   - Link component → client-side navigation
//     (no full page reload)
//   - Responsive → collapses on mobile
//
// Structure:
//   Top    → Logo
//   Middle → Navigation links
//   Bottom → User avatar + logout
// ============================================

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { getInitials } from '@/lib/utils'
import api from '@/lib/api'

// Navigation items configuration
// Adding a new page = just add an item here
const navItems = [
    {
        href: '/dashboard',
        label: 'Dashboard',
        // SVG icon for each nav item
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        href: '/expenses',
        label: 'Expenses',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        ),
    },
    {
        href: '/budgets',
        label: 'Budgets',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </svg>
        ),
    },
    {
        href: '/insights',
        label: 'AI Insights',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a8 8 0 0 1 8 8c0 3-1.5 5.5-4 7l-1 3H9l-1-3C5.5 15.5 4 13 4 10a8 8 0 0 1 8-8z" />
                <line x1="9" y1="21" x2="15" y2="21" />
            </svg>
        ),
    },
    {
        href: '/export',
        label: 'Export',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
        ),
    },
]

const bottomNavItems = [
    {
        href: '/settings',
        label: 'Settings',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
    },
]

export default function Sidebar() {
    const pathname = usePathname()   // current URL path
    const router = useRouter()
    const { user, logout } = useAuthStore()

    // Check if a nav item is active
    // startsWith handles nested routes e.g. /expenses/123
    const isActive = (href: string) => pathname.startsWith(href)

    // Handle logout
    const handleLogout = async () => {
        try {
            // Tell backend to clear server-side session
            await api.post('/api/auth/logout')
        } catch {
            // Even if API fails, clear local state
        }
        logout()             // clear Zustand store + cookie
        router.push('/login')
    }

    return (
        <aside style={{
            width: '220px',
            minHeight: '100vh',
            backgroundColor: 'var(--navy)',
            display: 'flex',
            flexDirection: 'column',
            padding: '0',
            position: 'fixed', // stays in place while content scrolls
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 40,
            borderRight: '1px solid rgba(255,255,255,0.06)',
        }}>

            {/* ── Logo ──────────────────────────────────── */}
            <div style={{
                padding: '20px 16px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
                <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Logo icon */}
                        <div style={{
                            width: '34px', height: '34px',
                            background: 'linear-gradient(135deg, var(--primary-500), var(--primary-400))',
                            borderRadius: '9px',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '17px',
                            boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
                        }}>
                            💰
                        </div>
                        <div>
                            <div style={{
                                fontSize: '15px', fontWeight: '600',
                                color: 'white', letterSpacing: '-0.3px',
                            }}>
                                SpendWise
                            </div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
                                Personal Finance
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* ── Main Navigation ────────────────────────── */}
            <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>

                {/* Nav section label */}
                <div style={{
                    fontSize: '10px', fontWeight: '600',
                    color: 'rgba(255,255,255,0.25)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '0 6px',
                    marginBottom: '6px',
                }}>
                    Menu
                </div>

                {/* Main nav items */}
                {navItems.map((item) => {
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{ textDecoration: 'none', display: 'block', marginBottom: '2px' }}
                        >
                            <div
                                className={`nav-item ${active ? 'active' : ''}`}
                                style={{
                                    // Extra glow on active item
                                    boxShadow: active
                                        ? 'inset 0 0 0 1px rgba(99,102,241,0.2)'
                                        : 'none',
                                }}
                            >
                                {/* Icon */}
                                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                                {/* Label */}
                                <span>{item.label}</span>
                                {/* Active dot indicator */}
                                {active && (
                                    <div style={{
                                        marginLeft: 'auto',
                                        width: '6px', height: '6px',
                                        borderRadius: '50%',
                                        background: 'var(--primary-400)',
                                    }} />
                                )}
                            </div>
                        </Link>
                    )
                })}

                {/* Divider */}
                <div style={{
                    height: '1px',
                    background: 'rgba(255,255,255,0.06)',
                    margin: '12px 6px',
                }} />

                {/* Bottom nav items (Settings) */}
                {bottomNavItems.map((item) => {
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{ textDecoration: 'none', display: 'block', marginBottom: '2px' }}
                        >
                            <div className={`nav-item ${active ? 'active' : ''}`}>
                                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* ── User section at bottom ─────────────────── */}
            <div style={{
                padding: '12px 10px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
                {/* User info pill */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    marginBottom: '8px',
                    cursor: 'default',
                }}>
                    {/* Avatar with initials */}
                    <div style={{
                        width: '32px', height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px', fontWeight: '600', color: 'white',
                        flexShrink: 0,
                    }}>
                        {user ? getInitials(user.name) : '?'}
                    </div>
                    {/* Name and email */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontSize: '12px', fontWeight: '500',
                            color: 'white',
                            // Truncate long names
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                            {user?.name || 'Loading...'}
                        </div>
                        <div style={{
                            fontSize: '10px', color: 'rgba(255,255,255,0.35)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                            {user?.email || ''}
                        </div>
                    </div>
                </div>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 10px',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px',
                        color: 'rgba(255,255,255,0.45)',
                        fontSize: '12px', fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'
                        e.currentTarget.style.color = '#FCA5A5'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                    }}
                >
                    {/* Logout icon */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign out
                </button>
            </div>
        </aside>
    )
}