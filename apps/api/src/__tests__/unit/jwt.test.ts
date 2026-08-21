// ============================================
// Unit Test — JWT Token Utilities
// ============================================

import { signToken, verifyToken } from '../../utils/jwt'

describe('JWT Token Utilities', () => {

    it('should create a valid token string', () => {
        const token = signToken({ userId: 1, email: 'test@example.com' })

        // A JWT has 3 parts separated by dots: header.payload.signature
        expect(token.split('.')).toHaveLength(3)
    })

    it('should decode a token back to the original payload', () => {
        const payload = { userId: 42, email: 'kasun@gmail.com' }
        const token = signToken(payload)

        const decoded = verifyToken(token)

        expect(decoded.userId).toBe(42)
        expect(decoded.email).toBe('kasun@gmail.com')
    })

    it('should throw an error for an invalid token', () => {
        const fakeToken = 'this.is.not.a.real.token'

        // verifyToken should throw when given garbage input
        expect(() => verifyToken(fakeToken)).toThrow()
    })

    it('should throw an error for a tampered token', () => {
        const token = signToken({ userId: 1, email: 'test@example.com' })
        // Change one character to corrupt the signature
        const tampered = token.slice(0, -1) + 'X'

        expect(() => verifyToken(tampered)).toThrow()
    })
})