// ============================================
// Auth Service
// ============================================
// Contains all business logic for authentication.
// This layer talks to the database via Prisma.
//
// Rules:
//   - No req or res objects here
//   - No HTTP status codes here
//   - Just pure functions: input in, result out
//   - Controllers call these functions
// ============================================

import prisma from '../config/database'
import { hashPassword, comparePassword } from '../utils/hash'
import { signToken } from '../utils/jwt'
import { RegisterInput, LoginInput } from '../validators/auth.validator'

// ── Register ─────────────────────────────────────────
// Creates a new user account
// Returns the user and JWT token on success
// Throws an error if email already exists
export async function registerUser(data: RegisterInput) {
    // Step 1: Check if email is already registered
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    })

    if (existingUser) {
        // Throw error — controller will catch this and send 409
        throw new Error('An account with this email already exists')
    }

    // Step 2: Hash the password before saving
    // NEVER save plain text passwords to database
    const passwordHash = await hashPassword(data.password)

    // Step 3: Create the user in the database
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            passwordHash, // save the hash, not the plain password
            currency: 'LKR', // default currency for Sri Lankan users
        },
        // Only select fields we need — never return passwordHash
        select: {
            id: true,
            name: true,
            email: true,
            currency: true,
            createdAt: true,
        },
    })

    // Step 4: Create a JWT token for the new user
    // This logs them in automatically after registering
    const token = signToken({ userId: user.id, email: user.email })

    return { user, token }
}

// ── Login ────────────────────────────────────────────
// Verifies credentials and returns JWT token
// Throws error if email not found or password wrong
export async function loginUser(data: LoginInput) {
    // Step 1: Find user by email
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    })

    // Step 2: Check if user exists
    // Use vague error message — don't tell attacker if email exists
    if (!user) {
        throw new Error('Invalid email or password')
    }

    // Step 3: Compare the plain password with stored hash
    const isPasswordValid = await comparePassword(data.password, user.passwordHash)

    if (!isPasswordValid) {
        throw new Error('Invalid email or password') // same vague message
    }

    // Step 4: Create JWT token
    const token = signToken({ userId: user.id, email: user.email })

    // Return user without passwordHash
    const { passwordHash: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword, token }
}

// ── Get Current User ─────────────────────────────────
// Fetches the logged-in user's profile
// Called when frontend needs to display user info
export async function getCurrentUser(userId: number) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        // Select only safe fields — never return passwordHash
        select: {
            id: true,
            name: true,
            email: true,
            currency: true,
            createdAt: true,
        },
    })

    if (!user) {
        throw new Error('User not found')
    }

    return user
}

// ── Update Profile ───────────────────────────────────
// Updates name or email in settings page
export async function updateProfile(
    userId: number,
    data: { name?: string; email?: string }
) {
    // Check if new email is already taken by another user
    if (data.email) {
        const existing = await prisma.user.findUnique({
            where: { email: data.email },
        })

        // If found and it's a different user, reject
        if (existing && existing.id !== userId) {
            throw new Error('This email is already in use')
        }
    }

    // Update the user record
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            currency: true,
            createdAt: true,
        },
    })

    return updatedUser
}