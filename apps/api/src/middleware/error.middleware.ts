//Catches any unhandled errors across the whole app

// ============================================
// Global Error Handler Middleware
// ============================================
// This is the LAST middleware in the chain.
// Any error thrown anywhere in the app lands here.
//
// Instead of crashing the server or sending ugly
// error messages, this catches everything and
// returns a clean, consistent error response.
//
// Usage: app.use(errorHandler) — must be LAST in index.ts
// ============================================

import { Request, Response, NextFunction } from 'express'
import { env } from '../config/env'

// Express identifies error handlers by having 4 parameters
// The first parameter MUST be named 'err'
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // Log the full error in terminal for debugging
    console.error('❌ Unhandled Error:', err)

    // In development, send the full error stack trace
    // In production, hide internal details from users
    const response = {
        success: false,
        message: err.message || 'Internal server error',
        // Only show stack trace in development mode
        ...(env.isDev && { stack: err.stack }),
    }

    // Most unhandled errors are 500 Internal Server Error
    res.status(500).json(response)
}

// ── 404 Handler ──────────────────────────────────────
// If no route matched, send a clear 404 response
// Usage: app.use(notFoundHandler) — after all routes
export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.url}`,
    })
}