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

// ── Change Password Schema ───────────────────────────
export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, 'Current password is required'),

    newPassword: z
        .string()
        .min(6, 'New password must be at least 6 characters')
        .max(100, 'Password is too long'),
})

// ── Delete Account Schema ────────────────────────────
export const deleteAccountSchema = z.object({
    password: z
        .string()
        .min(1, 'Password is required'),
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>

// Export TypeScript types inferred from schemas
// Use these types in controllers and services
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// ── Avatar Schema ─────────────────────────────────────
export const updateAvatarSchema = z.object({
    avatarUrl: z.string().min(1, 'Avatar image is required'),
})

// ── Notification Preferences Schema ───────────────────
export const updateNotificationsSchema = z.object({
    notifyBudgetAlerts: z.boolean(),
    notifyWeeklySummary: z.boolean(),
    notifyMonthlyReport: z.boolean(),
})

export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>
export type UpdateNotificationsInput = z.infer<typeof updateNotificationsSchema>

// ── Forgot Password Schema ────────────────────────────
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .email('Please provide a valid email address')
        .toLowerCase()
        .trim(),
})

// ── Reset Password Schema ─────────────────────────────
export const resetPasswordSchema = z.object({
    token: z
        .string()
        .min(1, 'Reset token is required'),
    newPassword: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password is too long'),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>