// ============================================
// PageHeader Component
// ============================================
// Shows at the top of each page's content area.
// Below the Navbar, above the page content.
//
// Usage:
//   <PageHeader
//     title="Expenses"
//     subtitle="28 transactions in May 2025"
//     action={
//       <Button onClick={openModal}>
//         + Log expense
//       </Button>
//     }
//   />
// ============================================

import React from 'react'

interface PageHeaderProps {
    title: string
    subtitle?: string
    action?: React.ReactNode  // optional button or element on the right
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '24px',
            gap: '16px',
        }}>
            {/* Title and subtitle */}
            <div>
                <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: 'var(--ink-primary)',
                    margin: 0,
                    letterSpacing: '-0.4px',
                }}>
                    {title}
                </h2>
                {subtitle && (
                    <p style={{
                        fontSize: '13px',
                        color: 'var(--ink-muted)',
                        margin: 0,
                        marginTop: '4px',
                    }}>
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Action button slot — right side */}
            {action && (
                <div style={{ flexShrink: 0 }}>
                    {action}
                </div>
            )}
        </div>
    )
}