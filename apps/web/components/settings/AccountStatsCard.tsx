// ============================================
// AccountStatsCard Component
// ============================================
// Quick summary strip — expenses logged,
// budgets set, member duration.
// ============================================

'use client'

interface AccountStatsCardProps {
    stats: { expenseCount: number; budgetCount: number; memberMonths: number } | null
    loading: boolean
}

export default function AccountStatsCard({ stats, loading }: AccountStatsCardProps) {
    const items = [
        { label: 'Expenses logged', value: stats?.expenseCount ?? 0, icon: '🧾' },
        { label: 'Budgets set', value: stats?.budgetCount ?? 0, icon: '🎯' },
        {
            label: 'Member for',
            value: stats ? `${stats.memberMonths} ${stats.memberMonths === 1 ? 'month' : 'months'}` : '—',
            icon: '📅',
        },
    ]

    return (
        <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px',
            marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--ink-border)',
        }}>
            {items.map(item => (
                <div key={item.label} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', background: 'var(--hover-bg)', borderRadius: '10px',
                    border: '1px solid var(--ink-border)',
                }}>
                    <div style={{ fontSize: '18px' }}>{item.icon}</div>
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink-primary)' }}>
                            {loading ? <span className="skeleton" style={{ display: 'inline-block', width: '30px', height: '16px' }} /> : item.value}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', fontWeight: '500' }}>{item.label}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}