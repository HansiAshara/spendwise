/*Every API response will use the same format. 
This keeps things consistent and makes the frontend code simpler.*/

// ============================================
// Standard API Response Helpers
// ============================================
// Every route in SpendWise returns the same shape:
//   { success: true,  data: {...} }        ← success
//   { success: false, message: "..." }     ← error
//
// Using these helpers ensures consistency across
// all 14 API endpoints instead of writing the
// response shape manually every single time.
// ============================================

import { Response } from 'express'

// ── Success Response ─────────────────────────────────
// Use this when everything worked correctly
// Example: res.json(successResponse({ user, token }))
export function successResponse(data: unknown, message = 'Success') {
    return {
        success: true,
        message,
        data,
    }
}

// ── Error Response ───────────────────────────────────
// Use this when something went wrong
// Example: res.status(404).json(errorResponse('User not found'))
export function errorResponse(message: string, errors?: unknown) {
    return {
        success: false,
        message,
        // Only include errors field if there are validation errors
        ...(errors ? { errors } : {}),
    }
}

// ── Send Success ─────────────────────────────────────
// Shortcut to send a success response directly
// Example: sendSuccess(res, { user }, 'Login successful', 200)
export function sendSuccess(
    res: Response,
    data: unknown,
    message = 'Success',
    statusCode = 200
) {
    return res.status(statusCode).json(successResponse(data, message))
}

// ── Send Error ───────────────────────────────────────
// Shortcut to send an error response directly
// Example: sendError(res, 'Not found', 404)
export function sendError(
    res: Response,
    message: string,
    statusCode = 400,
    errors?: unknown
) {
    return res.status(statusCode).json(errorResponse(message, errors))
}