//This file validates all environment variables when the server starts

// ============================================
// Environment Variable Validator
// ============================================
// This runs at startup and checks all required
// env vars exist. If any are missing, the server
// stops immediately with a clear error message.
// Much better than getting mysterious errors later.
// ============================================

import dotenv from 'dotenv'
dotenv.config()

// Helper function that checks if a variable exists
// and returns it — if missing, throws a clear error
function requireEnv(name: string): string {
    const value = process.env[name]

    if (!value) {
        // Stop the server immediately with a helpful message
        throw new Error(`❌ Missing required environment variable: ${name}`)
    }

    return value
}

// Export all env vars as a typed config object
// Use this object everywhere instead of process.env directly
export const env = {
    // Server config
    port: process.env.PORT || '5000',
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

    // Database — required, crash if missing
    databaseUrl: requireEnv('DATABASE_URL'),

    // JWT — required, crash if missing
    jwtSecret: requireEnv('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

    // Claude AI — required for insights feature
    anthropicKey: process.env.ANTHROPIC_API_KEY || '',

    // Helper to check if we're in development mode
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',

    // Gemini API — required for insights feature
    geminiKey: requireEnv('GEMINI_API_KEY'),
}