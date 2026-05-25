// ============================================
// Expense Service
// ============================================
// All business logic for expense management.
// This is the most important service in the app
// since expenses are the core data.
//
// Every function:
//   - Belongs to a specific user (userId filter)
//   - Users can ONLY see their own expenses
//   - Never returns another user's data
// ============================================

import prisma from '../config/database'
import { CreateExpenseInput, UpdateExpenseInput, ExpenseFilter } from '../validators/expense.validator'

// ── Create Expense ────────────────────────────────────
// Logs a new expense for the logged-in user
export async function createExpense(userId: number, data: CreateExpenseInput) {
    // First check if the category actually exists
    const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
    })

    if (!category) {
        throw new Error('Selected category does not exist')
    }

    // Create the expense linked to this user
    const expense = await prisma.expense.create({
        data: {
            amount: data.amount,
            categoryId: data.categoryId,
            date: new Date(data.date), // convert string to Date object
            note: data.note,
            userId,                          // always link to the logged-in user
        },
        // Include category details in the response
        // so frontend doesn't need a separate request
        include: {
            category: {
                select: { id: true, name: true, icon: true, color: true },
            },
        },
    })

    return expense
}

// ── Get All Expenses ──────────────────────────────────
// Returns all expenses for a user with optional filters
// Filters: month, year, categoryId, date range
export async function getExpenses(userId: number, filters: ExpenseFilter) {
    // Build the where clause dynamically based on filters
    // Start with userId — ALWAYS filter by user
    const where: any = { userId }

    // Filter by specific month and year
    if (filters.month && filters.year) {
        // Get the start and end of the selected month
        const startOfMonth = new Date(filters.year, filters.month - 1, 1)
        const endOfMonth = new Date(filters.year, filters.month, 0, 23, 59, 59)

        where.date = {
            gte: startOfMonth, // greater than or equal to start
            lte: endOfMonth,   // less than or equal to end
        }
    }

    // Filter by date range (if provided instead of month/year)
    if (filters.startDate && filters.endDate && !filters.month) {
        where.date = {
            gte: new Date(filters.startDate),
            lte: new Date(filters.endDate),
        }
    }

    // Filter by specific category
    if (filters.categoryId) {
        where.categoryId = filters.categoryId
    }

    // Fetch expenses with category details
    const expenses = await prisma.expense.findMany({
        where,
        include: {
            category: {
                select: { id: true, name: true, icon: true, color: true },
            },
        },
        orderBy: { date: 'desc' }, // newest first
    })

    // Calculate total amount for the filtered results
    const total = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
    )

    return {
        expenses,
        total,              // total spent in LKR for this filter
        count: expenses.length,
    }
}

// ── Get Single Expense ────────────────────────────────
// Fetches one expense by ID
// Ensures the expense belongs to the requesting user
export async function getExpenseById(userId: number, expenseId: number) {
    const expense = await prisma.expense.findFirst({
        where: {
            id: expenseId,
            userId,           // IMPORTANT: make sure it belongs to this user
        },
        include: {
            category: {
                select: { id: true, name: true, icon: true, color: true },
            },
        },
    })

    if (!expense) {
        // Either doesn't exist OR belongs to another user
        // We say "not found" in both cases for security
        throw new Error('Expense not found')
    }

    return expense
}

// ── Update Expense ────────────────────────────────────
// Updates an existing expense
// Only the owner can update their expense
export async function updateExpense(
    userId: number,
    expenseId: number,
    data: UpdateExpenseInput
) {
    // First verify this expense exists and belongs to user
    await getExpenseById(userId, expenseId)

    // If categoryId is being updated, verify new category exists
    if (data.categoryId) {
        const category = await prisma.category.findUnique({
            where: { id: data.categoryId },
        })
        if (!category) {
            throw new Error('Selected category does not exist')
        }
    }

    // Build update data object
    // Only include fields that were actually provided
    const updateData: any = {}
    if (data.amount !== undefined) updateData.amount = data.amount
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId
    if (data.note !== undefined) updateData.note = data.note
    if (data.date !== undefined) updateData.date = new Date(data.date)

    const updatedExpense = await prisma.expense.update({
        where: { id: expenseId },
        data: updateData,
        include: {
            category: {
                select: { id: true, name: true, icon: true, color: true },
            },
        },
    })

    return updatedExpense
}

// ── Delete Expense ────────────────────────────────────
// Deletes an expense permanently
// Only the owner can delete their expense
export async function deleteExpense(userId: number, expenseId: number) {
    // First verify this expense exists and belongs to user
    await getExpenseById(userId, expenseId)

    // Delete the expense
    await prisma.expense.delete({
        where: { id: expenseId },
    })

    // Return success message
    return { message: 'Expense deleted successfully' }
}

// ── Get Expense Summary ───────────────────────────────
// Returns total spent per category for a month
// Used by the dashboard and analytics
export async function getExpenseSummary(
    userId: number,
    month: number,
    year: number
) {
    // Get start and end of the month
    const startOfMonth = new Date(year, month - 1, 1)
    const endOfMonth = new Date(year, month, 0, 23, 59, 59)

    // Fetch all expenses for this month
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

    // Group expenses by category and sum amounts
    // e.g. { Food: 15000, Transport: 5000 }
    const summaryMap: Record<string, {
        categoryId: number
        categoryName: string
        icon: string
        color: string
        total: number
        count: number
    }> = {}

    for (const expense of expenses) {
        const key = expense.category.name

        if (!summaryMap[key]) {
            // First expense in this category — initialize
            summaryMap[key] = {
                categoryId: expense.category.id,
                categoryName: expense.category.name,
                icon: expense.category.icon,
                color: expense.category.color,
                total: 0,
                count: 0,
            }
        }

        // Add amount to category total
        summaryMap[key].total += Number(expense.amount)
        summaryMap[key].count += 1
    }

    // Convert map to array and sort by total (highest first)
    const summary = Object.values(summaryMap).sort(
        (a, b) => b.total - a.total
    )

    // Calculate grand total for the month
    const grandTotal = summary.reduce((sum, item) => sum + item.total, 0)

    return {
        summary,
        grandTotal,
        month,
        year,
    }
}