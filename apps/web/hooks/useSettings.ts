// ============================================
// useSettings Hook
// ============================================
import { useState } from 'react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'

export function useSettings() {
    const { user, setUser, logout } = useAuthStore()

    const [profileLoading, setProfileLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [currencyLoading, setCurrencyLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

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
        profileLoading, passwordLoading, currencyLoading, deleteLoading,
        updateProfile, changePassword, updateCurrency, deleteAccount,
    }
}