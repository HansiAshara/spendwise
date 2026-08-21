// ============================================
// Integration Test — Auth Routes
// ============================================
// Tests the FULL flow: HTTP request → middleware
// → controller → service → database → response.
//
// Supertest lets us call app.post('/api/auth/register')
// without actually starting a server on a port.
// ============================================

import request from 'supertest'
import app from '../../index'
import { cleanDatabase, closeDatabase } from '../setup'

describe('Auth API', () => {

    // Clean database before this test file starts
    beforeAll(async () => {
        await cleanDatabase()
    })

    // Clean up after ALL tests in this file finish
    afterAll(async () => {
        await cleanDatabase()
        await closeDatabase()
    })

    // ── POST /api/auth/register ──────────────────────
    describe('POST /api/auth/register', () => {

        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'testuser@example.com',
                    password: 'password123',
                })

            expect(response.status).toBe(201)
            expect(response.body.success).toBe(true)
            expect(response.body.data.user.email).toBe('testuser@example.com')
            expect(response.body.data.token).toBeDefined()

            // Password should NEVER be in the response
            expect(response.body.data.user.passwordHash).toBeUndefined()
        })

        it('should reject registration with an existing email', async () => {
            // Try registering the SAME email again
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Another User',
                    email: 'testuser@example.com', // duplicate
                    password: 'password456',
                })

            expect(response.status).toBe(409) // Conflict
            expect(response.body.success).toBe(false)
            expect(response.body.message).toContain('already exists')
        })

        it('should reject registration with invalid email format', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Bad Email User',
                    email: 'not-an-email',
                    password: 'password123',
                })

            expect(response.status).toBe(422) // Validation error
            expect(response.body.success).toBe(false)
        })

        it('should reject registration with a short password', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Short Pass User',
                    email: 'shortpass@example.com',
                    password: '123', // too short
                })

            expect(response.status).toBe(422)
        })
    })

    // ── POST /api/auth/login ─────────────────────────
    describe('POST /api/auth/login', () => {

        it('should login with correct credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123',
                })

            expect(response.status).toBe(200)
            expect(response.body.data.token).toBeDefined()
            expect(response.body.data.user.email).toBe('testuser@example.com')
        })

        it('should reject login with wrong password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'wrongPassword',
                })

            expect(response.status).toBe(401)
            expect(response.body.success).toBe(false)
        })

        it('should reject login for non-existent email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'doesnotexist@example.com',
                    password: 'password123',
                })

            expect(response.status).toBe(401)
        })
    })

    // ── GET /api/auth/me (protected route) ───────────
    describe('GET /api/auth/me', () => {

        it('should reject request with no token', async () => {
            const response = await request(app).get('/api/auth/me')

            expect(response.status).toBe(401)
        })

        it('should return user data with a valid token', async () => {
            // First login to get a real token
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ email: 'testuser@example.com', password: 'password123' })

            const token = loginRes.body.data.token

            // Use that token to access the protected route
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(200)
            expect(response.body.data.user.email).toBe('testuser@example.com')
        })

        it('should reject an invalid token', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid.token.here')

            expect(response.status).toBe(401)
        })
    })
})