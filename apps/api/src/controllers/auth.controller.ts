//Controllers receive the HTTP request, call the service, and send the response


// ============================================
// Auth Controller
// ============================================
// Handles HTTP requests for auth endpoints.
//
// Controller responsibilities:
//   1. Extract data from req.body / req.user
//   2. Call the appropriate service function
//   3. Send success or error response
//
// Controller does NOT:
//   - Contain business logic
//   - Query the database directly
//   - Know about hashing or JWT internals
// ============================================

import { Request, Response } from 'express'
import * as AuthService from '../services/auth.service'
import { sendSuccess, sendError } from '../utils/response'

// ── Register ─────────────────────────────────────────
// POST /api/auth/register
// Creates new account, returns user + token
export async function register(req: Request, res: Response): Promise<void> {
    try {
        // req.body is already validated by Zod middleware
        const { user, token } = await AuthService.registerUser(req.body)

        // 201 = Created (not 200 — we created a new resource)
        sendSuccess(res, { user, token }, 'Account created successfully', 201)

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed'

        // 409 = Conflict (email already exists)
        // 400 = Bad Request (other errors)
        const status = message.includes('already exists') ? 409 : 400
        sendError(res, message, status)
    }
}

// ── Login ────────────────────────────────────────────
// POST /api/auth/login
// Verifies credentials, returns user + token
export async function login(req: Request, res: Response): Promise<void> {
    try {
        const { user, token } = await AuthService.loginUser(req.body)

        sendSuccess(res, { user, token }, 'Login successful')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed'

        // 401 = Unauthorized (wrong credentials)
        sendError(res, message, 401)
    }
}

// ── Logout ───────────────────────────────────────────
// POST /api/auth/logout
// On the backend, logout just confirms success.
// The frontend is responsible for deleting the token.
// (We are using stateless JWT — no server-side sessions)
export async function logout(req: Request, res: Response): Promise<void> {
    // Nothing to do server-side with stateless JWT
    // Frontend will delete the token from storage
    sendSuccess(res, null, 'Logged out successfully')
}

// ── Get Current User ─────────────────────────────────
// GET /api/auth/me
// Returns the logged-in user's profile
// Protected route — requires valid JWT token
export async function getMe(req: Request, res: Response): Promise<void> {
    try {
        // req.user is set by the protect middleware
        // It contains userId from the JWT token
        const user = await AuthService.getCurrentUser(req.user!.userId)

        sendSuccess(res, { user }, 'User fetched successfully')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get user'
        sendError(res, message, 404)
    }
}

// ── Update Profile ───────────────────────────────────
// PATCH /api/auth/me
// Updates name or email from settings page
// Protected route — requires valid JWT token
export async function updateMe(req: Request, res: Response): Promise<void> {
    try {
        const user = await AuthService.updateProfile(req.user!.userId, req.body)

        sendSuccess(res, { user }, 'Profile updated successfully')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Update failed'
        const status = message.includes('already in use') ? 409 : 400
        sendError(res, message, status)
    }
}

// ── Change Password ───────────────────────────────────
// PATCH /api/auth/change-password
export async function changePassword(req: Request, res: Response): Promise<void> {
    try {
        const { currentPassword, newPassword } = req.body
        const result = await AuthService.changePassword(
            req.user!.userId, currentPassword, newPassword
        )
        sendSuccess(res, result, 'Password changed successfully')
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to change password'
        sendError(res, message, 400)
    }
}

// ── Update Currency ────────────────────────────────────
// PATCH /api/auth/currency
export async function updateCurrency(req: Request, res: Response): Promise<void> {
    try {
        const { currency } = req.body
        const user = await AuthService.updateCurrency(req.user!.userId, currency)
        sendSuccess(res, { user }, 'Currency updated successfully')
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update currency'
        sendError(res, message, 400)
    }
}

// ── Delete Account ─────────────────────────────────────
// DELETE /api/auth/me
export async function deleteAccount(req: Request, res: Response): Promise<void> {
    try {
        const { password } = req.body
        const result = await AuthService.deleteAccount(req.user!.userId, password)
        sendSuccess(res, result, 'Account deleted successfully')
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete account'
        sendError(res, message, 400)
    }
}

// ── Update Avatar ──────────────────────────────────────
export async function updateAvatar(req: Request, res: Response): Promise<void> {
    try {
        const { avatarUrl } = req.body
        const user = await AuthService.updateAvatar(req.user!.userId, avatarUrl)
        sendSuccess(res, { user }, 'Avatar updated successfully')
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update avatar'
        sendError(res, message, 400)
    }
}

// ── Update Notifications ────────────────────────────────
export async function updateNotifications(req: Request, res: Response): Promise<void> {
    try {
        const user = await AuthService.updateNotifications(req.user!.userId, req.body)
        sendSuccess(res, { user }, 'Notification preferences updated')
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update notifications'
        sendError(res, message, 400)
    }
}

// ── Get Account Stats ────────────────────────────────────
export async function getAccountStats(req: Request, res: Response): Promise<void> {
    try {
        const stats = await AuthService.getAccountStats(req.user!.userId)
        sendSuccess(res, stats, 'Stats fetched successfully')
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch stats'
        sendError(res, message, 400)
    }
}

// ── Forgot Password ────────────────────────────────────
export async function forgotPassword(req: Request, res: Response): Promise<void> {
    try {
        const result = await AuthService.forgotPassword(req.body.email)
        sendSuccess(res, result, result.message)
    } catch (error) {
        // Never reveal specific errors here — always a generic message
        sendSuccess(res, {}, 'If that email exists, a reset link has been sent')
    }
}

// ── Reset Password ─────────────────────────────────────
export async function resetPassword(req: Request, res: Response): Promise<void> {
    try {
        const { token, newPassword } = req.body
        const result = await AuthService.resetPassword(token, newPassword)
        sendSuccess(res, result, result.message)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to reset password'
        sendError(res, message, 400)
    }
}

// ── Check Email Exists ─────────────────────────────────
export async function checkEmail(req: Request, res: Response): Promise<void> {
    try {
        const email = req.body.email || req.query.email
        const result = await AuthService.checkEmailExists(String(email))
        sendSuccess(res, result)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to check email'
        sendError(res, message, 400)
    }
}
