// ============================================
// useInsights Hook
// ============================================
// Manages AI insights state and API calls.
//
// Key concept — insights are NOT auto-fetched
// on page load. User explicitly clicks "Generate"
// because each call uses AI quota.
// We cache the last result so user doesn't
// regenerate unnecessarily.
// ============================================

import { useState, useCallback } from 'react'
import api from '@/lib/api'

interface InsightTip {
    title: string
    description: string
    potentialSaving: number
    category: string
    priority: 'high' | 'medium' | 'low'
}

interface CategoryBreakdown {
    [category: string]: {
        total: number
        count: number
        icon: string
    }
}

interface InsightsData {
    tips: InsightTip[]
    summary: string
    dataPoints: number
    totalSpent: number
    categoryBreakdown: CategoryBreakdown
}

export function useInsights() {
    const [data, setData] = useState<InsightsData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [generated, setGenerated] = useState(false)
    // Track when insights were last generated
    const [generatedAt, setGeneratedAt] = useState<Date | null>(null)

    const generateInsights = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await api.get('/api/insights')
            setData(res.data.data)
            setGenerated(true)
            setGeneratedAt(new Date())
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Failed to generate insights. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        data,
        loading,
        error,
        generated,
        generatedAt,
        generateInsights,
    }
}