// ============================================
// Toast Notification Component
// ============================================
// Shows success/error messages at bottom-right.
// Automatically disappears after 3 seconds.
//
// Used after:
//   - Successful login → "Welcome back!"
//   - Failed login → "Invalid email or password"
//   - Any API success or error
//
// Usage:
//   const { toast, showToast } = useToast()
//   showToast('Login successful!', 'success')
//   <Toast toast={toast} />
// ============================================

'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
    message: string
    type: 'success' | 'error'
    visible: boolean
    onClose: () => void
}

export default function Toast({ message, type, visible, onClose }: ToastProps) {

    // Auto-close after 3 seconds
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(onClose, 3000)
            return () => clearTimeout(timer) // cleanup if component unmounts
        }
    }, [visible, onClose])

    if (!visible) return null

    return (
        <div className={`toast ${type === 'success' ? 'toast-success' : 'toast-error'}`}>

            {/* Icon — checkmark or X */}
            <div style={{
                width: '20px', height: '20px',
                borderRadius: '50%',
                background: type === 'success'
                    ? 'var(--success)'
                    : 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}>
                {type === 'success' ? (
                    // Checkmark
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />    {/*This draws connected lines. */}
                    </svg>
                ) : (
                    // X mark
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                )}
            </div>

            {/* Message text */}
            <span style={{ flex: 1 }}>{message}</span>

            {/* Close button */}
            <button
                onClick={onClose}
                style={{
                    background: 'none', border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer', padding: '0',
                    display: 'flex', alignItems: 'center',
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    )
}