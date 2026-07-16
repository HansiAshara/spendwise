// ============================================
// InsightSummaryBanner Component
// ============================================
// Hero banner at top of insights page.
// Shows AI summary + spending stats.
// Displays BEFORE tips cards.
// ============================================

'use client'

import { formatLKR, formatLKRCompact } from '@/lib/utils'

interface InsightSummaryBannerProps {
    summary: string
    totalSpent: number
    dataPoints: number
    categoryBreakdown: {
        [key: string]: { total: number; count: number; icon: string }
    }
    generatedAt: Date | null
}

export default function InsightSummaryBanner({
    summary,
    totalSpent,
    dataPoints,
    categoryBreakdown,
    generatedAt,
}: InsightSummaryBannerProps) {

    // Get top category
    const topCategory = Object.entries(categoryBreakdown)
        .sort(([, a], [, b]) => b.total - a.total)[0]

    // Format generated time
    const timeStr = generatedAt
        ? generatedAt.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })
        : ''

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338CA 75%, #6366F1 100%)',
            borderRadius: '16px',
            padding: '28px 32px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
        }}>

            {/* Background decorations */}
            <div style={{
                position: 'absolute', top: '-60px', right: '-60px',
                width: '200px', height: '200px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
            }} />
            <div style={{
                position: 'absolute', bottom: '-40px', left: '30%',
                width: '150px', height: '150px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.03)',
            }} />

            {/* Content */}
            <div style={{ position: 'relative' }}>

                {/* Top row — AI badge + generated time */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    flexWrap: 'wrap',
                    gap: '8px',
                }}>
                    {/* AI badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: 'white',
                        letterSpacing: '0.05em',
                    }}>
                        <span style={{ fontSize: '14px' }}>🤖</span>
                        AI-POWERED ANALYSIS
                    </div>

                    {/* Generated time */}
                    {timeStr && (
                        <div style={{
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                        }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            Generated at {timeStr}
                        </div>
                    )}
                </div>

                {/* Summary text */}
                <p style={{
                    fontSize: '15px',
                    fontWeight: '400',
                    color: 'rgba(255,255,255,0.92)',
                    lineHeight: '1.7',
                    marginBottom: '24px',
                    maxWidth: '700px',
                }}>
                    {summary}
                </p>

                {/* Stats row */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                }}>
                    {/* Total analysed */}
                    <div style={{
                        padding: '12px 18px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(4px)',
                    }}>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginBottom: '4px' }}>
                            Total analysed
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
                            {formatLKRCompact(totalSpent)}
                        </div>
                    </div>

                    {/* Transactions */}
                    <div style={{
                        padding: '12px 18px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                    }}>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginBottom: '4px' }}>
                            Transactions
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
                            {dataPoints}
                        </div>
                    </div>

                    {/* Top category */}
                    {topCategory && (
                        <div style={{
                            padding: '12px 18px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '12px',
                        }}>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginBottom: '4px' }}>
                                Top category
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
                                {topCategory[1].icon} {topCategory[0]}
                            </div>
                        </div>
                    )}

                    {/* Period */}
                    <div style={{
                        padding: '12px 18px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                    }}>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginBottom: '4px' }}>
                            Period
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
                            Last 30 days
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}