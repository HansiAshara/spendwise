'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Link from 'next/link'

interface DangerZoneProps {
    loading: boolean
    onSubmit: (password: string) => Promise<{ success: boolean; message: string }>
    onToast: (message: string, type: 'success' | 'error') => void
}

export default function DangerZone({ loading, onSubmit, onToast }: DangerZoneProps) {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [confirmText, setConfirmText] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const canDelete = confirmText === 'DELETE' && password.length > 0

    const handleDelete = async () => {
        if (!canDelete) {
            setError('Please type DELETE and enter your password')
            return
        }
        const result = await onSubmit(password)
        if (result.success) {
            onToast('Account deleted. Redirecting...', 'success')
            setTimeout(() => router.push('/login'), 1200)
        } else {
            setError(result.message)
        }
    }

    return (
        <>
            <div className="card" style={{ padding: '24px', border: '1px solid rgba(239,68,68,0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '10px',
                        background: 'var(--danger-bg)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0,
                    }}>
                        ⚠️
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--danger)', marginBottom: '6px' }}>
                            Delete account permanently
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
                            This will permanently delete your account, all expenses, budgets, and history.
                            This action <strong>cannot be undone</strong>. We recommend exporting your data first.
                        </p>

                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '12px 14px', background: 'var(--page-bg)',
                            borderRadius: '10px', marginBottom: '14px',
                            border: '1px solid var(--ink-border)',
                        }}>
                            <span style={{ fontSize: '16px' }}>💾</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--ink-primary)' }}>
                                    Export your data first
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                                    Download all your expenses before deleting your account
                                </div>
                            </div>
                            <Link href="/export" style={{
                                fontSize: '12px', fontWeight: '500', color: 'var(--primary-500)',
                                textDecoration: 'none', flexShrink: 0,
                            }}>
                                Go to Export →
                            </Link>
                        </div>

                        <Button variant="danger" size="md" onClick={() => setShowModal(true)}>
                            Delete my account
                        </Button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal-box">
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '17px', fontWeight: '600', color: 'var(--danger)', marginBottom: '6px' }}>
                                Are you absolutely sure?
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: '1.6' }}>
                                This will permanently delete your account and all associated data.
                                Type <strong>DELETE</strong> below and enter your password to confirm.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                            <Input label='Type "DELETE" to confirm' value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="DELETE" />
                            <Input label="Your password" type="password" value={password} onChange={e => setPassword(e.target.value)} error={error} />
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button
                                variant="secondary" size="md" style={{ flex: 1 }}
                                onClick={() => { setShowModal(false); setConfirmText(''); setPassword(''); setError('') }}
                            >
                                Cancel
                            </Button>

                            <Button variant="danger" size="md" style={{ flex: 2 }} loading={loading} disabled={!canDelete} onClick={handleDelete}>
                                Permanently delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}