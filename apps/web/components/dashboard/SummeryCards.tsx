// ============================================
// SummaryCards Component
// ============================================
// 4 metric cards at the top of dashboard.
// Each card has icon, value, label, and trend.
// ============================================

'use client'

import { CategorySummary } from '@/types'
import { formatLKRCompact, getMonthName } from '@/lib/utils'

interface SummaryCardsProps {
    totalSpent: number
    expenseCount: number
    topCategory: CategorySummary | null
    budgetAlerts: number
    month: number
    year: number
    loading: boolean
}

// Individual metric card
function MetricCard({
    label, value, sub, icon, iconBg, loading,
}: {
    label: string
    value: string | number
    sub: string
    icon: string
    iconBg: string
    loading: boolean
}) {
    return (
        <div className="metric-card" style={{ position: 'relative', overflow: 'hidden' }}>

            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: `${iconBg}15`,
            }} />

            {/* Icon */}
            <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: `${iconBg}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                marginBottom: '12px',
            }}>
                {icon}
            </div>

            {/* Value */}
            <div className="metric-label">{label}</div>
            <div style={{
                fontSize: '22px',
                fontWeight: '600',
                color: 'var(--ink-primary)',
                marginTop: '4px',
                marginBottom: '6px',
                lineHeight: '1.2',
            }}>
                {loading
                    ? <div className="skeleton" style={{ height: '26px', width: '100px' }} />
                    : value
                }
            </div>

            {/* Subtitle */}
            <div style={{
                fontSize: '12px',
                color: 'var(--ink-muted)',
            }}>
                {sub}
            </div>
        </div>
    )
}

export default function SummaryCards({
    totalSpent, expenseCount, topCategory,
    budgetAlerts, month, year, loading,
}: SummaryCardsProps) {

    const monthName = getMonthName(month)

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '24px',
        }}>

            <MetricCard
                label="Total spent"
                value={formatLKRCompact(totalSpent)}
                sub={`${monthName} ${year}`}
                icon="💸"
                iconBg="#6366F1"
                loading={loading}
            />

            <MetricCard
                label="Transactions"
                value={expenseCount}
                sub="This month"
                icon="🧾"
                iconBg="#10B981"
                loading={loading}
            />

            <MetricCard
                label="Top category"
                value={topCategory
                    ? `${topCategory.icon} ${topCategory.categoryName}`
                    : '—'
                }
                sub={topCategory
                    ? formatLKRCompact(topCategory.spent)
                    : 'No data yet'
                }
                icon="🏆"
                iconBg="#F59E0B"
                loading={loading}
            />

            <MetricCard
                label="Budget alerts"
                value={budgetAlerts === 0 ? '✓ All clear' : `${budgetAlerts} alert${budgetAlerts > 1 ? 's' : ''}`}
                sub={budgetAlerts === 0 ? 'On track' : 'Over 80% limit'}
                icon={budgetAlerts === 0 ? '🎯' : '⚠️'}
                iconBg={budgetAlerts === 0 ? '#10B981' : '#EF4444'}
                loading={loading}
            />

        </div>
    )
}