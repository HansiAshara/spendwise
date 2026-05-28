// ============================================
// Button Component
// ============================================
// Reusable button used everywhere in the app.
// Supports all variants from our design system.
//
// Why a component instead of plain <button>?
//   - Consistent styling guaranteed everywhere
//   - Built-in loading spinner
//   - One place to change if design updates
//
// Usage:
//   <Button variant="primary" size="lg" loading={isLoading}>
//     Sign in
//   </Button>
// ============================================

'use client' // this is a client component — has interactivity

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'secondary'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean          // shows spinner when true
    fullWidth?: boolean        // takes full width of parent
    children: React.ReactNode
}

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    children,
    disabled,
    className = '',
    ...props   // pass through any other button props (onClick, type, etc.)
}: ButtonProps) {

    return (
        <button
        // Combine our CSS classes from globals.css
        className={`
            btn
            btn-${variant}
            btn-${size}
            ${fullWidth ? 'w-full' : ''}
            ${className}
        `}
            // Disable when loading OR when explicitly disabled
            disabled={disabled || loading}
            {...props}
        >
            {/* Show spinner when loading */}
            {loading && (
                <svg
                    className="animate-spin"
                    width="14" height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                        cx="12" cy="12" r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeOpacity="0.25"
                    />
                    <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </svg>
            )}

            {/* Button label */}
            {children}
        </button>
    )
}