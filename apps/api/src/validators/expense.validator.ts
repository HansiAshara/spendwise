// ============================================
// Expense Validators
// ============================================
// Zod schemas that validate expense data before
// it reaches the controller.
//
// Every expense must have:
//   - amount    : positive number (LKR)
//   - categoryId: valid category
//   - date      : valid date string
//   - note      : optional description
// ============================================

import { z } from 'zod'

// ── Create Expense Schema ─────────────────────────────
// Rules for POST /api/expenses
export const createExpenseSchema = z.object({
    amount: z
        .number({ error: 'Amount is required' })
        .positive('Amount must be greater than 0')
        .multipleOf(0.01, 'Amount can have at most 2 decimal places'),
    // e.g. 1500.50 is valid, 1500.555 is not

    categoryId: z
        .number({ error: 'Category is required' })
        .int('Category ID must be a whole number')
        .positive('Please select a valid category'),

    date: z
        .string({ error: 'Date is required' })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: 'Please provide a valid date',
        }),
    // We accept date as string e.g. "2025-05-01"
    // and convert it to Date object in the service

    note: z
        .string()
        .max(255, 'Note must be less than 255 characters')
        .trim()
        .optional(), // note is optional
})

// ── Update Expense Schema ─────────────────────────────
// Rules for PUT /api/expenses/:id
// All fields optional — user can update just one field
export const updateExpenseSchema = z.object({
    amount: z
        .number()
        .positive('Amount must be greater than 0')
        .multipleOf(0.01)
        .optional(),

    categoryId: z
        .number()
        .int()
        .positive()
        .optional(),

    date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: 'Please provide a valid date',
        })
        .optional(),

    note: z
        .string()
        .max(255)
        .trim()
        .optional(),
})

// ── Expense Filter Schema ─────────────────────────────
// Rules for query params: GET /api/expenses?month=5&year=2025
// These come from URL query string, not request body
export const expenseFilterSchema = z.object({
    month: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : undefined)),
    // converts "5" string to 5 number

    year: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : undefined)),

    categoryId: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : undefined)),

    startDate: z.string().optional(), // filter by date range
    endDate: z.string().optional(),
})

// TypeScript types from schemas
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>
export type ExpenseFilter = z.infer<typeof expenseFilterSchema>