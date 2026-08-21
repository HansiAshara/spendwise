// ============================================
// NetworkStatus Component
// ============================================
// Listens to browser online/offline events.
// Shows a banner when connection is lost.
// ============================================

'use client'

import { useState, useEffect } from 'react'

export default function NetworkStatus() {
    const [isOnline, setIsOnline] = useState(true)
    const [showBanner, setShowBanner] = useState(false)

    useEffect(() => {
        setIsOnline(navigator.onLine)

        const handleOnline = () => {
            setIsOnline(true)
            // Briefly show "back online" then hide
            setShowBanner(true)
            setTimeout(() => setShowBanner(false), 2500)
        }
        const handleOffline = () => {
            setIsOnline(false)
            setShowBanner(true)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    if (!showBanner) return null

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
            padding: '8px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '500',
            background: isOnline ? 'var(--success)' : 'var(--danger)',
            color: 'white', animation: 'slideDown 0.3s ease-out',
        }}>
            <style>{`
        @keyframes slideDown {
            from { transform: translateY(-100%); }
            to   { transform: translateY(0); }
        }
        `}</style>
            {isOnline ? '✓ Back online' : '⚠ No internet connection — some features may not work'}
        </div>
    )
}