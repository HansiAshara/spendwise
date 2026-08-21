// ============================================
// Test Setup Helper
// ============================================
// Runs before integration tests.
// Cleans the test database between test files
// so tests don't interfere with each other.
// ============================================

import prisma from '../config/database'

// Deletes all test data EXCEPT categories
// (categories are seeded once and reused)
export async function cleanDatabase() {
    await prisma.expense.deleteMany()
    await prisma.budget.deleteMany()
    await prisma.user.deleteMany()
}

// Closes the database connection after all tests finish
// Without this, Jest hangs waiting for the connection to close
export async function closeDatabase() {
    await prisma.$disconnect()
}