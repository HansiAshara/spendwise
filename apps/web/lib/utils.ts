// ============================================
// Utility / Helper Functions
// ============================================
// Shared helpers used across the whole frontend.
// One place to change formatting logic.
// ============================================

import { Category, AlertStatus } from '@/types'

type ClassValue = string | number | boolean | null | undefined | ClassValue[]

// ── Class name merger ─────────────────────────────────
// Combines Tailwind classes safely
// Usage: cn('base-class', isActive && 'active-class')
// Simple class name merger — no external dependency needed
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ')
}

// ── Currency formatter ────────────────────────────────
// e.g. 1500 → "LKR 1,500.00"
export function formatLKR(amount: number): string {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)
}

// Short format — e.g. 1500 → "LKR 1,500"
export function formatLKRShort(amount: number): string {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

// Compact format — e.g. 150000 → "LKR 150K"
export function formatLKRCompact(amount: number): string {
    if (amount >= 1_000_000) return `LKR ${(amount / 1_000_000).toFixed(1)}M`
    if (amount >= 1_000) return `LKR ${(amount / 1_000).toFixed(0)}K`
    return `LKR ${amount.toFixed(0)}`
}

// ── Date formatters ───────────────────────────────────
// e.g. "2025-05-01" → "01 May 2025"
export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

// e.g. "2025-05-01" → "01 May"
export function formatDateShort(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
    })
}

// e.g. "2025-05-01T12:00" → "Today, 12:00 PM"
export function formatDateRelative(dateStr: string): string {
    const date = new Date(dateStr)
    const today = new Date()
    const diff = today.getDate() - date.getDate()

    const time = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })

    if (diff === 0) return `Today, ${time}`
    if (diff === 1) return `Yesterday, ${time}`
    return formatDate(dateStr)
}

// ── Month helpers ─────────────────────────────────────
// e.g. 5 → "May"
export function getMonthName(month: number): string {
    return new Date(2025, month - 1, 1).toLocaleDateString('en-US', {
        month: 'long',
    })
}

// e.g. 5 → "May '25"
export function getMonthShort(month: number, year: number): string {
    return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
    })
}

export function getCurrentMonthYear() {
    const now = new Date()
    return { month: now.getMonth() + 1, year: now.getFullYear() }
}

// ── Budget / alert helpers ────────────────────────────
// Returns Tailwind class for progress bar color
export function getProgressColor(status: AlertStatus): string {
    switch (status) {
        case 'danger': return 'progress-fill-danger'
        case 'warning': return 'progress-fill-warning'
        default: return 'progress-fill-safe'
    }
}

// Returns Tailwind badge class based on alert status
export function getAlertBadgeClass(status: AlertStatus): string {
    switch (status) {
        case 'danger': return 'badge-danger'
        case 'warning': return 'badge-warning'
        default: return 'badge-success'
    }
}

// Returns text label for alert status
export function getAlertLabel(status: AlertStatus, percentage: number): string {
    if (status === 'danger') return `${percentage}% — Over budget`
    if (status === 'warning') return `${percentage}% — Getting close`
    return `${percentage}% — On track`
}

// ── Category helpers ──────────────────────────────────
// Sort categories by display order (education first)
export function sortCategories(categories: Category[]): Category[] {
    return [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

// Returns bg color style for category icon circle
export function getCategoryBgColor(color: string): string {
    return `${color}18` // adds 10% opacity — e.g. #6366F118
}

// ── String helpers ────────────────────────────────────
// Truncate long strings
export function truncate(text: string, max = 40): string {
    return text.length <= max ? text : text.slice(0, max) + '…'
}

// Capitalize first letter
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Get user initials for avatar
// e.g. "Kasun Perera" → "KP"
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

// ── Number helpers ────────────────────────────────────
// e.g. 1500 → "1,500"
export function formatNumber(n: number): string {
    return new Intl.NumberFormat('en-US').format(n)
}

// ── Percentage helper ─────────────────────────────────
export function formatPercent(value: number, total: number): string {
    if (total === 0) return '0%'
    return `${Math.round((value / total) * 100)}%`
}