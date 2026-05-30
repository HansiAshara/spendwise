// ============================================
// BudgetCard Component
// ============================================
// Shows one budget with progress bar and status.
//
// Visual states:
//   safe    → green progress bar, "On track" badge
//   warning → yellow progress bar, "Getting close" badge
//   danger  → red progress bar, "Over budget" badge
//
// The percentage can exceed 100% if user overspends.
// Progress bar caps at 100% visually but we show
// the real percentage in the badge.
// ============================================

'use client'

import { Budget } from '@/types'
import { formatLKR, formatLKRCompact, getCategoryBgColor } from '@/lib/utils'

interface BudgetCardProps {
    budget: Budget
    onEdit: (budget: Budget) => void
    onDelete: (id: number) => void
}

export default function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {

    // Cap progress bar at 100% visually
    // but show real percentage in text
    const barWidth = Math.min(budget.percentage, 100)
    const isOver = budget.percentage > 100
    const overAmount = Number(budget.spent) - Number(budget.amount)

    // Colors based on alert status
    const statusConfig = {
        safe: {
            barColor: 'var(--success)',
            badgeBg: 'var(--success-bg)',
            badgeColor: 'var(--success-text)',
            label: 'On track',
            icon: '✓',
        },
        warning: {
            barColor: 'var(--warning)',
            badgeBg: 'var(--warning-bg)',
            badgeColor: 'var(--warning-text)',
            label: 'Getting close',
            icon: '⚠',
        },
        danger: {
            barColor: 'var(--danger)',
            badgeBg: 'var(--danger-bg)',
            badgeColor: 'var(--danger-text)',
            label: isOver ? 'Over budget' : 'At limit',
            icon: '!',
        },
    }

    const status = statusConfig[budget.alertStatus]

    return (
        <div
            className="card"
            style={{
                padding: '18px 20px',
                transition: 'box-shadow 0.2s',
                // Subtle left border color based on status
                borderLeft: `3px solid ${status.barColor}`,
            }}
        >

            {/* ── Top row: category + badge + actions ──────── */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '14px',
                gap: '12px',
            }}>

                {/* Category icon + name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: getCategoryBgColor(budget.category.color),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        flexShrink: 0,
                    }}>
                        {budget.category.icon}
                    </div>
                    <div>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'var(--ink-primary)',
                        }}>
                            {budget.category.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '1px' }}>
                            Budget: {formatLKR(Number(budget.amount))}
                        </div>
                    </div>
                </div>

                {/* Right side: badge + action buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

                    {/* Status badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: status.badgeBg,
                        color: status.badgeColor,
                    }}>
                        {status.icon} {budget.percentage}% — {status.label}
                    </div>

                    {/* Edit button */}
                    <button
                        className="action-btn"
                        onClick={() => onEdit(budget)}
                        title="Edit budget"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>

                    {/* Delete button */}
                    <button
                        className="action-btn danger"
                        onClick={() => onDelete(budget.id)}
                        title="Delete budget"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ── Progress bar ──────────────────────────────── */}
            <div style={{ marginBottom: '12px' }}>
                <div className="progress-track">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${barWidth}%`,
                            backgroundColor: status.barColor,
                            // Smooth animation when percentage changes
                            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    />
                </div>
            </div>

            {/* ── Bottom row: spent / remaining / over ──────── */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>

                {/* Spent amount */}
                <div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '2px' }}>
                        Spent
                    </div>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--ink-primary)',
                        fontVariantNumeric: 'tabular-nums',
                    }}>
                        {formatLKRCompact(Number(budget.spent))}
                    </div>
                </div>

                {/* Visual divider */}
                <div style={{
                    height: '28px',
                    width: '1px',
                    backgroundColor: 'var(--ink-border)',
                }} />

                {/* Budget limit */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '2px' }}>
                        Budget
                    </div>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--ink-secondary)',
                        fontVariantNumeric: 'tabular-nums',
                    }}>
                        {formatLKRCompact(Number(budget.amount))}
                    </div>
                </div>

                <div style={{ height: '28px', width: '1px', backgroundColor: 'var(--ink-border)' }} />

                {/* Remaining or Over */}
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '2px' }}>
                        {isOver ? 'Over by' : 'Remaining'}
                    </div>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: isOver ? 'var(--danger)' : 'var(--success)',
                        fontVariantNumeric: 'tabular-nums',
                    }}>
                        {isOver
                            ? formatLKRCompact(overAmount)
                            : formatLKRCompact(Number(budget.remaining))
                        }
                    </div>
                </div>

            </div>

        </div>
    )
}