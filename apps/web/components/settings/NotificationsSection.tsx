// ============================================
// NotificationsSection Component
// ============================================
// Toggle switches for notification preferences.
// ============================================

'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { User } from '@/types'

interface NotificationsSectionProps {
    user: User | null
    loading: boolean
    onSubmit: (prefs: { notifyBudgetAlerts: boolean; notifyWeeklySummary: boolean; notifyMonthlyReport: boolean }) => Promise<{ success: boolean; message: string }>
    onToast: (message: string, type: 'success' | 'error') => void
}

// Reusable toggle switch
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            style={{
                width: '40px', height: '22px', borderRadius: '999px',
                background: checked ? 'var(--primary-500)' : 'var(--ink-border)',
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background 0.2s', flexShrink: 0,
            }}
        >
            <div style={{
                width: '16px', height: '16px', borderRadius: '50%', background: 'white',
                position: 'absolute', top: '3px', left: checked ? '21px' : '3px',
                transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }} />
        </button>
    )
}

export default function NotificationsSection({ user, loading, onSubmit, onToast }: NotificationsSectionProps) {
    const [prefs, setPrefs] = useState({
        notifyBudgetAlerts: user?.notifyBudgetAlerts ?? true,
        notifyWeeklySummary: user?.notifyWeeklySummary ?? false,
        notifyMonthlyReport: user?.notifyMonthlyReport ?? true,
    })

    useEffect(() => {
        if (user) {
            setPrefs({
                notifyBudgetAlerts: user.notifyBudgetAlerts,
                notifyWeeklySummary: user.notifyWeeklySummary,
                notifyMonthlyReport: user.notifyMonthlyReport,
            })
        }
    }, [user])

    const hasChanges = user && (
        prefs.notifyBudgetAlerts !== user.notifyBudgetAlerts ||
        prefs.notifyWeeklySummary !== user.notifyWeeklySummary ||
        prefs.notifyMonthlyReport !== user.notifyMonthlyReport
    )

    const items = [
        {
            key: 'notifyBudgetAlerts' as const,
            title: 'Budget alerts',
            desc: 'Get notified when a budget hits 80% or exceeds its limit',
            icon: '⚠️',
        },
        {
            key: 'notifyWeeklySummary' as const,
            title: 'Weekly summary',
            desc: 'A short recap of your spending every Monday',
            icon: '📊',
        },
        {
            key: 'notifyMonthlyReport' as const,
            title: 'Monthly report',
            desc: 'Detailed breakdown of your spending at the end of each month',
            icon: '📅',
        },
    ]

    const handleSave = async () => {
        const result = await onSubmit(prefs)
        onToast(result.message, result.success ? 'success' : 'error')
    }

    return (
        <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink-primary)', marginBottom: '4px' }}>
                Notification preferences
            </div>
            <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '20px' }}>
                Choose what you want to be notified about.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '20px' }}>
                {items.map(item => (
                    <div key={item.key} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px 4px', borderBottom: '1px solid var(--ink-border)',
                    }}>
                        <div style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--ink-primary)' }}>{item.title}</div>
                            <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginTop: '2px' }}>{item.desc}</div>
                        </div>
                        <Toggle
                            checked={prefs[item.key]}
                            onChange={() => setPrefs(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                        />
                    </div>
                ))}
            </div>

            <Button variant="primary" size="md" loading={loading} disabled={!hasChanges} onClick={handleSave}>
                Save preferences
            </Button>
        </div>
    )
}