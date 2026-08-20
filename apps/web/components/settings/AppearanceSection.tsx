// ============================================
// AppearanceSection Component
// ============================================
// Light / Dark / System theme toggle.
// Saved to localStorage, applied via a
// data-theme attribute on <html>.
// ============================================

'use client'

import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

const THEMES: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '🖥️' },
]

export default function AppearanceSection() {
    const [theme, setTheme] = useState<Theme>('light')

    useEffect(() => {
        const saved = (localStorage.getItem('spendwise_theme') as Theme) || 'light'
        setTheme(saved)
        applyTheme(saved)
    }, [])

    const applyTheme = (t: Theme) => {
        const resolved = t === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : t
        document.documentElement.setAttribute('data-theme', resolved)
    }

    const handleSelect = (t: Theme) => {
        setTheme(t)
        localStorage.setItem('spendwise_theme', t)
        applyTheme(t)
    }

    return (
        <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink-primary)', marginBottom: '4px' }}>
                Appearance
            </div>
            <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '20px' }}>
                Choose how SpendWise looks on your device.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', maxWidth: '420px' }}>
                {THEMES.map(t => {
                    const isSelected = theme === t.value
                    return (
                        <button
                            key={t.value}
                            onClick={() => handleSelect(t.value)}
                            style={{
                                padding: '16px 10px', borderRadius: '12px',
                                border: `2px solid ${isSelected ? 'var(--primary-500)' : 'var(--ink-border)'}`,
                                background: isSelected ? 'var(--primary-50)' : 'white',
                                cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit',
                                transition: 'all 0.15s',
                            }}
                        >
                            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{t.icon}</div>
                            <div style={{
                                fontSize: '12px', fontWeight: '600',
                                color: isSelected ? 'var(--primary-600)' : 'var(--ink-secondary)',
                            }}>
                                {t.label}
                            </div>
                        </button>
                    )
                })}
            </div>

            <p style={{ fontSize: '11px', color: 'var(--ink-faint)', marginTop: '16px' }}>
                Dark mode is in early preview — some pages may not be fully styled yet.
            </p>
        </div>
    )
}