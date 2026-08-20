'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import AvatarUpload from '@/components/settings/AvatarUpload'
import AccountStatsCard from '@/components/settings/AccountStatsCard'
import { User } from '@/types'

interface ProfileSectionProps {
    user: User | null
    loading: boolean
    avatarLoading: boolean
    stats: { expenseCount: number; budgetCount: number; memberMonths: number } | null
    statsLoading: boolean
    onSubmit: (data: { name: string; email: string }) => Promise<{ success: boolean; message: string }>
    onAvatarUpload: (base64: string) => Promise<{ success: boolean; message: string }>
    onToast: (message: string, type: 'success' | 'error') => void
}

export default function ProfileSection({
    user, loading, avatarLoading, stats, statsLoading,
    onSubmit, onAvatarUpload, onToast,
}: ProfileSectionProps) {
    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
        }
    }, [user])

    const hasChanges = user && (name !== user.name || email !== user.email)

    const validate = () => {
        const newErrors: typeof errors = {}
        if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters'
        if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Please enter a valid email'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        const result = await onSubmit({ name: name.trim(), email: email.trim() })
        onToast(result.message, result.success ? 'success' : 'error')
    }

    return (
        <div className="card" style={{ padding: '24px' }}>

            <div style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                marginBottom: '20px', paddingBottom: '20px',
                borderBottom: '1px solid var(--ink-border)',
            }}>
                <AvatarUpload
                    name={user?.name || ''}
                    avatarUrl={user?.avatarUrl || null}
                    loading={avatarLoading}
                    onUpload={onAvatarUpload}
                    onToast={onToast}
                />
                <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink-primary)' }}>{user?.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>{user?.email}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-faint)', marginTop: '4px' }}>
                        Member since {user ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : ''}
                    </div>
                </div>
            </div>

            <AccountStatsCard stats={stats} loading={statsLoading} />

            <form onSubmit={handleSubmit}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink-primary)', marginBottom: '14px' }}>
                    Personal information
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                    <Input label="Full name" value={name} onChange={e => setName(e.target.value)} error={errors.name} />
                    <Input label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />
                </div>

                <Button type="submit" variant="primary" size="md" loading={loading} disabled={!hasChanges || loading}>
                    Save changes
                </Button>
            </form>
        </div>
    )
}