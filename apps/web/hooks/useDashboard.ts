// ============================================
// useDashboard Hook
// ============================================
// Fetches ALL dashboard data in parallel.
// One hook call = all charts + summary ready.
// ============================================

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { CategorySummary, MonthlyTrend, DailySpending } from '@/types'
import { getCurrentMonthYear } from '@/lib/utils'

interface DashboardSummary {
    month: number
    year: number
    totalSpent: number
    expenseCount: number
    topCategory: CategorySummary | null
    budgetAlerts: number
}

interface DashboardData {
    summary: DashboardSummary
    categorySummary: CategorySummary[]
    monthlyTrend: MonthlyTrend[]
    dailySpending: DailySpending[]
}

export function useDashboard() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchDashboard = async () => {
        setLoading(true)
        setError(null)

        try {
            // Fetch all dashboard data in parallel
            // Promise.all runs all requests simultaneously
            // Much faster than sequential requests
            const [dashRes, monthlyRes, dailyRes] = await Promise.all([
                api.get('/api/analytics/dashboard'),
                api.get('/api/analytics/monthly'),
                api.get(`/api/analytics/daily?month=${getCurrentMonthYear().month}&year=${getCurrentMonthYear().year}`),
            ])

            setData({
                summary: dashRes.data.data.currentMonth,
                categorySummary: dashRes.data.data.categorySummary,
                monthlyTrend: monthlyRes.data.data.trend,
                dailySpending: dailyRes.data.data.daily,
            })

        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load dashboard')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboard()
    }, [])

    return { data, loading, error, refetch: fetchDashboard }
}