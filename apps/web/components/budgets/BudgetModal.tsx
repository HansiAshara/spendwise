// ============================================
// BudgetModal Component
// ============================================
// Form modal for setting or editing a budget.
//
// Create mode: user picks category + amount + month
// Edit mode:   user can only change the amount
//             (category/month/year stay the same)
// ============================================

'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Budget, Category } from '@/types'
import { getMonthName, formatLKR } from '@/lib/utils'

const budgetSchema = z.object({
    amount: z
        .string()
        .min(1, 'Budget amount is required')
        .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
            message: 'Amount must be a positive number',
        }),
    categoryId: z
        .string()
        .min(1, 'Please select a category'),
    month: z
        .string()
        .min(1, 'Month is required'),
    year: z
        .string()
        .min(1, 'Year is required'),
})

type BudgetFormData = z.infer<typeof budgetSchema>

// Month options
const MONTHS = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: getMonthName(i + 1),
}))

const currentYear = new Date().getFullYear()
const YEARS = [currentYear, currentYear + 1]

interface BudgetModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => Promise<void>
    categories: Category[]
    budget?: Budget | null
    loading?: boolean
    // Pre-fill month/year from page filter
    defaultMonth: number
    defaultYear: number
}

export default function BudgetModal({
    isOpen,
    onClose,
    onSubmit,
    categories,
    budget = null,
    loading = false,
    defaultMonth,
    defaultYear,
}: BudgetModalProps) {

    const isEditMode = !!budget

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<BudgetFormData>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            amount: budget ? String(budget.amount) : '',
            categoryId: budget ? String(budget.categoryId) : '',
            month: String(budget?.month || defaultMonth),
            year: String(budget?.year || defaultYear),
        },
    })

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            reset({
                amount: budget ? String(budget.amount) : '',
                categoryId: budget ? String(budget.categoryId) : '',
                month: String(budget?.month || defaultMonth),
                year: String(budget?.year || defaultYear),
            })
        }
    }, [isOpen, budget, defaultMonth, defaultYear, reset])

    const watchAmount = watch('amount')

    const handleFormSubmit = async (data: BudgetFormData) => {
        await onSubmit({
            amount: Number(data.amount),
            categoryId: Number(data.categoryId),
            month: Number(data.month),
            year: Number(data.year),
        })
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose()
    }

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-box">

                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                }}>
                    <div>
                        <h2 style={{
                            fontSize: '17px',
                            fontWeight: '600',
                            color: 'var(--ink-primary)',
                            margin: 0,
                        }}>
                            {isEditMode ? 'Edit budget' : 'Set budget'}
                        </h2>
                        <p style={{
                            fontSize: '12px',
                            color: 'var(--ink-muted)',
                            margin: 0,
                            marginTop: '3px',
                        }}>
                            {isEditMode
                                ? `Updating budget for ${budget?.category.name}`
                                : 'Set a spending limit for a category'
                            }
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            border: '1px solid var(--ink-border)',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--ink-muted)',
                            fontSize: '18px',
                            lineHeight: 1,
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Category — disabled in edit mode */}
                        <div>
                            <label className="form-label">
                                Category
                                {isEditMode && (
                                    <span style={{
                                        fontSize: '11px',
                                        color: 'var(--ink-faint)',
                                        fontWeight: '400',
                                        marginLeft: '6px',
                                    }}>
                                        (cannot change)
                                    </span>
                                )}
                            </label>
                            <select
                                className={`form-input ${errors.categoryId ? 'error' : ''}`}
                                disabled={isEditMode}
                                style={{ opacity: isEditMode ? 0.6 : 1 }}
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

                        {/* Month and Year — side by side */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <label className="form-label">
                                    Month
                                    {isEditMode && (
                                        <span style={{ fontSize: '11px', color: 'var(--ink-faint)', fontWeight: '400', marginLeft: '6px' }}>
                                            (cannot change)
                                        </span>
                                    )}
                                </label>
                                <select
                                    className="form-input"
                                    disabled={isEditMode}
                                    style={{ opacity: isEditMode ? 0.6 : 1 }}
                                    {...register('month')}
                                >
                                    {MONTHS.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Year</label>
                                <select
                                    className="form-input"
                                    disabled={isEditMode}
                                    style={{ opacity: isEditMode ? 0.6 : 1 }}
                                    {...register('year')}
                                >
                                    {YEARS.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Budget amount */}
                        <div>
                            <label className="form-label">Budget limit (LKR)</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: '12px',
                                    fontWeight: '500',
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

                            {/* Live preview of the amount */}
                            {watchAmount && !isNaN(Number(watchAmount)) && Number(watchAmount) > 0 && (
                                <div style={{
                                    marginTop: '6px',
                                    fontSize: '12px',
                                    color: 'var(--primary-500)',
                                    fontWeight: '500',
                                }}>
                                    Budget limit: {formatLKR(Number(watchAmount))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Action buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '10px',
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
                            {isEditMode ? 'Update budget' : 'Set budget'}
                        </Button>
                    </div>
                </form>

            </div>
        </div>
    )
}