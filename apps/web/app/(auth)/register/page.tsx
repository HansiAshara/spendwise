// ============================================
// Register Page
// ============================================
// Creates a new user account.
// Same pattern as login — form → validate → API → redirect
// ============================================

'use client'

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
const registerSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name is too long'),

    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),

    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),

    // confirmPassword is ONLY for frontend validation
    // We never send it to the backend
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),

}).refine(
    // Custom rule — both passwords must match
    (data) => data.password === data.confirmPassword,
    {
        message: 'Passwords do not match',
        path: ['confirmPassword'], // show error on confirmPassword field
    }
)

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const router = useRouter()
    const { login } = useAuthStore()
    const { toasts, success, error } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch, // watch lets us read current field values
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    // Watch password for strength indicator
    const password = watch('password', '')

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true)

        try {
            // Only send name, email, password to backend
            // NOT confirmPassword — backend doesn't know about it
            const response = await api.post('/api/auth/register', {
                name: data.name,
                email: data.email,
                password: data.password,
            })

            const { user, token } = response.data.data

            // Save to global store — same as login
            login(user, token)

            success(`Account created! Welcome, ${user.name}!`)

            setTimeout(() => {
                router.push('/dashboard')
            }, 800)

        } catch (error: any) {
            const message = error.response?.data?.message
                || 'Registration failed. Please try again.'
            error(message)
        } finally {
            setIsLoading(false)
        }
    }

    // ── Password strength indicator ───────────────────
    // Shows visual feedback as user types password
    const getPasswordStrength = (pwd: string): {
        label: string
        color: string
        width: string
    } => {
        if (!pwd) return { label: '', color: 'transparent', width: '0%' }
        if (pwd.length < 6) return { label: 'Too short', color: 'var(--danger)', width: '25%' }
        if (pwd.length < 8) return { label: 'Weak', color: 'var(--warning)', width: '50%' }
        if (pwd.length < 12) return { label: 'Good', color: 'var(--primary-500)', width: '75%' }
        return { label: 'Strong', color: 'var(--success)', width: '100%' }
    }

    const strength = getPasswordStrength(password)

    return (
        <>
            {/* Page header */}
            <div style={{ marginBottom: '28px' }}>
                {/* Mobile logo */}
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
                    Create your account
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                    Start tracking your finances today — it&apos;s free
                </p>
            </div>

            {/* Register form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                    {/* Full name */}
                    <Input
                        label="Full name"
                        type="text"
                        placeholder="Kasun Perera"
                        autoComplete="name"
                        error={errors.name?.message}
                        {...register('name')}
                    />

                    {/* Email */}
                    <Input
                        label="Email address"
                        type="email"
                        placeholder="kasun@gmail.com"
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    {/* Password with strength indicator */}
                    <div>
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Min. 6 characters"
                            autoComplete="new-password"
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        {/* Password strength bar — shows as user types */}
                        {password && (
                            <div style={{ marginTop: '8px' }}>
                                <div style={{
                                    height: '4px',
                                    background: 'var(--hover-bg)',
                                    borderRadius: '999px',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: strength.width,
                                        background: strength.color,
                                        borderRadius: '999px',
                                        transition: 'width 0.3s, background 0.3s',
                                    }} />
                                </div>
                                <span style={{
                                    fontSize: '11px',
                                    color: strength.color,
                                    marginTop: '4px',
                                    display: 'block',
                                }}>
                                    {strength.label}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Confirm password */}
                    <Input
                        label="Confirm password"
                        type="password"
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
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
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </Button>

                </div>
            </form>

            {/* Login link */}
            <div style={{ marginTop: '24px' }}>
                <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: '12px', marginBottom: '16px',
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--ink-border)' }} />
                    <span style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--ink-border)' }} />
                </div>

                <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--ink-muted)' }}>
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        style={{
                            color: 'var(--primary-500)',
                            fontWeight: '500',
                            textDecoration: 'none',
                        }}
                    >
                        Sign in
                    </Link>
                </p>
            </div>

            {/* Terms note */}
            <p style={{
                marginTop: '20px',
                fontSize: '11px',
                color: 'var(--ink-faint)',
                textAlign: 'center',
                lineHeight: '1.6',
            }}>
                By creating an account you agree to our terms of service
                and privacy policy.
            </p>

            {toasts[0] && (
                <Toast
                    message={toasts[0].message}
                    type={toasts[0].type === 'success' ? 'success' : 'error'}
                    visible={true}
                    onClose={() => {}}
                />
            )}
        </>
    )
}