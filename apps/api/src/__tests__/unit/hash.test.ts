// ============================================
// Unit Test — Password Hashing
// ============================================
// Tests hash.ts in complete isolation.
// No database, no Express, no network — pure logic.
// ============================================

import { hashPassword, comparePassword } from '../../utils/hash'

// describe() groups related tests together
describe('Password Hashing', () => {

    // it() (or test()) defines ONE specific test case
    it('should hash a password into a different string', async () => {
        const plainPassword = 'mySecurePassword123'
        const hashed = await hashPassword(plainPassword)

        // The hash should NOT equal the original password
        expect(hashed).not.toBe(plainPassword)

        // bcrypt hashes always start with $2b$ or $2a$
        expect(hashed).toMatch(/^\$2[aby]\$/)
    })

    it('should verify a correct password matches its hash', async () => {
        const plainPassword = 'mySecurePassword123'
        const hashed = await hashPassword(plainPassword)

        const isMatch = await comparePassword(plainPassword, hashed)
        expect(isMatch).toBe(true)
    })

    it('should reject an incorrect password', async () => {
        const plainPassword = 'mySecurePassword123'
        const wrongPassword = 'wrongPassword456'
        const hashed = await hashPassword(plainPassword)

        const isMatch = await comparePassword(wrongPassword, hashed)
        expect(isMatch).toBe(false)
    })

    it('should generate a different hash each time (unique salt)', async () => {
        const plainPassword = 'samePassword'
        const hash1 = await hashPassword(plainPassword)
        const hash2 = await hashPassword(plainPassword)

        // Even with the same input, bcrypt adds random salt
        // so two hashes of the same password are never identical
        expect(hash1).not.toBe(hash2)
    })
})