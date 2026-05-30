// ============================================
// Budgets Page
// ============================================
// Lets users set monthly spending limits
// per category and track progress.
//
// Layout:
//   1. PageHeader with "Set budget" button
//   2. Month/Year filter
//   3. Alert banner (if any budgets over 80%)
//   4. Summary row (budgeted/spent/saved)
//   5. Budget cards grid
//   6. Empty state (if no budgets set)
// ============================================

'use client'

import { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import BudgetModal from '@/components/budgets/BudgetModal'
import BudgetCard from '@/components/budgets/BudgetCard'
import { useBudgets } from '@/hooks/useBudgets'
import { useToast } from '@/hooks/useToast'
import { Budget } from '@/types'
import { formatLKRCompact, getMonthName } from '@/lib/utils'

const MONTHS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: getMonthName(i + 1) }))
const currentYear = new Date().getFullYear()
const YEARS = [currentYear, currentYear + 1]

export default function BudgetsPage() {

    const {
        budgets, categories, loading, error,
        summary, filters, setFilters,
        createBudget, updateBudget, deleteBudget,
    } = useBudgets()

    // Modal state
    const [modalOpen, setModalOpen] = useState(false)
    const [editBudget, setEditBudget] = useState<Budget | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const { toasts, addToast } = useToast()

    const handleAddNew = () => {
        setEditBudget(null)
        setModalOpen(true)
    }

    const handleEdit = (budget: Budget) => {
        setEditBudget(budget)
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setEditBudget(null)
    }

    const handleSubmit = async (data: any) => {
        setSubmitting(true)
        try {
            if (editBudget) {
                await updateBudget(editBudget.id, data.amount)
                addToast('Budget updated successfully', 'success')
            } else {
                await createBudget(data)
                addToast('Budget set successfully', 'success')
            }
            handleCloseModal()
        } catch (err: any) {
            addToast(
                err.response?.data?.message || 'Something went wrong',
                'error'
            )
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
            'Delete this budget? Your expenses will not be affected.'
        )
        if (!confirmed) return

        try {
            await deleteBudget(id)
            addToast('Budget deleted', 'success')
        } catch {
            addToast('Failed to delete budget', 'error')
        }
    }

    // Total alerts count
    const totalAlerts = summary.alertCount + summary.dangerCount

    return (
        <div className="page-animate">

            {/* ── Page Header ──────────────────────────────── */}
            <PageHeader
                title="Budgets"
                subtitle={`Monthly spending limits — ${getMonthName(filters.month)} ${filters.year}`}
                action={
                    <Button variant="primary" size="md" onClick={handleAddNew}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Set budget
                    </Button>
                }
            />

            {/* ── Month/Year filter ─────────────────────────── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
            }}>
                <select
                    value={filters.month}
                    onChange={e => setFilters(prev => ({ ...prev, month: Number(e.target.value) }))}
                    className="form-input"
                    style={{ width: 'auto', minWidth: '130px' }}
                >
                    {MONTHS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>

                <select
                    value={filters.year}
                    onChange={e => setFilters(prev => ({ ...prev, year: Number(e.target.value) }))}
                    className="form-input"
                    style={{ width: 'auto', minWidth: '100px' }}
                >
                    {YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

                <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginLeft: '4px' }}>
                    {!loading && `${budgets.length} budget${budgets.length !== 1 ? 's' : ''} set`}
                </div>
            </div>

            {/* ── Alert banner ──────────────────────────────── */}
            {!loading && totalAlerts > 0 && (
                <div
                    className={`alert ${summary.dangerCount > 0 ? 'alert-danger' : 'alert-warning'}`}
                    style={{ marginBottom: '20px' }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <div>
                        <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                            {summary.dangerCount > 0
                                ? `${summary.dangerCount} budget${summary.dangerCount > 1 ? 's' : ''} exceeded this month`
                                : `${summary.alertCount} budget${summary.alertCount > 1 ? 's' : ''} approaching the limit`
                            }
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.85 }}>
                            Review your spending below and consider adjusting your budgets or reducing expenses.
                        </div>
                    </div>
                </div>
            )}

            {/* ── Summary row ───────────────────────────────── */}
            {!loading && budgets.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '14px',
                    marginBottom: '20px',
                }}>
                    {[
                        {
                            label: 'Total budgeted',
                            value: formatLKRCompact(summary.totalBudgeted),
                            icon: '🎯',
                            iconColor: 'var(--primary-500)',
                            sub: `${budgets.length} categories`,
                        },
                        {
                            label: 'Total spent',
                            value: formatLKRCompact(summary.totalSpent),
                            icon: '💸',
                            iconColor: summary.totalSpent > summary.totalBudgeted
                                ? 'var(--danger)'
                                : 'var(--warning)',
                            sub: `${Math.round((summary.totalSpent / summary.totalBudgeted) * 100) || 0}% of budget used`,
                        },
                        {
                            label: 'Remaining',
                            value: formatLKRCompact(Math.max(0, summary.totalSaved)),
                            icon: '💰',
                            iconColor: 'var(--success)',
                            sub: summary.totalSpent > summary.totalBudgeted
                                ? 'Over budget!'
                                : 'Still available',
                        },
                    ].map(card => (
                        <div key={card.label} className="card" style={{ padding: '16px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: `${card.iconColor}18`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                }}>
                                    {card.icon}
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {card.label}
                                </span>
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--ink-primary)', marginBottom: '4px' }}>
                                {card.value}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                                {card.sub}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Error state ───────────────────────────────── */}
            {error && (
                <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            {/* ── Loading skeleton ──────────────────────────── */}
            {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div className="skeleton" style={{ height: '14px', width: '120px', marginBottom: '6px' }} />
                                    <div className="skeleton" style={{ height: '12px', width: '80px' }} />
                                </div>
                                <div className="skeleton" style={{ height: '24px', width: '100px', borderRadius: '20px' }} />
                            </div>
                            <div className="skeleton" style={{ height: '6px', width: '100%', borderRadius: '999px', marginBottom: '12px' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                {[1, 2, 3].map(j => (
                                    <div className="skeleton" key={j} style={{ height: '32px', width: '80px', borderRadius: '6px' }} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Empty state ───────────────────────────────── */}
            {!loading && budgets.length === 0 && (
                <div className="card">
                    <div className="empty-state" style={{ padding: '60px 24px' }}>
                        <div className="empty-state-icon">🎯</div>
                        <div className="empty-state-title">No budgets set for this month</div>
                        <div className="empty-state-desc">
                            Set spending limits for each category to track where your money goes
                            and get alerts before you overspend.
                        </div>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleAddNew}
                            style={{ marginTop: '20px' }}
                        >
                            Set your first budget
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Budget cards ──────────────────────────────── */}
            {!loading && budgets.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {budgets.map(budget => (
                        <BudgetCard
                            key={budget.id}
                            budget={budget}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* ── Budget Modal ──────────────────────────────── */}
            <BudgetModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                categories={categories}
                budget={editBudget}
                loading={submitting}
                defaultMonth={filters.month}
                defaultYear={filters.year}
            />

            {/* ── Toast ─────────────────────────────────────── */}
            {toasts.map(t => {
                const toastType: 'success' | 'error' = t.type === 'success' ? 'success' : 'error'
                return (
                    <Toast
                        key={t.id}
                        message={t.message}
                        type={toastType}
                        visible={true}
                        onClose={() => {}}
                    />
                )
            })}

        </div>
    )
}