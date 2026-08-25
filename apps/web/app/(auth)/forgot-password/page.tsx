// ============================================
// Forgot Password Page
// ============================================

'use client'

import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import api from '@/lib/api'

const schema = z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
})
type FormData = z.infer<typeof schema>

function ForgotPasswordContent() {
    const searchParams = useSearchParams()
    const emailParam = searchParams.get('email') ?? ''

    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toasts, addToast, removeToast } = useToast()

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: emailParam,
        },
    })

    const onSubmit = async (data: FormData) => {
        setLoading(true)
        try {
            await api.post('/api/auth/forgot-password', data)
            setSubmitted(true)
        } catch {
            addToast('Something went wrong. Please try again.', 'error')
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '44px', marginBottom: '20px' }}>📧</div>
                <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--ink-primary)', marginBottom: '10px' }}>
                    Check your email
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
                    If an account exists with that email, we've sent a password reset link.
                    It expires in 15 minutes.
                </p>
                <Link href="/login" style={{ fontSize: '13px', color: 'var(--primary-500)', fontWeight: '500', textDecoration: 'none' }}>
                    ← Back to login
                </Link>
            </div>
        )
    }

    return (
        <>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--ink-primary)', marginBottom: '8px' }}>
                    Forgot password?
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                    Enter your email and we'll send you a reset link
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Email address"
                    type="email"
                    placeholder="kasun@gmail.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    style={{ marginTop: '20px' }}
                >
                    Send reset link
                </Button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--ink-muted)', marginTop: '20px' }}>
                Remember your password?{' '}
                <Link href="/login" style={{ color: 'var(--primary-500)', fontWeight: '500', textDecoration: 'none' }}>
                    Sign in
                </Link>
            </p>

            <Toast
                message={toasts[0]?.message ?? ''}
                type={(toasts[0]?.type as 'error' | 'success') ?? 'error'}
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

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ForgotPasswordContent />
        </Suspense>
    )
}