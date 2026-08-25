'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface PasswordSectionProps {
    loading: boolean
    onSubmit: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>
    onToast: (message: string, type: 'success' | 'error') => void
}

export default function PasswordSection({ loading, onSubmit, onToast }: PasswordSectionProps) {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const renderEyeIcon = (show: boolean) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {show ? (
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
    )

    const getStrength = (pwd: string) => {
        if (!pwd) return { label: '', color: 'transparent', width: '0%' }
        if (pwd.length < 6) return { label: 'Too short', color: 'var(--danger)', width: '25%' }
        if (pwd.length < 8) return { label: 'Weak', color: 'var(--warning)', width: '50%' }
        if (pwd.length < 12) return { label: 'Good', color: 'var(--primary-500)', width: '75%' }
        return { label: 'Strong', color: 'var(--success)', width: '100%' }
    }

    const strength = getStrength(newPassword)

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!currentPassword) newErrors.currentPassword = 'Current password is required'
        if (newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters'
        if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        const result = await onSubmit(currentPassword, newPassword)
        onToast(result.message, result.success ? 'success' : 'error')
        if (result.success) {
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        }
    }

    return (
        <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink-primary)', marginBottom: '4px' }}>
                Change password
            </div>
            <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '20px' }}>
                Choose a strong password you don't use elsewhere.
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '380px' }}>
                    <Input
                        label="Current password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        error={errors.currentPassword}
                        autoComplete="current-password"
                        rightIcon={renderEyeIcon(showCurrentPassword)}
                        onRightIconClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    />

                    <div>
                        <Input
                            label="New password"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            error={errors.newPassword}
                            autoComplete="new-password"
                            rightIcon={renderEyeIcon(showNewPassword)}
                            onRightIconClick={() => setShowNewPassword(!showNewPassword)}
                        />
                        {newPassword && (
                            <div style={{ marginTop: '8px' }}>
                                <div style={{ height: '4px', background: 'var(--hover-bg)', borderRadius: '999px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: '999px', transition: 'width 0.3s, background 0.3s' }} />
                                </div>
                                <span style={{ fontSize: '11px', color: strength.color, marginTop: '4px', display: 'block' }}>
                                    {strength.label}
                                </span>
                            </div>
                        )}
                    </div>

                    <Input
                        label="Confirm new password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        error={errors.confirmPassword}
                        autoComplete="new-password"
                        rightIcon={renderEyeIcon(showConfirmPassword)}
                        onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />

                    <Button type="submit" variant="primary" size="md" loading={loading} style={{ alignSelf: 'flex-start' }}>
                        Update password
                    </Button>
                </div>
            </form>
        </div>
    )
}