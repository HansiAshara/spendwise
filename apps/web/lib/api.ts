// ============================================
// Axios API Client
// ============================================
// Single instance used for ALL backend calls.
// Automatically attaches JWT token and handles
// 401 errors globally (redirects to login).
// ============================================

import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
})

// ── Request interceptor ───────────────────────────────
// Attaches JWT token to every outgoing request
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('spendwise_token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

// ── Response interceptor ──────────────────────────────
// Handles auth expiry globally
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('spendwise_token')
            if (token) config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config

        // Auth expired — redirect to login (existing behavior)
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('spendwise_token')
                document.cookie = 'spendwise_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
                window.location.href = '/login'
            }
            return Promise.reject(error)
        }

        // Network error (no response at all) — retry once automatically
        // This handles brief wifi blips without bothering the user
        if (!error.response && !config._retried) {
            config._retried = true
            await new Promise(resolve => setTimeout(resolve, 1000)) // wait 1s
            return api(config)
        }

        // Attach a friendly message for the UI to use
        if (!error.response) {
            error.friendlyMessage = 'Cannot reach the server. Please check your connection.'
        } else if (error.response.status >= 500) {
            error.friendlyMessage = 'Server error. Please try again in a moment.'
        } else {
            error.friendlyMessage = error.response.data?.message || 'Something went wrong.'
        }

        return Promise.reject(error)
    }
)

export default api