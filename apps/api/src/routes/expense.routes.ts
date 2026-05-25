// ============================================
// Expense Routes
// ============================================
// ALL expense routes are protected.
// User must be logged in to access any of them.
//
// Notice: protect middleware is on EVERY route
// because you should never see another
// person's expenses.
// ============================================

import { Router } from 'express'
import { protect } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { createExpenseSchema, updateExpenseSchema } from '../validators/expense.validator'
import * as ExpenseController from '../controllers/expense.controller'

const router = Router()

// Apply protect middleware to ALL routes in this router
// This means every expense route requires a valid JWT
router.use(protect)

// ── GET /api/expenses/summary ─────────────────────────
// IMPORTANT: this must be BEFORE /:id route
// Otherwise Express thinks "summary" is an ID
router.get('/summary', ExpenseController.getExpenseSummary)

// ── GET /api/expenses ─────────────────────────────────
// Get all expenses with optional filters
// e.g. /api/expenses?month=5&year=2025&categoryId=1
router.get('/', ExpenseController.getExpenses)

// ── POST /api/expenses ────────────────────────────────
// Log a new expense
router.post(
    '/',
    validate(createExpenseSchema), // validate body first
    ExpenseController.createExpense
)

// ── GET /api/expenses/:id ─────────────────────────────
// Get a single expense by ID
router.get('/:id', ExpenseController.getExpense)

// ── PUT /api/expenses/:id ─────────────────────────────
// Update an expense
router.put(
    '/:id',
    validate(updateExpenseSchema),
    ExpenseController.updateExpense
)

// ── DELETE /api/expenses/:id ──────────────────────────
// Delete an expense
router.delete('/:id', ExpenseController.deleteExpense)

export default router