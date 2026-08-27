// ============================================
// ExpenseModal Component
// ============================================
// Modal form for logging a new expense or
// editing an existing one.
//
// Mode detection:
//   expense prop = null  → CREATE mode
//   expense prop = {...} → EDIT mode
//
// Uses react-hook-form + zod for validation.
// Calls onSubmit callback from parent (expenses page).
// ============================================

'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Category, Expense } from '@/types'
import { formatLKR } from '@/lib/utils'

// Validation schema
const expenseSchema = z.object({
    amount: z
        .string()
        .min(1, 'Amount is required')
        .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
            message: 'Amount must be a positive number',
        }),
    categoryId: z
        .string()
        .min(1, 'Please select a category'),
    date: z
        .string()
        .min(1, 'Date is required'),
    note: z
        .string()
        .max(255, 'Note is too long')
        .optional(),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => Promise<void>
    categories: Category[]
    expense?: Expense | null  // null = create, Expense = edit
    loading?: boolean
}

export default function ExpenseModal({
    isOpen,
    onClose,
    onSubmit,
    categories,
    expense = null,
    loading = false,
}: ExpenseModalProps) {

    const isEditMode = !!expense  // true if editing existing expense

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ExpenseFormData>({
        resolver: zodResolver(expenseSchema),
        // Pre-fill form when editing
        defaultValues: {
            amount: expense ? String(expense.amount) : '',
            categoryId: expense ? String(expense.categoryId) : '',
            date: expense
                ? new Date(expense.date).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0], // today as default
            note: expense?.note || '',
        },
    })

    // Reset form when modal opens/closes or expense changes
    useEffect(() => {
        if (isOpen) {
            reset({
                amount: expense ? String(expense.amount) : '',
                categoryId: expense ? String(expense.categoryId) : '',
                date: expense
                    ? new Date(expense.date).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0],
                note: expense?.note || '',
            })
        }
    }, [isOpen, expense, reset])

    // Handle form submission
    const handleFormSubmit = async (data: ExpenseFormData) => {
        await onSubmit({
            amount: Number(data.amount),
            categoryId: Number(data.categoryId),
            date: data.date,
            note: data.note || undefined,
        })
    }

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose()
    }

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-box">

                {/* ── Modal Header ──────────────────────────── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                }}>
                    <div>
                        <h2 style={{
                            fontSize: '17px', fontWeight: '600',
                            color: 'var(--ink-primary)', margin: 0,
                        }}>
                            {isEditMode ? 'Edit expense' : 'Log new expense'}
                        </h2>
                        <p style={{
                            fontSize: '12px', color: 'var(--ink-muted)',
                            margin: 0, marginTop: '3px',
                        }}>
                            {isEditMode
                                ? 'Update the expense details below'
                                : 'Fill in the details of your expense'}
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            width: '30px', height: '30px',
                            borderRadius: '50%',
                            border: '1px solid var(--ink-border)',
                            background: 'var(--card-bg)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'var(--ink-muted)',
                            fontSize: '16px', lineHeight: 1,
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* ── Form ──────────────────────────────────── */}
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Amount field */}
                        <div>
                            <label className="form-label">Amount (LKR)</label>
                            <div style={{ position: 'relative' }}>
                                {/* LKR prefix */}
                                <div style={{
                                    position: 'absolute', left: '12px',
                                    top: '50%', transform: 'translateY(-50%)',
                                    fontSize: '12px', fontWeight: '500',
                                    color: 'var(--ink-muted)',
                                    pointerEvents: 'none',
                                }}>
                                    LKR
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className={`form-input ${errors.amount ? 'error' : ''}`}
                                    style={{ paddingLeft: '44px' }}
                                    {...register('amount')}
                                />
                            </div>
                            {errors.amount && (
                                <span className="form-error">{errors.amount.message}</span>
                            )}
                        </div>

                        {/* Category dropdown */}
                        <div>
                            <label className="form-label">Category</label>
                            <select
                                className={`form-input ${errors.categoryId ? 'error' : ''}`}
                                {...register('categoryId')}
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <span className="form-error">{errors.categoryId.message}</span>
                            )}
                        </div>

                        {/* Date picker */}
                        <Input
                            label="Date"
                            type="date"
                            error={errors.date?.message}
                            {...register('date')}
                        />

                        {/* Note (optional) */}
                        <div>
                            <label className="form-label">
                                Note
                                <span style={{
                                    fontSize: '11px',
                                    color: 'var(--ink-faint)',
                                    fontWeight: '400',
                                    marginLeft: '6px',
                                }}>
                                    optional
                                </span>
                            </label>
                            <textarea
                                placeholder="e.g. Lunch at university canteen"
                                rows={2}
                                className="form-input"
                                style={{ resize: 'none', lineHeight: '1.5' }}
                                {...register('note')}
                            />
                            {errors.note && (
                                <span className="form-error">{errors.note.message}</span>
                            )}
                        </div>

                    </div>

                    {/* ── Action Buttons ─────────────────────── */}
                    <div style={{
                        display: 'flex', gap: '10px',
                        marginTop: '24px',
                        paddingTop: '20px',
                        borderTop: '1px solid var(--ink-border)',
                    }}>
                        <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={onClose}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            loading={loading}
                            style={{ flex: 2 }}
                        >
                            {isEditMode ? 'Save changes' : 'Log expense'}
                        </Button>
                    </div>
                </form>

            </div>
        </div>
    )
}