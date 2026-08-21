// ============================================
// ErrorFallback Component
// ============================================
// Reusable "something went wrong" UI.
// Used by error.tsx boundary files.
// ============================================

'use client'

interface ErrorFallbackProps {
    title?: string
    message?: string
    onRetry?: () => void
}

export default function ErrorFallback({
    title = 'Something went wrong',
    message = 'An unexpected error occurred. Please try again.',
    onRetry,
}: ErrorFallbackProps) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minHeight: '400px', textAlign: 'center',
            padding: '40px 20px',
        }}>
            <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'var(--danger-bg)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', marginBottom: '20px',
            }}>
                ⚠️
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ink-primary)', marginBottom: '8px' }}>
                {title}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', maxWidth: '360px', lineHeight: '1.6', marginBottom: '24px' }}>
                {message}
            </p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="btn btn-primary btn-md"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                    Try again
                </button>
            )}
        </div>
    )
}