//Handles creating and verifying JWT tokens

// ============================================
// JWT (JSON Web Token) Utilities
// ============================================
// After login, we give the user a JWT token.
// This token proves who they are on every request.
//
// Flow:
//   1. User logs in with email + password
//   2. Server creates a JWT token containing userId
//   3. User sends this token with every API request
//   4. Server verifies the token to identify the user
//
// Tokens expire after 7 days — user must login again
// ============================================

import jwt from 'jsonwebtoken'
import { env } from '../config/env'

// This is the data we store inside the token
// Keep it minimal — only what we need to identify the user
export interface TokenPayload {
    userId: number   // which user this token belongs to
    email: string   // useful for logging/debugging
}

// ── Sign Token ───────────────────────────────────────
// Creates a new JWT token for a user after login
// Example: const token = signToken({ userId: 1, email: 'kasun@gmail.com' })
export function signToken(payload: TokenPayload): string {
    return jwt.sign(
        payload,
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn } as jwt.SignOptions
    )
}

// ── Verify Token ─────────────────────────────────────
// Checks if a token is valid and not expired
// Returns the payload (userId, email) if valid
// Throws an error if invalid or expired
// Example: const payload = verifyToken(token)
export function verifyToken(token: string): TokenPayload {
    return jwt.verify(token, env.jwtSecret) as TokenPayload
}