// ============================================
// useBudgets Hook
// ============================================
// Manages all budget-related state and API calls.
//
// Key concept — budget enrichment:
// The backend returns each budget WITH calculated
// fields: spent, remaining, percentage, alertStatus
// So frontend just displays what backend returns.
// ============================================

import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Budget, Category } from '@/types'
import { getCurrentMonthYear } from '@/lib/utils'

interface BudgetFilters {
    month: number
    year: number
}

interface BudgetSummary {
    totalBudgeted: number
    totalSpent: number
    totalSaved: number
    alertCount: number  // budgets over 80%
    dangerCount: number  // budgets over 100%
}

export function useBudgets() {
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [summary, setSummary] = useState<BudgetSummary>({
        totalBudgeted: 0,
        totalSpent: 0,
        totalSaved: 0,
        alertCount: 0,
        dangerCount: 0,
    })

    // Default to current month
    const { month, year } = getCurrentMonthYear()
    const [filters, setFilters] = useState<BudgetFilters>({ month, year })

    // ── Fetch categories ──────────────────────────────
    const fetchCategories = useCallback(async () => {
        try {
            const res = await api.get('/api/categories')
            const sortedCategories = (res.data.data.categories as Category[]).sort((a, b) => {
                if (a.name.toLowerCase() === 'other') return 1
                if (b.name.toLowerCase() === 'other') return -1
                return a.name.localeCompare(b.name)
            })
            setCategories(sortedCategories)
        } catch {
            console.error('Failed to fetch categories')
        }
    }, [])

    // ── Fetch budgets ─────────────────────────────────
    const fetchBudgets = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await api.get(
                `/api/budgets?month=${filters.month}&year=${filters.year}`
            )
            const list = res.data.data.budgets as Budget[]
            setBudgets(list)

            // Calculate summary from returned budgets
            const totalBudgeted = list.reduce((s, b) => s + Number(b.amount), 0)
            const totalSpent = list.reduce((s, b) => s + Number(b.spent), 0)
            const totalSaved = Math.max(0, totalBudgeted - totalSpent)
            const alertCount = list.filter(b => b.alertStatus === 'warning').length
            const dangerCount = list.filter(b => b.alertStatus === 'danger').length

            setSummary({ totalBudgeted, totalSpent, totalSaved, alertCount, dangerCount })

        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load budgets')
        } finally {
            setLoading(false)
        }
    }, [filters])

    // ── Create budget ─────────────────────────────────
    const createBudget = useCallback(async (data: {
        amount: number
        categoryId: number
        month: number
        year: number
    }) => {
        const res = await api.post('/api/budgets', data)
        // Refetch to get the enriched budget with spent/percentage
        await fetchBudgets()
        return res.data.data.budget
    }, [fetchBudgets])

    // ── Update budget ─────────────────────────────────
    const updateBudget = useCallback(async (id: number, amount: number) => {
        const res = await api.put(`/api/budgets/${id}`, { amount })
        await fetchBudgets()
        return res.data.data.budget
    }, [fetchBudgets])

    // ── Delete budget ─────────────────────────────────
    const deleteBudget = useCallback(async (id: number) => {
        await api.delete(`/api/budgets/${id}`)
        // Remove immediately from UI
        setBudgets(prev => prev.filter(b => b.id !== id))
        // Recalculate summary
        await fetchBudgets()
    }, [fetchBudgets])

    // ── Effects ───────────────────────────────────────
    useEffect(() => { fetchCategories() }, [fetchCategories])
    useEffect(() => { fetchBudgets() }, [fetchBudgets])

    return {
        budgets,
        categories,
        loading,
        error,
        summary,
        filters,
        setFilters,
        createBudget,
        updateBudget,
        deleteBudget,
        refetch: fetchBudgets,
    }
}