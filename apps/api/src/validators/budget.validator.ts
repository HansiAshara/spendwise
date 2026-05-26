// ============================================
// Budget Validators
// ============================================
// Validates budget data before reaching controller.
//
// A budget is:
//   - A spending limit per category per month
//   - e.g. Food: 15000 LKR for May 2025
//   - Each user can have ONE budget per category
//     per month (enforced by DB unique constraint)
// ============================================

import { z } from 'zod'

// ── Create Budget Schema ──────────────────────────────
// Rules for POST /api/budgets
export const createBudgetSchema = z.object({
    amount: z
        .number({ error: 'Budget amount is required' })
        .positive('Budget amount must be greater than 0')
        .multipleOf(0.01, 'Amount can have at most 2 decimal places'),

    categoryId: z
        .number({ error: 'Category is required' })
        .int('Category ID must be a whole number')
        .positive('Please select a valid category'),

    month: z
        .number({ error: 'Month is required' })
        .int('Month must be a whole number')
        .min(1, 'Month must be between 1 and 12')
        .max(12, 'Month must be between 1 and 12'),
    // 1 = January, 12 = December

    year: z
        .number({ error: 'Year is required' })
        .int('Year must be a whole number')
        .min(2024, 'Year must be 2024 or later')
        .max(2100, 'Invalid year'),
})

// ── Update Budget Schema ──────────────────────────────
// Rules for PUT /api/budgets/:id
// Only amount can be updated — category/month/year stay same
export const updateBudgetSchema = z.object({
    amount: z
        .number({ error: 'Budget amount is required' })
        .positive('Budget amount must be greater than 0')
        .multipleOf(0.01),
})

// TypeScript types
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>