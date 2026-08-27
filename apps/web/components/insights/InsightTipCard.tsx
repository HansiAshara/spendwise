// ============================================
// InsightTipCard Component
// ============================================
// Displays one AI-generated saving tip.
//
// Visual design:
//   - Priority indicator (colored left border)
//   - Category badge
//   - Tip title and description
//   - Potential saving amount (green highlight)
//   - Animated entrance (staggered by index)
// ============================================

'use client'

import { formatLKR } from '@/lib/utils'

interface InsightTipCardProps {
    tip: {
        title: string
        description: string
        potentialSaving: number
        category: string
        priority: 'high' | 'medium' | 'low'
    }
    index: number  // for staggered animation delay
}

export default function InsightTipCard({ tip, index }: InsightTipCardProps) {

    // Priority configuration
    const priorityConfig = {
        high: {
            borderColor: 'var(--danger)',
            badgeBg: 'var(--danger-bg)',
            badgeColor: 'var(--danger-text)',
            label: 'High priority',
            icon: '🔴',
        },
        medium: {
            borderColor: 'var(--warning)',
            badgeBg: 'var(--warning-bg)',
            badgeColor: 'var(--warning-text)',
            label: 'Medium priority',
            icon: '🟡',
        },
        low: {
            borderColor: 'var(--success)',
            badgeBg: 'var(--success-bg)',
            badgeColor: 'var(--success-text)',
            label: 'Low priority',
            icon: '🟢',
        },
    }

    const priority = priorityConfig[tip.priority] || priorityConfig.medium

    return (
        <div
            style={{
                background: 'var(--card-bg)',
                borderRadius: '14px',
                border: '1px solid var(--ink-border)',
                borderLeft: `4px solid ${priority.borderColor}`,
                padding: '20px 22px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                // Staggered animation — each card enters slightly after previous
                animation: `fadeSlideIn 0.4s ease-out ${index * 0.1}s both`,
                transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
                e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
                e.currentTarget.style.transform = 'translateY(0)'
            }}
        >
            <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            {/* ── Top row: number + category + priority ───── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
                gap: '10px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                    {/* Tip number */}
                    <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: `${priority.borderColor}18`,
                        border: `1.5px solid ${priority.borderColor}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: priority.borderColor,
                        flexShrink: 0,
                    }}>
                        {index + 1}
                    </div>

                    {/* Category badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '500',
                        backgroundColor: 'var(--page-bg)',
                        border: '1px solid var(--ink-border)',
                        color: 'var(--ink-secondary)',
                    }}>
                        {tip.category}
                    </div>
                </div>

                {/* Priority badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '500',
                    backgroundColor: priority.badgeBg,
                    color: priority.badgeColor,
                    flexShrink: 0,
                }}>
                    {priority.icon} {priority.label}
                </div>
            </div>

            {/* ── Tip title ─────────────────────────────────── */}
            <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--ink-primary)',
                marginBottom: '8px',
                lineHeight: '1.3',
            }}>
                {tip.title}
            </h3>

            {/* ── Tip description ───────────────────────────── */}
            <p style={{
                fontSize: '13px',
                color: 'var(--ink-secondary)',
                lineHeight: '1.7',
                marginBottom: '16px',
            }}>
                {tip.description}
            </p>

            {/* ── Potential saving ──────────────────────────── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: 'var(--success-bg)',
                borderRadius: '10px',
                border: '1px solid rgba(16,185,129,0.2)',
            }}>
                {/* Savings icon */}
                <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'var(--success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    flexShrink: 0,
                }}>
                    💰
                </div>

                <div>
                    <div style={{
                        fontSize: '11px',
                        color: 'var(--success-text)',
                        fontWeight: '500',
                        marginBottom: '1px',
                    }}>
                        Potential monthly saving
                    </div>
                    <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: 'var(--success)',
                        fontVariantNumeric: 'tabular-nums',
                    }}>
                        {formatLKR(tip.potentialSaving)}
                    </div>
                </div>

                {/* Arrow icon */}
                <div style={{ marginLeft: 'auto' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round">
                        <path d="M23 6l-9.5 9.5-5-5L1 18" />
                        <path d="M17 6h6v6" />
                    </svg>
                </div>
            </div>

        </div>
    )
}