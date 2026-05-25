//This protects routes — only logged-in users can access them

// ============================================
// Authentication Middleware
// ============================================
// This runs BEFORE protected route handlers.
// It checks if the request has a valid JWT token.
//
// How it works:
//   1. Frontend sends token in Authorization header
//      "Authorization: Bearer eyJhbGci..."
//   2. This middleware extracts and verifies the token
//   3. If valid → attaches userId to req, calls next()
//   4. If invalid → sends 401 Unauthorized immediately
//
// Usage: router.get('/expenses', protect, getExpenses)
//                                ^^^^^^^ add this to protect a route
// ============================================

import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { sendError } from '../utils/response'

// Extend Express Request type to include our user data
// This lets us do req.user.userId in any protected route
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number
                email: string
            }
        }
    }
}

// ── Protect Middleware ───────────────────────────────
// Add this to any route that requires login
export function protect(req: Request, res: Response, next: NextFunction): void {
    try {
        // Get the Authorization header
        // It should look like: "Bearer eyJhbGciOiJIUzI1NiJ9..."
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // No token provided at all
            sendError(res, 'Access denied. No token provided.', 401)
            return
        }

        // Extract just the token part (remove "Bearer " prefix)
        const token = authHeader.split(' ')[1]

        // Verify the token — throws error if invalid or expired
        const payload = verifyToken(token)

        // Attach user info to the request object
        // Now any route handler can access req.user.userId
        req.user = {
            userId: payload.userId,
            email: payload.email,
        }

        // Token is valid — continue to the actual route handler
        next()

    } catch (error) {
        // Token is invalid, expired, or tampered with
        sendError(res, 'Access denied. Invalid or expired token.', 401)
    }
}