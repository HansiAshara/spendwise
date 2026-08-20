// ============================================
// AvatarUpload Component
// ============================================
// Lets user pick an image, converts to base64,
// sends to backend, shows preview immediately.
// No cloud storage needed — image stored as
// base64 text directly in the database.
// ============================================

'use client'

import { useRef, useState } from 'react'
import { getInitials } from '@/lib/utils'

interface AvatarUploadProps {
    name: string
    avatarUrl: string | null
    loading: boolean
    onUpload: (base64: string) => Promise<{ success: boolean; message: string }>
    onToast: (message: string, type: 'success' | 'error') => void
}

const MAX_SIZE_MB = 2

export default function AvatarUpload({ name, avatarUrl, loading, onUpload, onToast }: AvatarUploadProps) {
    const fileRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(avatarUrl)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            onToast('Please select an image file', 'error')
            return
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            onToast(`Image must be under ${MAX_SIZE_MB}MB`, 'error')
            return
        }

        // Convert to base64 for storage/preview
        const reader = new FileReader()
        reader.onload = async () => {
            const base64 = reader.result as string
            setPreview(base64)
            const result = await onUpload(base64)
            onToast(result.message, result.success ? 'success' : 'error')
        }
        reader.readAsDataURL(file)
    }

    return (
        <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: preview ? 'transparent' : 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', fontWeight: '600', color: 'white',
                overflow: 'hidden', border: '2px solid var(--ink-border)',
            }}>
                {preview ? (
                    <img src={preview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    getInitials(name)
                )}
            </div>

            {/* Upload button overlay */}
            <button
                onClick={() => fileRef.current?.click()}
                disabled={loading}
                title="Change photo"
                style={{
                    position: 'absolute', bottom: '-2px', right: '-2px',
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'var(--primary-500)', border: '2px solid white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'white',
                }}
            >
                {loading ? (
                    <svg style={{ animation: 'spin 1s linear infinite' }} width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                ) : (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                )}
            </button>

            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
        </div>
    )
}