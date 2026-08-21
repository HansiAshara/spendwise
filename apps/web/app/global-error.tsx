// ============================================
// Global Error Boundary
// ============================================
// Catches crashes so severe that even the root
// layout fails. Must include its own <html> and
// <body> tags since it replaces everything.
// ============================================

'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="en">
            <body>
                <div style={{
                    minHeight: '100vh', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'system-ui, sans-serif', padding: '20px', textAlign: 'center',
                }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>💥</div>
                    <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                        SpendWise ran into a problem
                    </h1>
                    <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px', maxWidth: '360px' }}>
                        We're sorry for the inconvenience. Please refresh the page to continue.
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            padding: '10px 24px', background: '#6366F1', color: 'white',
                            border: 'none', borderRadius: '8px', fontSize: '13px',
                            fontWeight: '500', cursor: 'pointer',
                        }}
                    >
                        Refresh app
                    </button>
                </div>
            </body>
        </html>
    )
}