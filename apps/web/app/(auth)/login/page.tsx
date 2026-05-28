// ============================================
// Login Page
// ============================================
// Handles user login with email + password.
//
// Key concepts used here:
//   1. react-hook-form — manages form state
//   2. zod — validates form data
//   3. useRouter — redirects after login
//   4. useAuthStore — saves user + token globally
//   5. axios (via api.ts) — calls backend API
// ============================================

'use client' // needs browser APIs (localStorage, router)

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import { useAuthStore } from '@/store/useAuthStore'
import api from '@/lib/api'

// ── Validation schema ─────────────────────────────────
// Same rules as backend — validated on frontend first
// for instant feedback without a network request
const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
})

// TypeScript type inferred from schema
type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuthStore()       // global auth state setter
    const { toasts, addToast, removeToast } = useToast()
    
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    // react-hook-form setup
    // register — connects input to form
    // handleSubmit — validates before calling our function
    // formState.errors — validation error messages
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema), // use zod for validation
    })

    // Called when form is submitted AND validation passes
    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)

        try {
            // Call backend POST /api/auth/login
            const response = await api.post('/api/auth/login', data)
            const { user, token } = response.data.data

            // Save user and token to global Zustand store
            // This also saves token to localStorage automatically
            login(user, token)

            // Show success message briefly
            addToast(`Welcome back, ${user.name}!`, 'success')

            // Redirect to dashboard after short delay
            // so user can see the success toast
            setTimeout(() => {
                router.push('/dashboard')
            }, 800)

        } catch (error: any) {
            // Extract error message from backend response
            const message = error.response?.data?.message
                || 'Something went wrong. Please try again.'

            addToast(message, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Page header */}
            <div style={{ marginBottom: '32px' }}>
                {/* Mobile logo — only shows on mobile */}
                <div className="flex md:hidden items-center gap-2 mb-8">
                    <div style={{
                        width: '32px', height: '32px',
                        background: 'var(--primary-500)',
                        borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px',
                    }}>💰</div>
                    <span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ink-primary)' }}>
                        SpendWise
                    </span>
                </div>

                <h1 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'var(--ink-primary)',
                    marginBottom: '8px',
                    letterSpacing: '-0.5px',
                }}>
                    Welcome back
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                    Sign in to your SpendWise account
                </p>
            </div>

            {/* Login form */}
            {/* handleSubmit wraps our onSubmit — validates first */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Email input */}
                    <Input
                        label="Email address"
                        type="email"
                        placeholder="kasun@gmail.com"
                        autoComplete="email"
                        error={errors.email?.message}
                        // register connects this input to react-hook-form
                        {...register('email')}
                    />

                    {/* Password input */}
                    <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        error={errors.password?.message}
                        rightIcon={
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                {showPassword ? (
                                    <>
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </>
                                ) : (
                                    <>
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1 4.24 4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </>
                                )}
                            </svg>
                        }
                        onRightIconClick={() => setShowPassword(!showPassword)}
                        {...register('password')}
                    />

                    {/* Submit button */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={isLoading}
                        style={{ marginTop: '8px' }}
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>

                </div>
            </form>

            {/* Divider */}
            <div style={{
                display: 'flex', alignItems: 'center',
                gap: '12px', margin: '24px 0',
            }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--ink-border)' }} />
                <span style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--ink-border)' }} />
            </div>

            {/* Register link */}
            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--ink-muted)' }}>
                Don&apos;t have an account?{' '}
                <Link
                    href="/register"
                    style={{
                        color: 'var(--primary-500)',
                        fontWeight: '500',
                        textDecoration: 'none',
                    }}
                >
                    Create one for free
                </Link>
            </p>

            {/* Toast notification */}
            <Toast
                message={toasts[0]?.message ?? ''}
                type={(toasts[0]?.type as 'error' | 'success') ?? 'success'}
                visible={toasts.length > 0}
                onClose={() => {
                    if (toasts[0]) {
                        removeToast(toasts[0].id)
                    }
                }}
            />
        </>
    )
}