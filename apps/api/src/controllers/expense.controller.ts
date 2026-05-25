// ============================================
// Expense Controller
// ============================================
// Handles HTTP requests for expense endpoints.
// All routes are protected — req.user always exists.
//
// Controller only:
//   1. Extracts data from request
//   2. Calls service functions
//   3. Sends response
// ============================================

import { Request, Response } from 'express'
import * as ExpenseService from '../services/expense.service'
import { sendSuccess, sendError } from '../utils/response'
import { expenseFilterSchema } from '../validators/expense.validator'

// ── Create Expense ────────────────────────────────────
// POST /api/expenses
export async function createExpense(req: Request, res: Response): Promise<void> {
    try {
        const expense = await ExpenseService.createExpense(
            req.user!.userId, // from JWT token via protect middleware
            req.body          // already validated by Zod
        )

        sendSuccess(res, { expense }, 'Expense logged successfully', 201)

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create expense'
        sendError(res, message, 400)
    }
}

// ── Get All Expenses ──────────────────────────────────
// GET /api/expenses?month=5&year=2025&categoryId=1
export async function getExpenses(req: Request, res: Response): Promise<void> {
    try {
        // Validate and parse query string filters
        // Query params come as strings — schema transforms them to numbers
        const filters = expenseFilterSchema.parse(req.query)

        const result = await ExpenseService.getExpenses(
            req.user!.userId,
            filters
        )

        sendSuccess(res, result, 'Expenses fetched successfully')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch expenses'
        sendError(res, message, 400)
    }
}

// ── Get Single Expense ────────────────────────────────
// GET /api/expenses/:id
export async function getExpense(req: Request, res: Response): Promise<void> {
    try {
        // Get the ID from URL params and convert to number
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const expenseId = parseInt(String(rawId))

        if (isNaN(expenseId)) {
            sendError(res, 'Invalid expense ID', 400)
            return
        }

        const expense = await ExpenseService.getExpenseById(
            req.user!.userId,
            expenseId
        )

        sendSuccess(res, { expense }, 'Expense fetched successfully')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Expense not found'
        sendError(res, message, 404)
    }
}

// ── Update Expense ────────────────────────────────────
// PUT /api/expenses/:id
export async function updateExpense(req: Request, res: Response): Promise<void> {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const expenseId = parseInt(String(rawId))

        if (isNaN(expenseId)) {
            sendError(res, 'Invalid expense ID', 400)
            return
        }

        const expense = await ExpenseService.updateExpense(
            req.user!.userId,
            expenseId,
            req.body
        )

        sendSuccess(res, { expense }, 'Expense updated successfully')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update expense'
        const status = message.includes('not found') ? 404 : 400
        sendError(res, message, status)
    }
}

// ── Delete Expense ────────────────────────────────────
// DELETE /api/expenses/:id
export async function deleteExpense(req: Request, res: Response): Promise<void> {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const expenseId = parseInt(String(rawId))

        if (isNaN(expenseId)) {
            sendError(res, 'Invalid expense ID', 400)
            return
        }

        const result = await ExpenseService.deleteExpense(
            req.user!.userId,
            expenseId
        )

        sendSuccess(res, result, 'Expense deleted successfully')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete expense'
        const status = message.includes('not found') ? 404 : 400
        sendError(res, message, status)
    }
}

// ── Get Expense Summary ───────────────────────────────
// GET /api/expenses/summary?month=5&year=2025
export async function getExpenseSummary(req: Request, res: Response): Promise<void> {
    try {
        // Default to current month and year if not provided
        const now = new Date()
        const month = parseInt(req.query.month as string) || now.getMonth() + 1
        const year = parseInt(req.query.year as string) || now.getFullYear()

        const summary = await ExpenseService.getExpenseSummary(
            req.user!.userId,
            month,
            year
        )

        sendSuccess(res, summary, 'Summary fetched successfully')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch summary'
        sendError(res, message, 400)
    }
}