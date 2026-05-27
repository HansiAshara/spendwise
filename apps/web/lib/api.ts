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
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('spendwise_token')
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api