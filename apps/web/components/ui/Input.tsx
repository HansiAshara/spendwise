// ============================================
// Input Component
// ============================================
// Reusable form input with label, error message,
// and hint text built in.
//
// Why combine label + input + error in one component?
//   - Every input in the app has the same structure
//   - Keeps form code clean and readable
//   - Error state styling applied automatically
//
// Usage:
//   <Input
//     label="Email address"
//     type="email"
//     placeholder="kasun@gmail.com"
//     error={errors.email?.message}
//     {...register('email')}
//   />
// ============================================

'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string   // label shown above input
    error?: string   // error message shown below (red)
    hint?: string   // hint message shown below (gray)
    leftIcon?: React.ReactNode  // icon inside left side
}

// forwardRef is needed so react-hook-form can
// attach its ref to the actual <input> element
const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, leftIcon, className = '', ...props }, ref) => {
        return (
            <div className="flex flex-col">

                {/* Label above input */}
                {label && (
                    <label className="form-label">
                        {label}
                    </label>
                )}

                {/* Input wrapper — needed for left icon positioning */}
                <div className="relative">

                    {/* Left icon (optional) */}
                    {leftIcon && (
                        <div
                            className="absolute left-3 top-1/2 -translate-y-1/2"
                            style={{ color: 'var(--ink-faint)', pointerEvents: 'none' }}
                        >
                            {leftIcon}
                        </div>
                    )}

                    {/* The actual input element */}
                    <input
                        ref={ref}  // attach react-hook-form ref
                        className={`
                            form-input
                            ${error ? 'error' : ''}
                            ${leftIcon ? 'pl-9' : ''}
                            ${className}
                        `}
                        {...props}
                    />
                </div>

                {/* Error message — shown in red when error exists */}
                {error && (
                    <span className="form-error">
                        {/* Warning icon */}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        {error}
                    </span>
                )}

                {/* Hint message — shown in gray when no error */}
                {hint && !error && (
                    <span className="form-hint">{hint}</span>
                )}

            </div>
        )
    }
)

// Display name helps in React DevTools debugging
Input.displayName = 'Input'

export default Input