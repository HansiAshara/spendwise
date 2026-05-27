// ============================================
// Global TypeScript Types
// ============================================
// All shared interfaces used across the frontend.
// Matches exactly what our backend API returns.
// ============================================

// ── User ──────────────────────────────────────────────
export interface User {
    id: number
    name: string
    email: string
    currency: string   // "LKR" default
    createdAt: string
}

// ── Category ──────────────────────────────────────────
export interface Category {
    id: number
    name: string
    icon: string
    color: string
    order: number
}

// ── Expense ───────────────────────────────────────────
export interface Expense {
    id: number
    amount: number
    note: string | null
    date: string
    createdAt: string
    userId: number
    categoryId: number
    category: Category
}

// ── Budget ────────────────────────────────────────────
export interface Budget {
    id: number
    amount: number
    month: number
    year: number
    userId: number
    categoryId: number
    category: Category
    // Calculated by backend service
    spent: number
    remaining: number
    percentage: number
    alertStatus: 'safe' | 'warning' | 'danger'
}

// ── Analytics ─────────────────────────────────────────
export interface CategorySummary {
    categoryId: number
    categoryName: string
    icon: string
    color: string
    spent: number
    budget: number
    percentage: number
    count: number
}

export interface MonthlyTrend {
    month: number
    year: number
    label: string   // "Jan 25"
    total: number
    count: number
}

export interface DailySpending {
    date: string
    label: string
    total: number
    cumulative: number
}

export interface DashboardData {
    currentMonth: {
        month: number
        year: number
        totalSpent: number
        expenseCount: number
        topCategory: CategorySummary | null
        budgetAlerts: number
    }
    categorySummary: CategorySummary[]
    monthlyTrend: MonthlyTrend[]
    dailySpending: DailySpending[]
}

// ── API Response wrapper ───────────────────────────────
// Every backend endpoint returns this shape
export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}

// ── Form input types ───────────────────────────────────
export interface LoginInput {
    email: string
    password: string
}

export interface RegisterInput {
    name: string
    email: string
    password: string
}

export interface CreateExpenseInput {
    amount: number
    categoryId: number
    date: string
    note?: string
}

export interface UpdateExpenseInput {
    amount?: number
    categoryId?: number
    date?: string
    note?: string
}

export interface CreateBudgetInput {
    amount: number
    categoryId: number
    month: number
    year: number
}

// ── UI State types ─────────────────────────────────────
export type AlertStatus = 'safe' | 'warning' | 'danger'
export type BtnVariant = 'primary' | 'outline' | 'ghost' | 'danger' | 'secondary'
export type BtnSize = 'sm' | 'md' | 'lg'