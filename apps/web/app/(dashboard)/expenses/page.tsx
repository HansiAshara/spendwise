// ============================================
// Expenses Page
// ============================================
// Main page for managing expenses.
//
// Layout:
//   1. PageHeader with "Log expense" button
//   2. Summary cards (total, count, avg, largest)
//   3. Filter bar (month/year + category)
//   4. Expense table
//   5. ExpenseModal (hidden until opened)
//
// State management:
//   - useExpenses hook handles all API calls
//   - Local state only for UI (modal open/close)
// ============================================

'use client'

import { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import ExpenseModal from '@/components/expenses/ExpenseModal'
import ExpenseTable from '@/components/expenses/ExpenseTable'
import { useExpenses } from '@/hooks/useExpenses'
import { useToast } from '@/hooks/useToast'
import { Expense } from '@/types'
import {
    formatLKR,
    formatLKRCompact,
    getMonthName,
} from '@/lib/utils'

// Month selector options
const MONTHS = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: getMonthName(i + 1),
}))

// Year selector — current year and 2 previous
const currentYear = new Date().getFullYear()
const YEARS = [currentYear, currentYear - 1, currentYear - 2]

export default function ExpensesPage() {
    // ── Expense data and actions from hook ─────────────
    const {
        expenses, categories, loading, error,
        summary, filters, setFilters,
        createExpense, updateExpense, deleteExpense,
    } = useExpenses()

    // ── Modal state ─────────────────────────────────────
    const [modalOpen, setModalOpen] = useState(false)
    const [editExpense, setEditExpense] = useState<Expense | null>(null)
    const [submitting, setSubmitting] = useState(false)

    // ── Toast notifications ─────────────────────────────
    const { toasts, addToast, removeToast, success, error: showError } = useToast()
    const currentToast = toasts[0] || null

    // ── Open modal for new expense ──────────────────────
    const handleAddNew = () => {
        setEditExpense(null)   // null = create mode
        setModalOpen(true)
    }

    // ── Open modal for editing ──────────────────────────
    const handleEdit = (expense: Expense) => {
        setEditExpense(expense) // expense = edit mode
        setModalOpen(true)
    }

    // ── Close modal ──────────────────────────────────────
    const handleCloseModal = () => {
        setModalOpen(false)
        setEditExpense(null)
    }

    // ── Handle form submit (create or update) ───────────
    const handleSubmit = async (data: any) => {
        setSubmitting(true)
        try {
            if (editExpense) {
                // Edit mode — update existing
                await updateExpense(editExpense.id, data)
                success('Expense updated successfully')
            } else {
                // Create mode — add new
                await createExpense(data)
                success('Expense logged successfully')
            }
            handleCloseModal()
        } catch (err: any) {
            showError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    // ── Handle delete ────────────────────────────────────
    const handleDelete = async (id: number) => {
        try {
            await deleteExpense(id)
            success('Expense deleted')
        } catch {
            showError('Failed to delete expense')
        }
    }

    return (
        <div className="page-animate">

            {/* ── Page Header ──────────────────────────────── */}
            <PageHeader
                title="Expenses"
                subtitle={`${summary.count} transaction${summary.count !== 1 ? 's' : ''} in ${getMonthName(filters.month)} ${filters.year}`}
                action={
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleAddNew}
                    >
                        {/* Plus icon */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Log expense
                    </Button>
                }
            />

            {/* ── Summary Cards ─────────────────────────────── */}
            <div className="metric-grid-responsive" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                marginBottom: '24px',
            }}>
                {/* Total spent */}
                <div className="metric-card">
                    <div className="metric-label">Total spent</div>
                    <div className="metric-value" style={{ fontSize: '20px' }}>
                        {loading
                            ? <div className="skeleton" style={{ height: '28px', width: '120px' }} />
                            : formatLKRCompact(summary.total)
                        }
                    </div>
                    <div className="metric-sub">
                        {getMonthName(filters.month)} {filters.year}
                    </div>
                </div>

                {/* Transactions */}
                <div className="metric-card">
                    <div className="metric-label">Transactions</div>
                    <div className="metric-value">
                        {loading
                            ? <div className="skeleton" style={{ height: '28px', width: '60px' }} />
                            : summary.count
                        }
                    </div>
                    <div className="metric-sub">This month</div>
                </div>

                {/* Daily average */}
                <div className="metric-card">
                    <div className="metric-label">Average / transaction</div>
                    <div className="metric-value" style={{ fontSize: '20px' }}>
                        {loading
                            ? <div className="skeleton" style={{ height: '28px', width: '100px' }} />
                            : formatLKRCompact(summary.average)
                        }
                    </div>
                    <div className="metric-sub">Per expense</div>
                </div>

                {/* Largest expense */}
                <div className="metric-card">
                    <div className="metric-label">Largest expense</div>
                    <div className="metric-value" style={{ fontSize: '20px' }}>
                        {loading
                            ? <div className="skeleton" style={{ height: '28px', width: '100px' }} />
                            : formatLKRCompact(summary.largest)
                        }
                    </div>
                    <div className="metric-sub">Single transaction</div>
                </div>
            </div>

            {/* ── Filter Bar ────────────────────────────────── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px',
                flexWrap: 'wrap',
            }}>

                {/* Month selector */}
                <select
                    value={filters.month}
                    onChange={e => setFilters(prev => ({
                        ...prev,
                        month: Number(e.target.value),
                    }))}
                    className="form-input"
                    style={{ width: 'auto', minWidth: '130px' }}
                >
                    {MONTHS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>

                {/* Year selector */}
                <select
                    value={filters.year}
                    onChange={e => setFilters(prev => ({
                        ...prev,
                        year: Number(e.target.value),
                    }))}
                    className="form-input"
                    style={{ width: 'auto', minWidth: '100px' }}
                >
                    {YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

                {/* Category filter */}
                <select
                    value={filters.categoryId || ''}
                    onChange={e => setFilters(prev => ({
                        ...prev,
                        categoryId: e.target.value ? Number(e.target.value) : undefined,
                    }))}
                    className="form-input"
                    style={{ width: 'auto', minWidth: '160px' }}
                >
                    <option value="">All categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                        </option>
                    ))}
                </select>

                {/* Clear filters button — only show if category filter active */}
                {filters.categoryId && (
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, categoryId: undefined }))}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid var(--ink-border)',
                            borderRadius: '8px',
                            background: 'white',
                            fontSize: '12px',
                            color: 'var(--ink-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        ✕ Clear filter
                    </button>
                )}

                {/* Result count on right */}
                <div style={{
                    marginLeft: 'auto',
                    fontSize: '12px',
                    color: 'var(--ink-muted)',
                    fontWeight: '500',
                }}>
                    {!loading && `${expenses.length} result${expenses.length !== 1 ? 's' : ''}`}
                </div>
            </div>

            {/* ── Error state ───────────────────────────────── */}
            {error && (
                <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    {error}
                </div>
            )}

            {/* ── Expense Table ─────────────────────────────── */}
            <ExpenseTable
                expenses={expenses}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* ── Expense Modal ─────────────────────────────── */}
            <ExpenseModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                categories={categories}
                expense={editExpense}
                loading={submitting}
            />

            {/* ── Toast Notification ────────────────────────── */}
            <Toast
                message={currentToast ? currentToast.message : ''}
                type={currentToast?.type === 'success' ? 'success' : 'error'}
                visible={!!currentToast}
                onClose={() => currentToast && removeToast(currentToast.id)}
            />

        </div>
    )
}