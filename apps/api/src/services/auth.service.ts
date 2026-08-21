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
import cloudinary from '../config/cloudinary'
import crypto from 'crypto'

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
            avatarUrl: true,
            createdAt: true,
            notifyBudgetAlerts: true,
            notifyWeeklySummary: true,
            notifyMonthlyReport: true,
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
            avatarUrl: true,
            createdAt: true,
            notifyBudgetAlerts: true,
            notifyWeeklySummary: true,
            notifyMonthlyReport: true,
        },
    })

    return updatedUser
}

// ── Change Password ───────────────────────────────────
export async function changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
) {
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
        throw new Error('User not found')
    }

    // Verify current password is correct before allowing change
    const isValid = await comparePassword(currentPassword, user.passwordHash)
    if (!isValid) {
        throw new Error('Current password is incorrect')
    }

    // Hash and save the new password
    const newHash = await hashPassword(newPassword)
    await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash },
    })

    return { message: 'Password changed successfully' }
}

// ── Update Currency Preference ────────────────────────
export async function updateCurrency(userId: number, currency: string) {
    const user = await prisma.user.update({
        where: { id: userId },
        data: { currency },
        select: {
            id: true, name: true, email: true,
            currency: true, createdAt: true,
        },
    })
    return user
}

// ── Delete Account ─────────────────────────────────────
export async function deleteAccount(userId: number, password: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
        throw new Error('User not found')
    }

    // Verify password before permanent deletion
    const isValid = await comparePassword(password, user.passwordHash)
    if (!isValid) {
        throw new Error('Password is incorrect')
    }

    // Delete user — cascade deletes expenses and budgets too
    // (onDelete: Cascade is set in schema.prisma)
    await prisma.user.delete({ where: { id: userId } })

    return { message: 'Account deleted successfully' }
}

// ── Update Avatar ──────────────────────────────────────
export async function updateAvatar(userId: number, base64Image: string) {
    const randomId = crypto.randomBytes(16).toString('hex')

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
        folder: 'spendwise/avatars',
        public_id: `avatar_${randomId}`,   // e.g. avatar_a3f9c81b2e...
        overwrite: true,
        transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' },
        ],
    })

    const user = await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: uploadResult.secure_url },
        select: {
            id: true, name: true, email: true, currency: true,
            avatarUrl: true, createdAt: true,
            notifyBudgetAlerts: true, notifyWeeklySummary: true, notifyMonthlyReport: true,
        },
    })

    return user
}
// ── Update Notification Preferences ────────────────────
export async function updateNotifications(
    userId: number,
    prefs: { notifyBudgetAlerts: boolean; notifyWeeklySummary: boolean; notifyMonthlyReport: boolean }
) {
    const user = await prisma.user.update({
        where: { id: userId },
        data: prefs,
        select: {
            id: true, name: true, email: true, currency: true,
            avatarUrl: true, createdAt: true,
            notifyBudgetAlerts: true, notifyWeeklySummary: true, notifyMonthlyReport: true,
        },
    })
    return user
}

// ── Get Account Stats ───────────────────────────────────
export async function getAccountStats(userId: number) {
    // Run counts in parallel
    const [expenseCount, budgetCount, user] = await Promise.all([
        prisma.expense.count({ where: { userId } }),
        prisma.budget.count({ where: { userId } }),
        prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true } }),
    ])

    // Calculate months since joining
    const joinedDate = user?.createdAt || new Date()
    const monthsAgo = Math.max(
        1,
        (new Date().getFullYear() - joinedDate.getFullYear()) * 12 +
        (new Date().getMonth() - joinedDate.getMonth())
    )

    return {
        expenseCount,
        budgetCount,
        memberMonths: monthsAgo,
        joinedDate,
    }
}