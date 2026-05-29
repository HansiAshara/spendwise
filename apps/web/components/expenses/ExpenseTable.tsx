// ============================================
// ExpenseTable Component
// ============================================
// Displays expenses in a clean table with:
//   - Category icon + badge
//   - Amount in LKR
//   - Date formatted nicely
//   - Note (truncated if long)
//   - Edit and Delete action buttons
//
// Also handles empty state and loading skeleton.
// ============================================

'use client'

import { useState } from 'react'
import { Expense } from '@/types'
import { formatLKR, formatDate, truncate, getCategoryBgColor } from '@/lib/utils'
import Button from '@/components/ui/Button'

interface ExpenseTableProps {
    expenses: Expense[]
    loading: boolean
    onEdit: (expense: Expense) => void
    onDelete: (id: number) => Promise<void>
}

export default function ExpenseTable({
    expenses,
    loading,
    onEdit,
    onDelete,
}: ExpenseTableProps) {

    // Track which expense is being deleted
    // So we can show loading only on that row's button
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const handleDelete = async (id: number) => {
        // Confirm before deleting — important UX pattern
        const confirmed = window.confirm(
            'Are you sure you want to delete this expense? This cannot be undone.'
        )
        if (!confirmed) return

        setDeletingId(id)
        try {
            await onDelete(id)
        } finally {
            setDeletingId(null)
        }
    }

    // ── Loading skeleton ───────────────────────────────
    if (loading) {
        return (
            <div className="table-container">
                {/* Table header */}
                <div className="table-head-row">
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px' }}>
                        {['Description', 'Category', 'Date', 'Amount', 'Actions'].map(h => (
                            <div key={h} className="table-th">{h}</div>
                        ))}
                    </div>
                </div>
                {/* Skeleton rows */}
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
                        borderBottom: '1px solid var(--ink-border)',
                        padding: '12px 0',
                    }}>
                        {[200, 100, 80, 80, 60].map((w, j) => (
                            <div key={j} style={{ padding: '0 16px' }}>
                                <div
                                    className="skeleton"
                                    style={{ height: '14px', width: `${w}px`, maxWidth: '100%' }}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        )
    }

    // ── Empty state ────────────────────────────────────
    if (expenses.length === 0) {
        return (
            <div className="table-container">
                <div className="empty-state" style={{ padding: '60px 24px' }}>
                    <div className="empty-state-icon">🧾</div>
                    <div className="empty-state-title">No expenses found</div>
                    <div className="empty-state-desc">
                        No expenses match your current filters.
                        Try changing the month or category filter,
                        or log your first expense using the button above.
                    </div>
                </div>
            </div>
        )
    }

    // ── Expense table ──────────────────────────────────
    return (
        <div className="table-container">
            {/* Table header row */}
            <div className="table-head-row">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
                }}>
                    <div className="table-th">Description</div>
                    <div className="table-th">Category</div>
                    <div className="table-th">Date</div>
                    <div className="table-th" style={{ textAlign: 'right' }}>Amount</div>
                    <div className="table-th" style={{ textAlign: 'center' }}>Actions</div>
                </div>
            </div>

            {/* Expense rows */}
            {expenses.map((expense) => (
                <div key={expense.id} className="table-row">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
                        alignItems: 'center',
                    }}>

                        {/* Description column */}
                        <div className="table-td-bold">
                            <div>{truncate(expense.note || 'No description', 45)}</div>
                            {/* Show LKR amount on mobile as subtitle */}
                            <div style={{
                                fontSize: '11px',
                                color: 'var(--ink-muted)',
                                marginTop: '2px',
                            }}>
                                #{expense.id}
                            </div>
                        </div>

                        {/* Category column */}
                        <div className="table-td">
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '3px 8px',
                                borderRadius: '20px',
                                // Use category color with low opacity as background
                                backgroundColor: getCategoryBgColor(expense.category.color),
                            }}>
                                <span style={{ fontSize: '13px' }}>{expense.category.icon}</span>
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: '500',
                                    color: expense.category.color,
                                }}>
                                    {expense.category.name}
                                </span>
                            </div>
                        </div>

                        {/* Date column */}
                        <div className="table-td">
                            {formatDate(expense.date)}
                        </div>

                        {/* Amount column */}
                        <div className="table-td" style={{
                            textAlign: 'right',
                            fontWeight: '600',
                            color: 'var(--ink-primary)',
                            fontVariantNumeric: 'tabular-nums',
                        }}>
                            {formatLKR(Number(expense.amount))}
                        </div>

                        {/* Actions column */}
                        <div className="table-td" style={{
                            display: 'flex',
                            gap: '6px',
                            justifyContent: 'center',
                        }}>
                            {/* Edit button */}
                            <button
                                className="action-btn"
                                onClick={() => onEdit(expense)}
                                title="Edit expense"
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </button>

                            {/* Delete button */}
                            <button
                                className="action-btn danger"
                                onClick={() => handleDelete(expense.id)}
                                disabled={deletingId === expense.id}
                                title="Delete expense"
                                style={{
                                    opacity: deletingId === expense.id ? 0.5 : 1,
                                }}
                            >
                                {deletingId === expense.id ? (
                                    <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                                    </svg>
                                ) : (
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                        <path d="M10 11v6M14 11v6" />
                                        <path d="M9 6V4h6v2" />
                                    </svg>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            ))}

            {/* Table footer — total */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
                padding: '12px 0',
                borderTop: '2px solid var(--ink-border)',
                backgroundColor: 'var(--page-bg)',
            }}>
                <div style={{ padding: '0 16px', fontSize: '12px', fontWeight: '500', color: 'var(--ink-muted)' }}>
                    {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
                </div>
                <div /><div />
                <div style={{
                    padding: '0 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--ink-primary)',
                }}>
                    {formatLKR(expenses.reduce((sum, e) => sum + Number(e.amount), 0))}
                </div>
                <div />
            </div>
        </div>
    )
}