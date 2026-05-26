// ============================================
// Analytics Service
// ============================================
// Powers all 3 charts on the dashboard:
//
//   1. Pie Chart    → spending by category this month
//   2. Bar Chart    → last 6 months total spending
//   3. Trend Line   → daily spending this month
//
// All data is in LKR and filtered per user.
// ============================================

import prisma from '../config/database'

// ── Category Summary ──────────────────────────────────
// Data for the PIE CHART
// Returns total spent per category for a month
// e.g. Food: 15000, Transport: 8000, Education: 5000
export async function getCategorySummary(
    userId: number,
    month: number,
    year: number
) {
    const startOfMonth = new Date(year, month - 1, 1)
    const endOfMonth = new Date(year, month, 0, 23, 59, 59)

    // Fetch all expenses for this month with categories
    const expenses = await prisma.expense.findMany({
        where: {
            userId,
            date: { gte: startOfMonth, lte: endOfMonth },
        },
        include: {
            category: {
                select: { id: true, name: true, icon: true, color: true },
            },
        },
    })

    // Also fetch budgets for the same month
    // So we can show spent vs budget on each category
    const budgets = await prisma.budget.findMany({
        where: { userId, month, year },
    })

    // Build a map of categoryId → budget amount
    const budgetMap: Record<number, number> = {}
    for (const budget of budgets) {
        budgetMap[budget.categoryId] = Number(budget.amount)
    }

    // Group expenses by category
    const categoryMap: Record<string, {
        categoryId: number
        categoryName: string
        icon: string
        color: string
        spent: number
        budget: number   // 0 if no budget set
        percentage: number   // spent/budget * 100
        count: number   // number of transactions
    }> = {}

    for (const expense of expenses) {
        const key = expense.category.name

        if (!categoryMap[key]) {
            const budgetAmt = budgetMap[expense.categoryId] || 0
            categoryMap[key] = {
                categoryId: expense.category.id,
                categoryName: expense.category.name,
                icon: expense.category.icon,
                color: expense.category.color,
                spent: 0,
                budget: budgetAmt,
                percentage: 0,
                count: 0,
            }
        }

        categoryMap[key].spent += Number(expense.amount)
        categoryMap[key].count += 1
    }

    // Calculate percentage for each category
    for (const key of Object.keys(categoryMap)) {
        const cat = categoryMap[key]
        if (cat.budget > 0) {
            cat.percentage = Math.round((cat.spent / cat.budget) * 100)
        }
    }

    // Sort by spent amount — highest first
    const summary = Object.values(categoryMap).sort(
        (a, b) => b.spent - a.spent
    )

    const grandTotal = summary.reduce((sum, cat) => sum + cat.spent, 0)

    return { summary, grandTotal, month, year }
}

// ── Monthly Trend ─────────────────────────────────────
// Data for the BAR CHART
// Returns total spending for last 6 months
// e.g. Dec: 45000, Jan: 52000, Feb: 38000 ...
export async function getMonthlyTrend(userId: number) {
    // Get the last 6 months including current month
    const months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
        // Go back i months from today
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        months.push({
            month: date.getMonth() + 1, // 1-12
            year: date.getFullYear(),
            // Label for the chart: "Jan", "Feb" etc.
            label: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        })
    }

    // For each month, calculate total spending
    const trend = await Promise.all(
        months.map(async ({ month, year, label }) => {
            const startOfMonth = new Date(year, month - 1, 1)
            const endOfMonth = new Date(year, month, 0, 23, 59, 59)

            // Sum all expenses for this month
            const result = await prisma.expense.aggregate({
                where: {
                    userId,
                    date: { gte: startOfMonth, lte: endOfMonth },
                },
                _sum: { amount: true },
                _count: { id: true },
            })

            return {
                month,
                year,
                label,                                    // "Jan 25"
                total: Number(result._sum.amount) || 0,   // total LKR spent
                count: result._count.id,                  // number of expenses
            }
        })
    )

    return trend
}

// ── Daily Spending ────────────────────────────────────
// Data for the TREND LINE CHART
// Returns spending for each day of the current month
// e.g. May 1: 1500, May 2: 0, May 3: 3200 ...
export async function getDailySpending(
    userId: number,
    month: number,
    year: number
) {
    const startOfMonth = new Date(year, month - 1, 1)
    const endOfMonth = new Date(year, month, 0, 23, 59, 59)

    // Fetch all expenses for this month
    const expenses = await prisma.expense.findMany({
        where: {
            userId,
            date: { gte: startOfMonth, lte: endOfMonth },
        },
        select: { amount: true, date: true },
        orderBy: { date: 'asc' },
    })

    // Build a map of day → total spent
    // e.g. { "2025-05-01": 1500, "2025-05-03": 3200 }
    const dailyMap: Record<string, number> = {}

    for (const expense of expenses) {
        // Format date as YYYY-MM-DD key
        const day = expense.date.toISOString().split('T')[0]
        dailyMap[day] = (dailyMap[day] || 0) + Number(expense.amount)
    }

    // Generate all days in the month (even days with 0 spending)
    // This ensures the chart line is continuous
    const daysInMonth = new Date(year, month, 0).getDate()
    const daily = []

    for (let day = 1; day <= daysInMonth; day++) {
        // Format as YYYY-MM-DD
        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const label = `${day} ${new Date(year, month - 1, day)
            .toLocaleDateString('en-US', { month: 'short' })}`

        daily.push({
            date: dateKey,
            label,                              // "1 May", "2 May"
            total: dailyMap[dateKey] || 0,      // 0 if no spending that day
        })
    }

    // Calculate running total (cumulative spending)
    // Useful for showing "total so far this month" on the chart
    let runningTotal = 0
    const dailyWithCumulative = daily.map((day) => {
        runningTotal += day.total
        return { ...day, cumulative: runningTotal }
    })

    return dailyWithCumulative
}

// ── Dashboard Summary ─────────────────────────────────
// Single endpoint that returns ALL dashboard data
// Reduces multiple API calls to just ONE from frontend
export async function getDashboardSummary(userId: number) {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    // Run all queries in parallel for speed
    // Promise.all runs them simultaneously instead of one by one
    const [categorySummary, monthlyTrend, dailySpending, budgets] =
        await Promise.all([
            getCategorySummary(userId, month, year),
            getMonthlyTrend(userId),
            getDailySpending(userId, month, year),
            prisma.budget.findMany({
                where: { userId, month, year },
                include: {
                    category: {
                        select: { id: true, name: true, icon: true, color: true },
                    },
                },
            }),
        ])

    // Count how many budgets are in warning or danger
    const alertCount = budgets.filter(async (b) => {
        const startOfMonth = new Date(year, month - 1, 1)
        const endOfMonth = new Date(year, month, 0, 23, 59, 59)
        const spent = await prisma.expense.aggregate({
            where: {
                userId,
                categoryId: b.categoryId,
                date: { gte: startOfMonth, lte: endOfMonth },
            },
            _sum: { amount: true },
        })
        const pct = Number(spent._sum.amount) / Number(b.amount) * 100
        return pct >= 80
    }).length

    return {
        currentMonth: {
            month,
            year,
            totalSpent: categorySummary.grandTotal,
            expenseCount: categorySummary.summary.reduce((s, c) => s + c.count, 0),
            topCategory: categorySummary.summary[0] || null,
            budgetAlerts: alertCount,
        },
        categorySummary: categorySummary.summary,  // pie chart data
        monthlyTrend,                               // bar chart data
        dailySpending,                              // trend line data
    }
}