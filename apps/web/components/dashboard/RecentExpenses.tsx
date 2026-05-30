// ============================================
// RecentExpenses Component
// ============================================
// Shows last 5 expenses on dashboard.
// Quick overview without going to expenses page.
// ============================================

'use client'

import Link from 'next/link'
import { Expense } from '@/types'
import { formatLKR, formatDateRelative, getCategoryBgColor } from '@/lib/utils'

interface RecentExpensesProps {
    expenses: Expense[]
    loading: boolean
}

export default function RecentExpenses({ expenses, loading }: RecentExpensesProps) {

    if (loading) {
        return (
            <div>
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 0',
                        borderBottom: '1px solid var(--ink-border)',
                    }}>
                        <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <div className="skeleton" style={{ height: '13px', width: '60%', marginBottom: '6px' }} />
                            <div className="skeleton" style={{ height: '11px', width: '40%' }} />
                        </div>
                        <div className="skeleton" style={{ height: '13px', width: '70px' }} />
                    </div>
                ))}
            </div>
        )
    }

    if (expenses.length === 0) {
        return (
            <div className="empty-state" style={{ padding: '24px 0' }}>
                <div className="empty-state-icon" style={{ fontSize: '32px' }}>🧾</div>
                <div className="empty-state-title" style={{ fontSize: '13px' }}>No recent expenses</div>
                <div className="empty-state-desc" style={{ fontSize: '12px' }}>
                    Go to Expenses to log your first one
                </div>
            </div>
        )
    }

    return (
        <div>
            {expenses.slice(0, 5).map((expense, idx) => (
                <div
                    key={expense.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 0',
                        borderBottom: idx < Math.min(expenses.length, 5) - 1
                            ? '1px solid var(--ink-border)'
                            : 'none',
                    }}
                >
                    {/* Category icon circle */}
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: getCategoryBgColor(expense.category.color),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '17px',
                        flexShrink: 0,
                    }}>
                        {expense.category.icon}
                    </div>

                    {/* Description and date */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontSize: '13px',
                            fontWeight: '500',
                            color: 'var(--ink-primary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {expense.note || expense.category.name}
                        </div>
                        <div style={{
                            fontSize: '11px',
                            color: 'var(--ink-muted)',
                            marginTop: '2px',
                        }}>
                            {formatDateRelative(expense.date)}
                        </div>
                    </div>

                    {/* Amount */}
                    <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'var(--ink-primary)',
                        fontVariantNumeric: 'tabular-nums',
                        flexShrink: 0,
                    }}>
                        {formatLKR(Number(expense.amount))}
                    </div>
                </div>
            ))}

            {/* Link to full expenses page */}
            <Link
                href="/expenses"
                style={{
                    display: 'block',
                    textAlign: 'center',
                    marginTop: '14px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--primary-500)',
                    textDecoration: 'none',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'background 0.15s',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--primary-50)'
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                }}
            >
                View all expenses →
            </Link>
        </div>
    )
}