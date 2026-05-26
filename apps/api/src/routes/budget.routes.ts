// ============================================
// Budget Routes
// ============================================
// ALL routes protected — must be logged in.
// ============================================

import { Router } from 'express'
import { protect } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { createBudgetSchema, updateBudgetSchema } from '../validators/budget.validator'
import * as BudgetController from '../controllers/budget.controller'

const router = Router()

// Protect all budget routes
router.use(protect)

// GET    /api/budgets?month=5&year=2025
router.get('/', BudgetController.getBudgets)

// POST   /api/budgets
router.post(
    '/',
    validate(createBudgetSchema),
    BudgetController.createBudget
)

// PUT    /api/budgets/:id
router.put(
    '/:id',
    validate(updateBudgetSchema),
    BudgetController.updateBudget
)

// DELETE /api/budgets/:id
router.delete('/:id', BudgetController.deleteBudget)

export default router