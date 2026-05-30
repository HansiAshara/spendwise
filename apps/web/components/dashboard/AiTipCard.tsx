// ============================================
// AiTipCard Component
// ============================================
// Shows a preview AI insight on dashboard.
// Encourages user to visit Insights page.
// ============================================

'use client'

import Link from 'next/link'
import { formatLKRCompact } from '@/lib/utils'

interface AiTipCardProps {
    totalSpent: number
    topCategory: { categoryName: string; spent: number; icon: string } | null
    loading: boolean
}

export default function AiTipCard({ totalSpent, topCategory, loading }: AiTipCardProps) {

    // Generate a simple contextual tip based on spending data
    // The real AI tips are on the Insights page
    const getTip = () => {
        if (!topCategory || totalSpent === 0) {
            return "Start logging your expenses to get personalised AI insights on your spending habits."
        }

        const topPct = ((topCategory.spent / totalSpent) * 100).toFixed(0)

        if (Number(topPct) > 50) {
            return `${topCategory.icon} ${topCategory.categoryName} is ${topPct}% of your spending this month — ${formatLKRCompact(topCategory.spent)} out of ${formatLKRCompact(totalSpent)}. Visit AI Insights for personalised saving tips.`
        }

        return `You've spent ${formatLKRCompact(totalSpent)} this month across multiple categories. Get personalised saving tips powered by Claude AI.`
    }

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #4338CA 60%, #6366F1 100%)',
            borderRadius: '12px',
            padding: '18px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
        }}>

            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
            }} />

            {/* AI badge */}
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '20px',
                padding: '3px 10px',
                fontSize: '10px',
                fontWeight: '600',
                marginBottom: '10px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
            }}>
                🤖 AI Insight
            </div>

            {/* Tip text */}
            <p style={{
                fontSize: '13px',
                lineHeight: '1.6',
                opacity: 0.92,
                margin: 0,
                marginBottom: '14px',
            }}>
                {loading
                    ? 'Analysing your spending patterns...'
                    : getTip()
                }
            </p>

            {/* CTA button */}
            <Link
                href="/insights"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    background: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.28)'
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.18)'
                }}
            >
                View all insights
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                </svg>
            </Link>
        </div>
    )
}