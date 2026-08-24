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
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const handleDelete = async (id: number) => {
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
            <div className="table-container" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr className="table-head-row">
                            <th className="table-th" style={{ width: '35%' }}>Description</th>
                            <th className="table-th" style={{ width: '20%' }}>Category</th>
                            <th className="table-th" style={{ width: '15%' }}>Date</th>
                            <th className="table-th" style={{ width: '18%', textAlign: 'right' }}>Amount</th>
                            <th className="table-th" style={{ width: '12%', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map(i => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--ink-border)' }}>
                                {[200, 100, 80, 80, 60].map((w, j) => (
                                    <td key={j} style={{ padding: '12px 16px' }}>
                                        <div
                                            className="skeleton"
                                            style={{ height: '14px', width: `${w}px`, maxWidth: '100%' }}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
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
        <div className="table-container" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr className="table-head-row">
                        <th className="table-th" style={{ width: '35%' }}>Description</th>
                        <th className="table-th" style={{ width: '20%' }}>Category</th>
                        <th className="table-th" style={{ width: '15%' }}>Date</th>
                        <th className="table-th" style={{ width: '18%', textAlign: 'right' }}>Amount</th>
                        <th className="table-th" style={{ width: '12%', textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense.id} className="table-row">
                            {/* Description column */}
                            <td className="table-td-bold" style={{ width: '35%' }}>
                                <div>{truncate(expense.note || 'No description', 45)}</div>
                                <div style={{
                                    fontSize: '11px',
                                    color: 'var(--ink-muted)',
                                    marginTop: '2px',
                                }}>
                                    #{expense.id}
                                </div>
                            </td>

                            {/* Category column */}
                            <td className="table-td" style={{ width: '20%' }}>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '3px 8px',
                                    borderRadius: '20px',
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
                            </td>

                            {/* Date column */}
                            <td className="table-td" style={{ width: '15%' }}>
                                {formatDate(expense.date)}
                            </td>

                            {/* Amount column */}
                            <td className="table-td" style={{
                                width: '18%',
                                textAlign: 'right',
                                fontWeight: '600',
                                color: 'var(--ink-primary)',
                                fontVariantNumeric: 'tabular-nums',
                            }}>
                                {formatLKR(Number(expense.amount))}
                            </td>

                            {/* Actions column */}
                            <td className="table-td" style={{
                                width: '12%',
                                textAlign: 'center',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '6px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
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
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr style={{
                        borderTop: '2px solid var(--ink-border)',
                        backgroundColor: 'var(--page-bg)',
                    }}>
                        <td className="table-td" style={{ fontSize: '12px', fontWeight: '500', color: 'var(--ink-muted)' }}>
                            {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
                        </td>
                        <td className="table-td" />
                        <td className="table-td" />
                        <td className="table-td" style={{
                            textAlign: 'right',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'var(--ink-primary)',
                        }}>
                            {formatLKR(expenses.reduce((sum, e) => sum + Number(e.amount), 0))}
                        </td>
                        <td className="table-td" />
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}