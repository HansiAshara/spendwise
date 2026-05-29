// ============================================
// Auth Store — Zustand
// ============================================
// Stores user and token globally.
// Saves token to BOTH localStorage and cookie
// so middleware can read it for route protection.
// ============================================

import { create } from 'zustand'
import { User } from '@/types'

// Helper to set a cookie
function setCookie(name: string, value: string, days = 7) {
    if (typeof document === 'undefined') return
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`
}

// Helper to delete a cookie
function deleteCookie(name: string) {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

interface AuthState {
    user: User | null
    token: string | null
    isLoading: boolean

    login: (user: User, token: string) => void
    logout: () => void
    setUser: (user: User) => void
    setLoading: (v: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    // Read token from localStorage on init
    user: null,
    token: typeof window !== 'undefined'
        ? localStorage.getItem('spendwise_token')
        : null,
    isLoading: false,

    login: (user, token) => {
        // Save to localStorage — persists across sessions
        localStorage.setItem('spendwise_token', token)
        // Save to cookie — middleware can read this
        setCookie('spendwise_token', token)
        set({ user, token })
    },

    logout: () => {
        localStorage.removeItem('spendwise_token')
        deleteCookie('spendwise_token')
        set({ user: null, token: null })
    },

    setUser: (user) => set({ user }),
    setLoading: (isLoading) => set({ isLoading }),
}))