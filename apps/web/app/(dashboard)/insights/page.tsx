// ============================================
// AI Insights Page
// ============================================
// Displays AI-generated spending insights.
//
// Layout:
//   State 1: Initial — prompt to generate
//   State 2: Loading — animated skeleton
//   State 3: No data — add expenses first
//   State 4: Generated — banner + tip cards
//            + total potential savings
// ============================================

'use client'

import { useInsights } from '@/hooks/useInsights'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import InsightTipCard from '@/components/insights/InsightTipCard'
import InsightSummaryBanner from '@/components/insights/InsightSummaryBanner'
import { formatLKR } from '@/lib/utils'

// ── Loading skeleton ───────────────────────────────
function InsightsSkeleton() {
    return (
        <div>
            {/* Banner skeleton */}
            <div style={{
                background: 'linear-gradient(135deg, #1e1b4b, #4338CA)',
                borderRadius: '16px',
                padding: '28px 32px',
                marginBottom: '24px',
            }}>
                <div className="skeleton" style={{ height: '20px', width: '160px', marginBottom: '16px', opacity: 0.3 }} />
                <div className="skeleton" style={{ height: '16px', width: '80%', marginBottom: '8px', opacity: 0.3 }} />
                <div className="skeleton" style={{ height: '16px', width: '60%', marginBottom: '24px', opacity: 0.3 }} />
                <div style={{ display: 'flex', gap: '12px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton" style={{ height: '72px', width: '130px', borderRadius: '12px', opacity: 0.3 }} />
                    ))}
                </div>
            </div>

            {/* Tip card skeletons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} className="card" style={{ padding: '20px 22px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <div className="skeleton" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                                <div className="skeleton" style={{ width: '80px', height: '22px', borderRadius: '20px' }} />
                            </div>
                            <div className="skeleton" style={{ width: '110px', height: '22px', borderRadius: '20px' }} />
                        </div>
                        <div className="skeleton" style={{ height: '18px', width: '70%', marginBottom: '10px' }} />
                        <div className="skeleton" style={{ height: '13px', width: '100%', marginBottom: '6px' }} />
                        <div className="skeleton" style={{ height: '13px', width: '85%', marginBottom: '16px' }} />
                        <div className="skeleton" style={{ height: '52px', borderRadius: '10px' }} />
                    </div>
                ))}
            </div>

            {/* Loading message */}
            <div style={{
                textAlign: 'center',
                marginTop: '24px',
                fontSize: '13px',
                color: 'var(--ink-muted)',
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: 'var(--primary-50)',
                    borderRadius: '20px',
                    color: 'var(--primary-500)',
                    fontWeight: '500',
                }}>
                    {/* Spinner */}
                    <svg
                        style={{ animation: 'spin 1s linear infinite' }}
                        width="14" height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    Claude is analysing your spending patterns...
                </div>
            </div>
        </div>
    )
}

