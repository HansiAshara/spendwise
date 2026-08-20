'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { User } from '@/types'

interface CurrencySectionProps {
    user: User | null
    loading: boolean
    onSubmit: (currency: string) => Promise<{ success: boolean; message: string }>
    onToast: (message: string, type: 'success' | 'error') => void
}

const CURRENCIES = [
    { code: 'LKR', label: 'Sri Lankan Rupee', symbol: 'Rs' },
    { code: 'USD', label: 'US Dollar', symbol: '$' },
    { code: 'EUR', label: 'Euro', symbol: '€' },
    { code: 'GBP', label: 'British Pound', symbol: '£' },
    { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
]

export default function CurrencySection({ user, loading, onSubmit, onToast }: CurrencySectionProps) {
    const [selected, setSelected] = useState(user?.currency || 'LKR')

    const handleSave = async () => {
        const result = await onSubmit(selected)
        onToast(result.message, result.success ? 'success' : 'error')
    }

    return (
        <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink-primary)', marginBottom: '4px' }}>
                Default currency
            </div>
            <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '20px' }}>
                All amounts across SpendWise will display in this currency.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', marginBottom: '20px', maxWidth: '600px' }}>
                {CURRENCIES.map(c => {
                    const isSelected = selected === c.code
                    return (
                        <button
                            key={c.code}
                            onClick={() => setSelected(c.code)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px',
                                borderRadius: '10px', border: `2px solid ${isSelected ? 'var(--primary-500)' : 'var(--ink-border)'}`,
                                background: isSelected ? 'var(--primary-50)' : 'white',
                                cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                            }}
                        >
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '8px',
                                background: isSelected ? 'var(--primary-500)' : 'var(--page-bg)',
                                color: isSelected ? 'white' : 'var(--ink-secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '14px', fontWeight: '600', flexShrink: 0,
                            }}>
                                {c.symbol}
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: isSelected ? 'var(--primary-600)' : 'var(--ink-primary)' }}>
                                    {c.code}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{c.label}</div>
                            </div>
                        </button>
                    )
                })}
            </div>

            <Button variant="primary" size="md" loading={loading} disabled={selected === user?.currency} onClick={handleSave}>
                Save preference
            </Button>
        </div>
    )
}