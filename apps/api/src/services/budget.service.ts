// ============================================
// Budget Service
// ============================================
// Business logic for budget management.
//
// Key concept — Budget Alert:
//   When user spends more than 80% of their
//   budget in a category, we flag it as a warning.
//   When they hit 100%, we flag it as danger.
//
//   spent / budget * 100 = percentage
//   e.g. 12000 / 15000 * 100 = 80% ⚠️
// ============================================

import prisma from '../config/database'
import { CreateBudgetInput, UpdateBudgetInput } from '../validators/budget.validator'

// ── Create Budget ─────────────────────────────────────
// Creates a monthly budget for a category
export async function createBudget(userId: number, data: CreateBudgetInput) {
    // Check if category exists
    const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
    })

    if (!category) {
        throw new Error('Selected category does not exist')
    }

    // Check if budget already exists for this category/month/year
    // DB has a unique constraint but we give a better error message
    const existing = await prisma.budget.findUnique({
        where: {
            userId_categoryId_month_year: {
                userId,
                categoryId: data.categoryId,
                month: data.month,
                year: data.year,
            },
        },
    })

    if (existing) {
        throw new Error(
            `A budget for ${category.name} in this month already exists. Update it instead.`
        )
    }

    // Create the budget
    const budget = await prisma.budget.create({
        data: {
            amount: data.amount,
            categoryId: data.categoryId,
            month: data.month,
            year: data.year,
            userId,
        },
        include: {
            category: {
                select: { id: true, name: true, icon: true, color: true },
            },
        },
    })

    return budget
}

// ── Get All Budgets ───────────────────────────────────
// Returns budgets for a month WITH how much was spent
// This is what the budgets page uses to show progress bars
export async function getBudgets(
    userId: number,
    month: number,
    year: number
) {
    // Fetch all budgets for this month
    const budgets = await prisma.budget.findMany({
        where: { userId, month, year },
        include: {
            category: {
                select: { id: true, name: true, icon: true, color: true },
            },
        },
        orderBy: { category: { name: 'asc' } },
    })

    // For each budget, calculate how much has been spent
    // We need to query expenses for the same month/year/category
    const startOfMonth = new Date(year, month - 1, 1)
    const endOfMonth = new Date(year, month, 0, 23, 59, 59)

    // Enrich each budget with spending data
    const budgetsWithSpending = await Promise.all(
        budgets.map(async (budget) => {
            // Sum all expenses for this category in this month
            const expenses = await prisma.expense.aggregate({
                where: {
                    userId,
                    categoryId: budget.categoryId,
                    date: { gte: startOfMonth, lte: endOfMonth },
                },
                _sum: { amount: true }, // SQL SUM() function
            })

            const spent = Number(expenses._sum.amount) || 0
            const budgetAmt = Number(budget.amount)
            const percentage = budgetAmt > 0
                ? Math.round((spent / budgetAmt) * 100)
                : 0

            // Determine alert status based on percentage
            // This drives the color of the progress bar on frontend
            let alertStatus: 'safe' | 'warning' | 'danger' = 'safe'
            if (percentage >= 100) alertStatus = 'danger'   // red  — over budget
            else if (percentage >= 80) alertStatus = 'warning' // yellow — close to limit

            return {
                ...budget,
                spent,                    // how much spent in LKR
                remaining: Math.max(0, budgetAmt - spent), // remaining in LKR
                percentage,               // 0-100+ percentage used
                alertStatus,              // safe / warning / danger
            }
        })
    )

    return budgetsWithSpending
}

// ── Get Single Budget ─────────────────────────────────
export async function getBudgetById(userId: number, budgetId: number) {
    const budget = await prisma.budget.findFirst({
        where: { id: budgetId, userId }, // must belong to this user
        include: {
            category: {
                select: { id: true, name: true, icon: true, color: true },
            },
        },
    })

    if (!budget) {
        throw new Error('Budget not found')
    }

    return budget
}

// ── Update Budget ─────────────────────────────────────
// Only updates the amount — category/month/year stay same
export async function updateBudget(
    userId: number,
    budgetId: number,
    data: UpdateBudgetInput
) {
    // Verify ownership
    await getBudgetById(userId, budgetId)

    const updated = await prisma.budget.update({
        where: { id: budgetId },
        data: { amount: data.amount },
        include: {
            category: {
                select: { id: true, name: true, icon: true, color: true },
            },
        },
    })

    return updated
}

// ── Delete Budget ─────────────────────────────────────
export async function deleteBudget(userId: number, budgetId: number) {
    // Verify ownership
    await getBudgetById(userId, budgetId)

    await prisma.budget.delete({
        where: { id: budgetId },
    })

    return { message: 'Budget deleted successfully' }
}