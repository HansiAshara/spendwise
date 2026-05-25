//Handles password hashing with bcrypt. Never store plain passwords.

// ============================================
// Password Hashing Utilities
// ============================================
// We NEVER store plain passwords in the database.
// bcrypt converts "mypassword123" into a random
// looking string like "$2b$10$xyz..." that cannot
// be reversed back to the original password.
//
// When user logs in, we compare the plain password
// against the stored hash — bcrypt handles this.
// ============================================

import bcrypt from 'bcryptjs'

// Salt rounds = how many times bcrypt scrambles the password
// 12 is a good balance between security and speed
// Higher = more secure but slower
const SALT_ROUNDS = 12

// ── Hash Password ────────────────────────────────────
// Call this when registering a new user
// Example: const hash = await hashPassword('mypassword123')
export async function hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, SALT_ROUNDS)
}

// ── Compare Password ─────────────────────────────────
// Call this when user tries to login
// Returns true if password matches, false if wrong
// Example: const isValid = await comparePassword('mypassword123', user.passwordHash)
export async function comparePassword(
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
}