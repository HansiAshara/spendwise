// ============================================
// Dashboard Page
// ============================================
// Main overview page of SpendWise.
//
// Layout:
//   Row 1: 4 Summary cards
//   Row 2: Donut chart | Bar chart
//   Row 3: Area chart (full width)
//   Row 4: Recent expenses | AI tip card
// ============================================

'use client'

import { useDashboard } from '@/hooks/useDashboard'
import { useExpenses } from '@/hooks/useExpenses'
import PageHeader from '@/components/layout/PageHeader'

//import AiTipCard            from '@/components/dashboard/AiTipCard'   ---- use functions from this file instead of external component to reduce bundle size
//import RecentExpenses       from '@/components/dashboard/RecentExpenses'
// Local fallback for AiTipCard - some environments may not have the
// external component available. Keep API surface small and compatible
// with how this page uses it.
function SummaryCards({
    totalSpent,
    expenseCount,
    topCategory,
    budgetAlerts,
    month,
    year,
    loading,
}: {
    totalSpent: number
    expenseCount: number
    topCategory: any
    budgetAlerts: number
    month: number
    year: number
    loading?: boolean
}) {
    const cards = [
        { label: 'Total spent', value: totalSpent },
        { label: 'Transactions', value: expenseCount },
        { label: 'Top category', value: topCategory ? `${topCategory.icon} ${topCategory.categoryName}` : '—' },
        { label: 'Budget alerts', value: budgetAlerts },
    ]

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
            {cards.map(card => (
                <div key={card.label} className="card" style={{ padding: '18px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                        {card.label}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink-primary)' }}>
                        {loading ? <span className="skeleton" style={{ display: 'inline-block', width: '80px', height: '18px' }} /> : card.value}
                    </div>
                </div>
            ))}
            <div className="sr-only">{month} {year}</div>
        </div>
    )
}

function AiTipCard({
    totalSpent,
    topCategory,
    loading,
}: {
    totalSpent: number
    topCategory: any
    loading?: boolean
}) {
    return (
        <div className="card" style={{ padding: '18px' }}>
            <div style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--ink-primary)',
                marginBottom: '10px',
            }}>
                AI tips
            </div>
            {loading ? (
                <div className="skeleton" style={{ height: '48px', width: '100%' }} />
            ) : (
                <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
                    {topCategory
                        ? `Consider reviewing your ${topCategory.categoryName} spending — you spent ${totalSpent}.`
                        : 'No tips available yet.'}
                </div>
            )}
        </div>
    )
}
import RecentExpenses from '@/components/dashboard/RecentExpenses'
import DonutChart from '@/components/charts/DonutChart'
import BarChart from '@/components/charts/BarChart'
import AreaChart from '@/components/charts/AreaChart'
import { getMonthName } from '@/lib/utils'

// Reusable chart card wrapper
function ChartCard({
    title, subtitle, children,
}: {
    title: string
    subtitle?: string
    children: React.ReactNode
}) {
    return (
        <div className="card" style={{ padding: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
                <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--ink-primary)',
                }}>
                    {title}
                </div>
                {subtitle && (
                    <div style={{
                        fontSize: '12px',
                        color: 'var(--ink-muted)',
                        marginTop: '2px',
                    }}>
                        {subtitle}
                    </div>
                )}
            </div>
            {children}
        </div>
    )
}

export default function DashboardPage() {
    // Dashboard analytics data
    const { data, loading, error } = useDashboard()

    // Recent expenses — use the expenses hook
    // but we only need the list, not filters
    const { expenses: recentExpenses, loading: expLoading } = useExpenses()

    const now = new Date()
    const monthName = getMonthName(now.getMonth() + 1)
    const year = now.getFullYear()

    // Greeting based on time of day
    const getGreeting = () => {
        const hour = now.getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 17) return 'Good afternoon'
        return 'Good evening'
    }

    return (
        <div className="page-animate">

            {/* ── Page Header ──────────────────────────────── */}
            <PageHeader
                title={`${getGreeting()} 👋`}
                subtitle={`${monthName} ${year} — Here's your financial overview`}
            />

            {/* ── Error state ───────────────────────────────── */}
            {error && (
                <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    {error}
                </div>
            )}

            {/* ── Row 1: Summary Cards ──────────────────────── */}
            <SummaryCards
                totalSpent={data?.summary.totalSpent || 0}
                expenseCount={data?.summary.expenseCount || 0}
                topCategory={data?.summary.topCategory || null}
                budgetAlerts={data?.summary.budgetAlerts || 0}
                month={data?.summary.month || now.getMonth() + 1}
                year={data?.summary.year || year}
                loading={loading}
            />

            {/* ── Row 2: Donut + Bar charts ─────────────────── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '16px',
            }}>

                <ChartCard
                    title="Spending by category"
                    subtitle={`${monthName} ${year} breakdown`}
                >
                    <DonutChart
                        data={data?.categorySummary || []}
                        loading={loading}
                    />
                </ChartCard>

                <ChartCard
                    title="Monthly spending trend"
                    subtitle="Last 6 months comparison"
                >
                    <BarChart
                        data={data?.monthlyTrend || []}
                        loading={loading}
                    />
                </ChartCard>

            </div>

            {/* ── Row 3: Area chart (full width) ────────────── */}
            <div style={{ marginBottom: '16px' }}>
                <ChartCard
                    title="Daily spending pattern"
                    subtitle={`Day-by-day breakdown — ${monthName} ${year}`}
                >
                    <AreaChart
                        data={data?.dailySpending || []}
                        loading={loading}
                    />
                </ChartCard>
            </div>

            {/* ── Row 4: Recent expenses + AI tip ───────────── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr',
                gap: '16px',
            }}>

                <ChartCard
                    title="Recent expenses"
                    subtitle="Your latest transactions"
                >
                    <RecentExpenses
                        expenses={recentExpenses}
                        loading={expLoading}
                    />
                </ChartCard>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <AiTipCard
                        totalSpent={data?.summary.totalSpent || 0}
                        topCategory={data?.categorySummary[0] || null}
                        loading={loading}
                    />

                    {/* Quick stats card */}
                    <div className="card" style={{ padding: '18px' }}>
                        <div style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: 'var(--ink-primary)',
                            marginBottom: '14px',
                        }}>
                            This month at a glance
                        </div>
                        {[
                            {
                                label: 'Categories used',
                                value: data?.categorySummary.length || 0,
                            },
                            {
                                label: 'Busiest category',
                                value: data?.categorySummary[0]
                                    ? `${data.categorySummary[0].icon} ${data.categorySummary[0].categoryName}`
                                    : '—',
                            },
                            {
                                label: 'Transactions',
                                value: data?.summary.expenseCount || 0,
                            },
                        ].map(stat => (
                            <div key={stat.label} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 0',
                                borderBottom: '1px solid var(--ink-border)',
                            }}>
                                <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                                    {stat.label}
                                </span>
                                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--ink-primary)' }}>
                                    {loading
                                        ? <span className="skeleton" style={{ display: 'inline-block', width: '60px', height: '13px' }} />
                                        : stat.value
                                    }
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}