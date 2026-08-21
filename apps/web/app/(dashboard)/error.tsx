// ============================================
// Dashboard Section Error Boundary
// ============================================
// If a page INSIDE the dashboard crashes,
// only the content area shows the error —
// sidebar and navbar stay visible and usable.
// ============================================

'use client'

import { useEffect } from 'react'
import ErrorFallback from '@/components/ui/ErrorFallback'

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Dashboard page error:', error)
    }, [error])

    return (
        <div className="card">
            <ErrorFallback
                title="Couldn't load this page"
                message="Something went wrong. Your data is safe — try again or navigate to another page."
                onRetry={reset}
            />
        </div>
    )
}