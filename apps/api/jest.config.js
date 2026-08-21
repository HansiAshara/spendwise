// ============================================
// Jest Configuration
// ============================================
// Tells Jest how to run our TypeScript tests.
// ============================================

module.exports = {
    // Use ts-jest to understand .ts files directly
    preset: 'ts-jest',

    // Run tests in a Node.js environment (not browser)
    testEnvironment: 'node',

    // Where to look for test files
    // Any file ending in .test.ts inside __tests__ folder
    testMatch: ['**/__tests__/**/*.test.ts'],

    // Show detailed pass/fail for each test
    verbose: true,

    // Stop hanging processes after tests finish
    // (Prisma keeps a DB connection open otherwise)
    forceExit: true,

    // Wait max 10 seconds per test before failing
    testTimeout: 10000,
}