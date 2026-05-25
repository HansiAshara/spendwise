// ============================================
// Auth Validators
// ============================================
// Zod schemas that define what valid data looks
// like for auth endpoints.
//
// If request body doesn't match these rules,
// validate middleware rejects it with 422 and
// clear error messages before controller runs.
// ============================================

import { z } from 'zod'

// ── Register Schema ──────────────────────────────────
// Rules for POST /api/auth/register
export const registerSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .trim(), // remove leading/trailing spaces

    email: z
        .string()
        .email('Please provide a valid email address')
        .toLowerCase() // store emails in lowercase always
        .trim(),

    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password is too long'),
}).strict()

// ── Login Schema ─────────────────────────────────────
// Rules for POST /api/auth/login
export const loginSchema = z.object({
    email: z
        .string()
        .email('Please provide a valid email address')
        .toLowerCase()
        .trim(),

    password: z
        .string()
        .min(1, 'Password is required'), // just check not empty
}).strict()

// ── Update Profile Schema ────────────────────────────
// Rules for PATCH /api/auth/me (used in settings page)
export const updateProfileSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name is too long')
        .trim()
        .optional(), // optional — user might only update email

    email: z
        .string()
        .email('Please provide a valid email address')
        .toLowerCase()
        .trim()
        .optional(),
})

// Export TypeScript types inferred from schemas
// Use these types in controllers and services
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>