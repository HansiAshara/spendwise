// ============================================
// useExport Hook
// ============================================
// Manages ALL export page state and logic:
//   - format, date range, category filters
//   - fetching categories
//   - fetching live preview (count + total)
//   - triggering file download
//
// Keeping this in a hook means the page component
// and all sub-components stay pure UI — no API
// calls scattered across multiple files.
// ============================================

import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'

export type ExportFormat = 'pdf' | 'csv'

export interface Category {
    id: number
    name: string
    icon: string
}

export interface Preview {
    count: number
    total: number
}

// Default date range — current month
function getDefaultDates() {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
    }
}

export function useExport() {
    // ── Filter state ────────────────────────────────
    const [format, setFormat] = useState<ExportFormat>('pdf')
    const [startDate, setStartDate] = useState(getDefaultDates().startDate)
    const [endDate, setEndDate] = useState(getDefaultDates().endDate)
    const [categoryId, setCategoryId] = useState<string>('')

    // ── Data state ──────────────────────────────────
    const [categories, setCategories] = useState<Category[]>([])
    const [preview, setPreview] = useState<Preview | null>(null)
    const [previewLoading, setPreviewLoading] = useState(false)
    const [downloading, setDownloading] = useState(false)

    // ── Fetch categories once on mount ─────────────
    useEffect(() => {
        api.get('/api/categories')
            .then(res => setCategories(res.data.data.categories))
            .catch(() => { })
    }, [])

    // ── Fetch preview whenever filters change ──────
    const fetchPreview = useCallback(async () => {
        setPreviewLoading(true)
        try {
            const params = new URLSearchParams({ startDate, endDate })
            if (categoryId) params.append('categoryId', categoryId)

            const res = await api.get(`/api/export/preview?${params}`)
            setPreview(res.data.data)
        } catch {
            setPreview(null)
        } finally {
            setPreviewLoading(false)
        }
    }, [startDate, endDate, categoryId])

    useEffect(() => { fetchPreview() }, [fetchPreview])

    // ── Apply a quick date preset ───────────────────
    const applyPreset = useCallback((preset: string) => {
        const now = new Date()
        let start: Date, end: Date

        switch (preset) {
            case 'this_month':
                start = new Date(now.getFullYear(), now.getMonth(), 1)
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
                break
            case 'last_month':
                start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
                end = new Date(now.getFullYear(), now.getMonth(), 0)
                break
            case 'last_3_months':
                start = new Date(now.getFullYear(), now.getMonth() - 3, 1)
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
                break
            case 'this_year':
                start = new Date(now.getFullYear(), 0, 1)
                end = new Date(now.getFullYear(), 11, 31)
                break
            default:
                return
        }

        setStartDate(start.toISOString().split('T')[0])
        setEndDate(end.toISOString().split('T')[0])
    }, [])

    // ── Trigger the actual file download ────────────
    const downloadFile = useCallback(async (): Promise<{ success: boolean; message: string }> => {
        if (preview?.count === 0) {
            return { success: false, message: 'No expenses found for the selected filters' }
        }

        setDownloading(true)

        try {
            const params = new URLSearchParams({ startDate, endDate })
            if (categoryId) params.append('categoryId', categoryId)

            const response = await api.get(`/api/export/${format}?${params}`, {
                responseType: 'blob',
            })

            const mimeType = format === 'pdf' ? 'application/pdf' : 'text/csv'
            const blob = new Blob([response.data], { type: mimeType })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            const filename = `spendwise-${format === 'pdf' ? 'report' : 'expenses'}-${new Date().toISOString().split('T')[0]}.${format}`

            link.href = url
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            return { success: true, message: `${format.toUpperCase()} downloaded successfully!` }

        } catch (err: any) {
            const errorMsg = err?.friendlyMessage || err?.message || 'Download failed. Please try again.'
            return { success: false, message: errorMsg }
        } finally {
            setDownloading(false)
        }
    }, [format, startDate, endDate, categoryId, preview])

    return {
        // filters
        format, setFormat,
        startDate, setStartDate,
        endDate, setEndDate,
        categoryId, setCategoryId,
        // data
        categories,
        preview, previewLoading,
        downloading,
        // actions
        applyPreset,
        downloadFile,
    }
}