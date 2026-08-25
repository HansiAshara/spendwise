// ============================================
// Auth Routes
// ============================================
// Registers all authentication endpoints.
//
// Pattern for each route:
//   router.METHOD('path', ...middleware, controller)
//
// Public routes  → no protect middleware
// Protected routes → protect middleware runs first
// ============================================

import { Router } from 'express'
import { validate } from '../middleware/validate.middleware'
import { protect } from '../middleware/auth.middleware'
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema, deleteAccountSchema, updateAvatarSchema, updateNotificationsSchema, forgotPasswordSchema, resetPasswordSchema, } from '../validators/auth.validator'
import * as AuthController from '../controllers/auth.controller'

const router = Router()

// ── Public Routes ────────────────────────────────────
// These don't require a JWT token

// POST /api/auth/register
// validate(registerSchema) runs first — rejects bad data
// then register controller runs if data is valid
router.post(
    '/register',
    validate(registerSchema),   // 1. validate request body
    AuthController.register     // 2. run controller
)

// POST /api/auth/login
router.post(
    '/login',
    validate(loginSchema),      // 1. validate request body
    AuthController.login        // 2. run controller
)

// POST /api/auth/logout
// No validation needed — just confirm logout
router.post('/logout', AuthController.logout)

// ── Protected Routes ─────────────────────────────────
// These require a valid JWT token in Authorization header

// GET /api/auth/me — get current user profile
router.get(
    '/me',
    protect,                    // 1. verify JWT token
    AuthController.getMe        // 2. run controller
)

// PATCH /api/auth/me — update profile (settings page)
router.patch(
    '/me',
    protect,                          // 1. verify JWT token
    validate(updateProfileSchema),    // 2. validate body
    AuthController.updateMe           // 3. run controller
)

// PATCH /api/auth/change-password
router.patch(
    '/change-password',
    protect,
    validate(changePasswordSchema),
    AuthController.changePassword
)

// PATCH /api/auth/currency
router.patch(
    '/currency',
    protect,
    AuthController.updateCurrency
)

// DELETE /api/auth/me
router.delete(
    '/me',
    protect,
    validate(deleteAccountSchema),
    AuthController.deleteAccount
)

router.patch(
    '/avatar',
    protect,
    validate(updateAvatarSchema),
    AuthController.updateAvatar
)

router.patch(
    '/notifications',
    protect,
    validate(updateNotificationsSchema),
    AuthController.updateNotifications
)

router.get(
    '/stats',
    protect,
    AuthController.getAccountStats
)

router.post(
    '/forgot-password',
    validate(forgotPasswordSchema),
    AuthController.forgotPassword
)

router.post(
    '/reset-password',
    validate(resetPasswordSchema),
    AuthController.resetPassword
)

export default router