export default function InsightsPage() {
    const {
        data,
        loading,
        error,
        generated,
        generatedAt,
        generateInsights,
    } = useInsights()

    // Calculate total potential savings
    const totalPotentialSaving = data?.tips.reduce(
        (sum, tip) => sum + tip.potentialSaving, 0
    ) || 0

    return (
        <div className="page-animate">

            {/* ── Page Header ──────────────────────────────── */}
            <PageHeader
                title="AI Insights"
                subtitle="Personalised saving tips powered by Gemini AI"
                action={
                    <Button
                        variant={generated ? 'outline' : 'primary'}
                        size="md"
                        onClick={generateInsights}
                        loading={loading}
                        disabled={loading}
                    >
                        {/* AI sparkle icon */}
                        {!loading && (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
                            </svg>
                        )}
                        {loading
                            ? 'Analysing...'
                            : generated
                                ? 'Regenerate insights'
                                : 'Generate insights'
                        }
                    </Button>
                }
            />

            {/* ── Loading state ─────────────────────────────── */}
            {loading && <InsightsSkeleton />}

            {/* ── Error state ───────────────────────────────── */}
            {!loading && error && (
                <div style={{ marginBottom: '20px' }}>
                    <div className="alert alert-danger">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        <div>
                            <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                                Failed to generate insights
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.85 }}>
                                {error}
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        size="md"
                        onClick={generateInsights}
                        style={{ marginTop: '12px' }}
                    >
                        Try again
                    </Button>
                </div>
            )}

            {/* ── Initial state — not generated yet ─────────── */}
            {!loading && !error && !generated && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px',
                    textAlign: 'center',
                }}>

                    {/* Hero illustration */}
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '44px',
                        marginBottom: '24px',
                        boxShadow: '0 8px 32px rgba(99,102,241,0.15)',
                    }}>
                        🤖
                    </div>

                    <h2 style={{
                        fontSize: '22px',
                        fontWeight: '600',
                        color: 'var(--ink-primary)',
                        marginBottom: '12px',
                        letterSpacing: '-0.4px',
                    }}>
                        Get personalised AI insights
                    </h2>

                    <p style={{
                        fontSize: '14px',
                        color: 'var(--ink-muted)',
                        lineHeight: '1.7',
                        maxWidth: '420px',
                        marginBottom: '32px',
                    }}>
                        Our AI analyses your last 30 days of spending and gives you
                        3 specific, actionable tips to save money — in LKR,
                        tailored for Sri Lankan students.
                    </p>

                    {/* Feature pills */}
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        marginBottom: '32px',
                    }}>
                        {[
                            '📊 Based on your real data',
                            '🇱🇰 LKR amounts',
                            '⚡ Results in seconds',
                            '🔒 Private and secure',
                        ].map(pill => (
                            <div key={pill} style={{
                                padding: '6px 14px',
                                background: 'var(--page-bg)',
                                border: '1px solid var(--ink-border)',
                                borderRadius: '20px',
                                fontSize: '12px',
                                color: 'var(--ink-secondary)',
                                fontWeight: '500',
                            }}>
                                {pill}
                            </div>
                        ))}
                    </div>

                    <Button
                        variant="primary"
                        size="lg"
                        onClick={generateInsights}
                        loading={loading}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
                        </svg>
                        Generate my insights
                    </Button>
                </div>
            )}

            {/* ── No expense data ───────────────────────────── */}
            {!loading && !error && generated && data?.dataPoints === 0 && (
                <div className="card">
                    <div className="empty-state" style={{ padding: '60px 24px' }}>
                        <div className="empty-state-icon">📊</div>
                        <div className="empty-state-title">No expense data found</div>
                        <div className="empty-state-desc">
                            Log at least a few expenses in the last 30 days
                            to get personalised AI insights on your spending patterns.
                        </div>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => window.location.href = '/expenses'}
                            style={{ marginTop: '20px' }}
                        >
                            Go to Expenses
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Generated insights ────────────────────────── */}
            {!loading && !error && generated && data && data.dataPoints > 0 && (
                <div>

                    {/* Summary banner */}
                    <InsightSummaryBanner
                        summary={data.summary}
                        totalSpent={data.totalSpent}
                        dataPoints={data.dataPoints}
                        categoryBreakdown={data.categoryBreakdown}
                        generatedAt={generatedAt}
                    />

                    {/* Section header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                    }}>
                        <div>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: 'var(--ink-primary)',
                                margin: 0,
                            }}>
                                Your personalised tips
                            </h3>
                            <p style={{
                                fontSize: '12px',
                                color: 'var(--ink-muted)',
                                margin: 0,
                                marginTop: '3px',
                            }}>
                                {data.tips.length} actionable suggestions based on your spending
                            </p>
                        </div>

                        {/* Total savings highlight */}
                        <div style={{
                            padding: '10px 16px',
                            background: 'var(--success-bg)',
                            border: '1px solid rgba(16,185,129,0.25)',
                            borderRadius: '12px',
                            textAlign: 'right',
                        }}>
                            <div style={{ fontSize: '11px', color: 'var(--success-text)', fontWeight: '500', marginBottom: '2px' }}>
                                Total potential saving
                            </div>
                            <div style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                color: 'var(--success)',
                                fontVariantNumeric: 'tabular-nums',
                            }}>
                                {formatLKR(totalPotentialSaving)}/mo
                            </div>
                        </div>
                    </div>

                    {/* Tip cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {data.tips.map((tip, index) => (
                            <InsightTipCard
                                key={index}
                                tip={tip}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* Bottom note */}
                    <div style={{
                        marginTop: '24px',
                        padding: '14px 18px',
                        background: 'var(--page-bg)',
                        borderRadius: '12px',
                        border: '1px solid var(--ink-border)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                    }}>
                        <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
                        <p style={{
                            fontSize: '12px',
                            color: 'var(--ink-muted)',
                            lineHeight: '1.6',
                            margin: 0,
                        }}>
                            These insights are generated by Gemini AI based on your last 30 days of spending.
                            Results improve as you log more expenses. Regenerate anytime to get fresh tips
                            based on your latest data.
                        </p>
                    </div>

                </div>
            )}

        </div>
    )
}