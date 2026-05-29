// ============================================
// useExpenses Hook
// ============================================
// Manages ALL expense-related state and API calls.
//
// Returns:
//   expenses    → array of expense objects
//   loading     → true while fetching
//   error       → error message if failed
//   summary     → total, count, largest
//   filters     → current active filters
//   setFilters  → update filters
//   createExpense → add new expense
//   updateExpense → edit existing expense
//   deleteExpense → remove expense
//   refetch     → manually refresh data
// ============================================

import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Expense, Category } from '@/types'
import { getCurrentMonthYear } from '@/lib/utils'

// Filter options the user can apply
interface ExpenseFilters {
    month: number
    year: number
    categoryId?: number
}

interface ExpenseSummary {
    total: number   // total spent in LKR
    count: number   // number of transactions
    largest: number   // biggest single expense
    average: number   // average per transaction
}

export function useExpenses() {
    // ── State ───────────────────────────────────────────
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [summary, setSummary] = useState<ExpenseSummary>({
        total: 0, count: 0, largest: 0, average: 0,
    })

    // Default filters — current month and year
    const { month, year } = getCurrentMonthYear()
    const [filters, setFilters] = useState<ExpenseFilters>({ month, year })

    // ── Fetch categories ────────────────────────────────
    // Called once on mount — categories don't change often
    const fetchCategories = useCallback(async () => {
        try {
            const res = await api.get('/api/categories')
            setCategories(res.data.data.categories)
        } catch {
            // Non-critical — page still works without categories
            console.error('Failed to fetch categories')
        }
    }, [])

    // ── Fetch expenses ──────────────────────────────────
    // Called on mount and whenever filters change
    const fetchExpenses = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            // Build query string from filters
            // e.g. ?month=5&year=2025&categoryId=1
            const params = new URLSearchParams({
                month: filters.month.toString(),
                year: filters.year.toString(),
                ...(filters.categoryId
                    ? { categoryId: filters.categoryId.toString() }
                    : {}),
            })

            const res = await api.get(`/api/expenses?${params}`)
            const data = res.data.data
            const expList = data.expenses as Expense[]

            setExpenses(expList)

            // Calculate summary from the returned expenses
            // We do this on frontend to avoid extra API call
            const total = data.total || 0
            const count = data.count || 0
            const largest = expList.length > 0
                ? Math.max(...expList.map(e => Number(e.amount)))
                : 0
            const average = count > 0 ? total / count : 0

            setSummary({ total, count, largest, average })

        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load expenses')
        } finally {
            setLoading(false)
        }
    }, [filters]) // re-runs when filters change

    // ── Create expense ──────────────────────────────────
    const createExpense = useCallback(async (data: {
        amount: number
        categoryId: number
        date: string
        note?: string
    }) => {
        const res = await api.post('/api/expenses', data)
        // Add new expense to top of list without refetching
        const newExpense = res.data.data.expense as Expense
        setExpenses(prev => [newExpense, ...prev])
        // Update summary counts
        setSummary(prev => ({
            total: prev.total + Number(newExpense.amount),
            count: prev.count + 1,
            largest: Math.max(prev.largest, Number(newExpense.amount)),
            average: (prev.total + Number(newExpense.amount)) / (prev.count + 1),
        }))
        return newExpense
    }, [])

    // ── Update expense ──────────────────────────────────
    const updateExpense = useCallback(async (
        id: number,
        data: { amount?: number; categoryId?: number; date?: string; note?: string }
    ) => {
        const res = await api.put(`/api/expenses/${id}`, data)
        const updated = res.data.data.expense as Expense
        // Replace the old expense in list with updated one
        setExpenses(prev =>
            prev.map(e => e.id === id ? updated : e)
        )
        // Refetch to recalculate summary accurately
        fetchExpenses()
        return updated
    }, [fetchExpenses])

    // ── Delete expense ──────────────────────────────────
    const deleteExpense = useCallback(async (id: number) => {
        await api.delete(`/api/expenses/${id}`)
        // Remove from list immediately (optimistic update)
        setExpenses(prev => prev.filter(e => e.id !== id))
        // Refetch to update summary
        fetchExpenses()
    }, [fetchExpenses])

    // ── Effects ─────────────────────────────────────────
    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    useEffect(() => {
        fetchExpenses()
    }, [fetchExpenses])

    return {
        expenses,
        categories,
        loading,
        error,
        summary,
        filters,
        setFilters,
        createExpense,
        updateExpense,
        deleteExpense,
        refetch: fetchExpenses,
    }
}