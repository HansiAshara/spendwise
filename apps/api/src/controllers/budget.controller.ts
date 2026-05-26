// ============================================
// Budget Controller
// ============================================
// Handles HTTP requests for budget endpoints.
// All routes are protected — user must be logged in.
// ============================================

import { Request, Response } from 'express'
import * as BudgetService from '../services/budget.service'
import { sendSuccess, sendError } from '../utils/response'

// ── Create Budget ─────────────────────────────────────
// POST /api/budgets
export async function createBudget(req: Request, res: Response): Promise<void> {
    try {
        const budget = await BudgetService.createBudget(
            req.user!.userId,
            req.body
        )
        sendSuccess(res, { budget }, 'Budget created successfully', 201)

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create budget'
        const status = message.includes('already exists') ? 409 : 400
        sendError(res, message, status)
    }
}

// ── Get All Budgets ───────────────────────────────────
// GET /api/budgets?month=5&year=2025
export async function getBudgets(req: Request, res: Response): Promise<void> {
    try {
        // Default to current month/year if not provided
        const now = new Date()
        const month = parseInt(req.query.month as string) || now.getMonth() + 1
        const year = parseInt(req.query.year as string) || now.getFullYear()

        const budgets = await BudgetService.getBudgets(
            req.user!.userId,
            month,
            year
        )

        sendSuccess(res, { budgets, month, year }, 'Budgets fetched successfully')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch budgets'
        sendError(res, message, 400)
    }
}

// ── Update Budget ─────────────────────────────────────
// PUT /api/budgets/:id
export async function updateBudget(req: Request, res: Response): Promise<void> {
    try {
        const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const budgetId = parseInt(idParam)

        if (isNaN(budgetId)) {
            sendError(res, 'Invalid budget ID', 400)
            return
        }

        const budget = await BudgetService.updateBudget(
            req.user!.userId,
            budgetId,
            req.body
        )

        sendSuccess(res, { budget }, 'Budget updated successfully')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update budget'
        const status = message.includes('not found') ? 404 : 400
        sendError(res, message, status)
    }
}

// ── Delete Budget ─────────────────────────────────────
// DELETE /api/budgets/:id
export async function deleteBudget(req: Request, res: Response): Promise<void> {
    try {
        const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const budgetId = parseInt(idParam)

        if (isNaN(budgetId)) {
            sendError(res, 'Invalid budget ID', 400)
            return
        }

        const result = await BudgetService.deleteBudget(
            req.user!.userId,
            budgetId
        )

        sendSuccess(res, result, 'Budget deleted successfully')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete budget'
        const status = message.includes('not found') ? 404 : 400
        sendError(res, message, status)
    }
} 