// ============================================
// useSettings Hook
// ============================================
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'

export function useSettings() {
    const { user, setUser, logout } = useAuthStore()

    const [stats, setStats] = useState<{ expenseCount: number; budgetCount: number; memberMonths: number } | null>(null)
    const [statsLoading, setStatsLoading] = useState(true)

    const [profileLoading, setProfileLoading] = useState(false)
    const [avatarLoading, setAvatarLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [notificationsLoading, setNotificationsLoading] = useState(false)
    const [currencyLoading, setCurrencyLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [loadError, setLoadError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) {
            setLoadError('Unable to load your profile. Please try logging in again.')
        } else {
            setLoadError(null)
        }
    }, [user])

    useEffect(() => {
        let isMounted = true
        setStatsLoading(true)
        api.get('/api/auth/stats')
            .then(res => {
                if (isMounted) {
                    setStats(res.data.data)
                }
            })
            .catch(() => { })
            .finally(() => {
                if (isMounted) {
                    setStatsLoading(false)
                }
            })
        return () => {
            isMounted = false
        }
    }, [])

    const updateProfile = async (data: { name?: string; email?: string }) => {
        setProfileLoading(true)
        try {
            const res = await api.patch('/api/auth/me', data)
            setUser(res.data.data.user)
            return { success: true, message: 'Profile updated successfully' }
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || 'Failed to update profile' }
        } finally {
            setProfileLoading(false)
        }
    }

    const changePassword = async (currentPassword: string, newPassword: string) => {
        setPasswordLoading(true)
        try {
            await api.patch('/api/auth/change-password', { currentPassword, newPassword })
            return { success: true, message: 'Password changed successfully' }
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || 'Failed to change password' }
        } finally {
            setPasswordLoading(false)
        }
    }

    const updateAvatar = async (base64: string) => {
        setAvatarLoading(true)
        try {
            const res = await api.patch('/api/auth/avatar', { avatarUrl: base64 })
            setUser(res.data.data.user)
            return { success: true, message: 'Avatar updated successfully' }
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || 'Failed to update avatar' }
        } finally {
            setAvatarLoading(false)
        }
    }

    const updateNotifications = async (prefs: {
        notifyBudgetAlerts: boolean
        notifyWeeklySummary: boolean
        notifyMonthlyReport: boolean
    }) => {
        setNotificationsLoading(true)
        try {
            const res = await api.patch('/api/auth/notifications', prefs)
            setUser(res.data.data.user)
            return { success: true, message: 'Notification preferences updated' }
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || 'Failed to update notifications' }
        } finally {
            setNotificationsLoading(false)
        }
    }

    const updateCurrency = async (currency: string) => {
        setCurrencyLoading(true)
        try {
            const res = await api.patch('/api/auth/currency', { currency })
            setUser(res.data.data.user)
            return { success: true, message: 'Currency preference updated' }
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || 'Failed to update currency' }
        } finally {
            setCurrencyLoading(false)
        }
    }

    const deleteAccount = async (password: string) => {
        setDeleteLoading(true)
        try {
            await api.delete('/api/auth/me', { data: { password } })
            logout()
            return { success: true, message: 'Account deleted' }
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || 'Failed to delete account' }
        } finally {
            setDeleteLoading(false)
        }
    }

    return {
        user,
        stats,
        statsLoading,
        profileLoading,
        avatarLoading,
        passwordLoading,
        notificationsLoading,
        currencyLoading,
        deleteLoading,
        updateProfile,
        updateAvatar,
        changePassword,
        updateNotifications,
        updateCurrency,
        deleteAccount,
        loadError,
    }
}