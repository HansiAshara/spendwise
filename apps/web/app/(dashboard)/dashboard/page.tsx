// ============================================
// Dashboard Page — Placeholder
// ============================================
// Temporary placeholder so we can test the layout.
// We build the full dashboard on Day 11.
// ============================================

'use client'

import PageHeader from '@/components/layout/PageHeader'

export default function DashboardPage() {
    return (
        <div>
            <PageHeader
                title="Dashboard"
                subtitle="Welcome to SpendWise — your financial overview"
            />

            {/* Temporary placeholder cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                marginBottom: '24px',
            }}>
                {[
                    { label: 'Total spent', value: 'LKR 0', sub: 'This month' },
                    { label: 'Transactions', value: '0', sub: 'This month' },
                    { label: 'Top category', value: '—', sub: 'No data yet' },
                    { label: 'Budget alerts', value: '0', sub: 'All on track' },
                ].map((card) => (
                    <div key={card.label} className="metric-card">
                        <div className="metric-label">{card.label}</div>
                        <div className="metric-value" style={{ fontSize: '22px' }}>
                            {card.value}
                        </div>
                        <div className="metric-sub">{card.sub}</div>
                    </div>
                ))}
            </div>

            {/* Placeholder chart area */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
            }}>
                <div className="card" style={{ padding: '20px', minHeight: '200px' }}>
                    <div style={{
                        fontSize: '13px', fontWeight: '500',
                        color: 'var(--ink-primary)', marginBottom: '16px',
                    }}>
                        Spending by category
                    </div>
                    <div className="empty-state">
                        <div className="empty-state-icon">📊</div>
                        <div className="empty-state-title">No data yet</div>
                        <div className="empty-state-desc">
                            Log your first expense to see the chart
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '20px', minHeight: '200px' }}>
                    <div style={{
                        fontSize: '13px', fontWeight: '500',
                        color: 'var(--ink-primary)', marginBottom: '16px',
                    }}>
                        Monthly trend
                    </div>
                    <div className="empty-state">
                        <div className="empty-state-icon">📈</div>
                        <div className="empty-state-title">No data yet</div>
                        <div className="empty-state-desc">
                            Track expenses to see your spending trend
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}