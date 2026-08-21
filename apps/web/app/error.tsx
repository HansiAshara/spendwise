// ============================================
// Route-level Error Boundary
// ============================================
// Next.js automatically wraps pages with this.
// If any page throws during render, this shows
// instead of a blank white screen.
// ============================================

'use client'

import { useEffect } from 'react'
import ErrorFallback from '@/components/ui/ErrorFallback'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log to console — in production you'd send this to a monitoring service
        console.error('Page error:', error)
    }, [error])

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--page-bg)' }}>
            <ErrorFallback
                title="This page hit a snag"
                message="Something went wrong loading this page. Your data is safe — try refreshing."
                onRetry={reset}
            />
        </div>
    )
}