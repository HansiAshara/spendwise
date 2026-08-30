'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import api from '@/lib/api'

declare global {
    interface Window {
        google?: any
        __gsiInitialized?: boolean
    }
}

interface GoogleSignInButtonProps {
    onError: (message: string) => void
}

export default function GoogleSignInButton({ onError }: GoogleSignInButtonProps) {
    const buttonRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { login } = useAuthStore()

    const handleCredentialResponse = useCallback(
        async (response: { credential: string }) => {
            try {
                const res = await api.post('/api/auth/google', {
                    idToken: response.credential,
                })
                const { user, token } = res.data.data
                login(user, token)
                router.push('/dashboard')
            } catch (err: any) {
                onError(err.response?.data?.message || 'Google sign-in failed')
            }
        },
        [login, router, onError]
    )

    const renderGSIButton = useCallback(() => {
        if (!window.google?.accounts?.id || !buttonRef.current) return

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
        if (!clientId) {
            console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured')
            return
        }

        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
        })

        // Google Identity Services expects width between 200 and 400 pixels
        const containerWidth = buttonRef.current.parentElement?.offsetWidth || 380
        const buttonWidth = Math.min(Math.max(containerWidth, 200), 400)

        // Clear previous button render if any
        buttonRef.current.innerHTML = ''

        window.google.accounts.id.renderButton(buttonRef.current, {
            theme: 'outline',
            size: 'large',
            width: String(buttonWidth),
            text: 'continue_with',
            shape: 'rectangular',
        })
    }, [handleCredentialResponse])

    useEffect(() => {
        const scriptId = 'google-identity-script'
        let script = document.getElementById(scriptId) as HTMLScriptElement | null

        if (!script) {
            script = document.createElement('script')
            script.id = scriptId
            script.src = 'https://accounts.google.com/gsi/client'
            script.async = true
            script.defer = true
            script.onload = () => {
                renderGSIButton()
            }
            document.head.appendChild(script)
        } else if (window.google?.accounts?.id) {
            renderGSIButton()
        } else {
            script.addEventListener('load', renderGSIButton)
        }

        return () => {
            if (script) {
                script.removeEventListener('load', renderGSIButton)
            }
        }
    }, [renderGSIButton])

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                minHeight: '44px',
            }}
        >
            <div ref={buttonRef} style={{ width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'center' }} />
        </div>
    )
}