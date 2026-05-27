// ============================================
// Auth Store — Zustand
// ============================================
// Global auth state. One line import in any component:
//   const { user, token, login, logout } = useAuthStore()
// ============================================

import { create } from 'zustand'
import { User } from '@/types'

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
    user: null,
    token: typeof window !== 'undefined'
        ? localStorage.getItem('spendwise_token')
        : null,
    isLoading: false,

    login: (user, token) => {
        localStorage.setItem('spendwise_token', token)
        set({ user, token })
    },

    logout: () => {
        localStorage.removeItem('spendwise_token')
        set({ user: null, token: null })
    },

    setUser: (user) => set({ user }),
    setLoading: (isLoading) => set({ isLoading }),
}))