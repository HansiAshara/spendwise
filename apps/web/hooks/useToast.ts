import { useState, useCallback } from 'react'

export interface Toast {
    id: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
}

export const useToast = () => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback(
        (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
            const id = Date.now().toString()
            const newToast: Toast = { id, message, type }
            setToasts((prev) => [...prev, newToast])

            // Auto-remove toast after 3 seconds
            setTimeout(() => {
                removeToast(id)
            }, 3000)

            return id
        },
        []
    )

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    const success = useCallback((message: string) => addToast(message, 'success'), [addToast])
    const error = useCallback((message: string) => addToast(message, 'error'), [addToast])
    const warning = useCallback((message: string) => addToast(message, 'warning'), [addToast])
    const info = useCallback((message: string) => addToast(message, 'info'), [addToast])

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
    }
}
