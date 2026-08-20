'use client'

import { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Toast from '@/components/ui/Toast'
import SettingsNav, { SettingsSection } from '@/components/settings/SettingsNav'
import ProfileSection from '@/components/settings/ProfileSection'
import PasswordSection from '@/components/settings/PasswordSection'
import NotificationsSection from '@/components/settings/NotificationsSection'
import CurrencySection from '@/components/settings/CurrencySection'
import AppearanceSection from '@/components/settings/AppearanceSection'
import DangerZone from '@/components/settings/DangerZone'
import { useSettings } from '@/hooks/useSettings'
import { useToast } from '@/hooks/useToast'

export default function SettingsPage() {
    const [section, setSection] = useState<SettingsSection>('profile')

    const {
        user,
        profileLoading, passwordLoading, currencyLoading, deleteLoading,
        updateProfile, changePassword, updateCurrency, deleteAccount,
    } = useSettings()

    const { toasts, addToast, removeToast } = useToast()
    const showToast = addToast
    const toast = toasts[0]
    const updateAvatar = async (_base64: string) => ({ success: false, message: 'Not implemented' })
    const updateNotifications = async (..._args: any[]) => ({ success: false, message: 'Not implemented' })

    return (
        <div className="page-animate">
            <PageHeader title="Settings" subtitle="Manage your account and preferences" />

            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', alignItems: 'start' }}>
                <SettingsNav active={section} onChange={setSection} />

                <div>
                    {section === 'profile' && (
                        <ProfileSection
                            user={user} loading={profileLoading} avatarLoading={false}
                            stats={null} statsLoading={false}
                            onSubmit={updateProfile} onAvatarUpload={updateAvatar} onToast={showToast}
                        />
                    )}
                    {section === 'password' && (
                        <PasswordSection loading={passwordLoading} onSubmit={changePassword} onToast={showToast} />
                    )}
                    {section === 'notifications' && (
                        <NotificationsSection user={user} loading={false} onSubmit={updateNotifications} onToast={showToast} />
                    )}
                    {section === 'currency' && (
                        <CurrencySection user={user} loading={currencyLoading} onSubmit={updateCurrency} onToast={showToast} />
                    )}
                    {section === 'appearance' && <AppearanceSection />}
                    {section === 'danger' && (
                        <DangerZone loading={deleteLoading} onSubmit={deleteAccount} onToast={showToast} />
                    )}
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type === 'success' || toast.type === 'error' ? toast.type : 'error'}
                    visible={true}
                    onClose={() => removeToast(toast.id)}
                />
            )}
        </div>
    )
}