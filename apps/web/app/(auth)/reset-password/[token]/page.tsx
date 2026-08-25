// ============================================
// Reset Password Page
// ============================================
// [token] is a dynamic route segment — captures
// the token from the URL, e.g.
// /reset-password/a3f9c81b2e...
// ============================================

'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import api from '@/lib/api'

const schema = z.object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(d => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
    const params = useParams()
    const router = useRouter()
    const token = params.token as string

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const { toasts, addToast, removeToast } = useToast()

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: FormData) => {
        setLoading(true)
        try {
            await api.post('/api/auth/reset-password', {
                token,
                newPassword: data.newPassword,
            })
            setSuccess(true)
            setTimeout(() => router.push('/login'), 2000)
        } catch (err: any) {
            addToast(
                err.response?.data?.message || 'Reset link is invalid or expired',
                'error'
            )
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '44px', marginBottom: '20px' }}>✅</div>
                <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--ink-primary)', marginBottom: '10px' }}>
                    Password reset!
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
                    Redirecting you to login...
                </p>
            </div>
        )
    }

    return (
        <>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--ink-primary)', marginBottom: '8px' }}>
                    Set new password
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                    Choose a strong new password for your account
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Input
                        label="New password"
                        type="password"
                        placeholder="Min. 6 characters"
                        error={errors.newPassword?.message}
                        {...register('newPassword')}
                    />
                    <Input
                        label="Confirm password"
                        type="password"
                        placeholder="Repeat your password"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    style={{ marginTop: '20px' }}
                >
                    Reset password
                </Button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--ink-muted)', marginTop: '20px' }}>
                <Link href="/login" style={{ color: 'var(--primary-500)', fontWeight: '500', textDecoration: 'none' }}>
                    ← Back to login
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