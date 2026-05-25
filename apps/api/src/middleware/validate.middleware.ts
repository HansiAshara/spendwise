// ============================================
// Request Validation Middleware
// ============================================
// Before any controller runs, we validate the
// incoming request body against a Zod schema.
//
// If validation fails → return 400 with clear errors
// If validation passes → clean data goes to controller
//
// Example usage in routes:
//   router.post('/register', validate(registerSchema), register)
//
// This means controllers always receive clean,
// typed data — no need to check inside controllers.
// ============================================

import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { sendError } from '../utils/response'

// Takes a Zod schema and returns an Express middleware
// The middleware validates req.body against that schema
export function validate(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Parse and validate the request body
            // safeParse returns { success, data, error } instead of throwing
            const result = schema.safeParse(req.body)

            if (!result.success) {
                // Validation failed — format Zod issues into readable messages
                const errors = result.error.issues.map((err) => ({
                    field: err.path.join('.'),   // which field failed e.g. "email"
                    message: err.message,        // what's wrong e.g. "Invalid email"
                }))

                sendError(res, 'Validation failed', 422, errors)
                return
            }

            // Validation passed — replace req.body with the clean parsed data
            // Zod also strips out any extra fields the user sent
            req.body = result.data

            // Continue to the controller
            next()

        } catch (error) {
            sendError(res, 'Validation error', 422)
        }
    }
}