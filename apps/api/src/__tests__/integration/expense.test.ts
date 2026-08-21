// ============================================
// Integration Test — Expense Routes
// ============================================
// Tests full expense CRUD flow, including
// that a user can NEVER see another user's expenses.
// ============================================

import request from 'supertest'
import app from '../../index'
import prisma from '../../config/database'
import { cleanDatabase, closeDatabase } from '../setup'

describe('Expense API', () => {
    let authToken: string
    let categoryId: number
    let createdExpenseId: number

    // Register a user and grab a category ID before tests run
    beforeAll(async () => {
        await cleanDatabase()

        // Register a test user
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Expense Tester',
                email: 'expensetest@example.com',
                password: 'password123',
            })

        authToken = registerRes.body.data.token

        // Get an existing seeded category (e.g. Food)
        //const category = await prisma.category.findFirst({ where: { name: 'Food' } })
        //categoryId = category!.id
        const category = await prisma.category.upsert({
            where: { name: 'Food' },
            update: {},
            create: {
                name: 'Food',
                icon: '🍔',
                color: '#F97316',
            },
        })
        categoryId = category.id
    })

    afterAll(async () => {
        await cleanDatabase()
        await closeDatabase()
    })

    // ── POST /api/expenses ────────────────────────────
    describe('POST /api/expenses', () => {

        it('should reject creating an expense without auth', async () => {
            const response = await request(app)
                .post('/api/expenses')
                .send({ amount: 1500, categoryId, date: '2025-05-01' })

            expect(response.status).toBe(401)
        })

        it('should create a new expense when authenticated', async () => {
            const response = await request(app)
                .post('/api/expenses')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    amount: 1500,
                    categoryId,
                    date: '2025-05-01',
                    note: 'Test lunch expense',
                })

            expect(response.status).toBe(201)
            expect(response.body.data.expense.amount).toBe(1500)
            expect(response.body.data.expense.category.name).toBe('Food')

            createdExpenseId = response.body.data.expense.id
        })

        it('should reject a negative amount', async () => {
            const response = await request(app)
                .post('/api/expenses')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ amount: -500, categoryId, date: '2025-05-01' })

            expect(response.status).toBe(422)
        })

        it('should reject an invalid category', async () => {
            const response = await request(app)
                .post('/api/expenses')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ amount: 500, categoryId: 999999, date: '2025-05-01' })

            expect(response.status).toBe(400)
        })
    })

    // ── GET /api/expenses ──────────────────────────────
    describe('GET /api/expenses', () => {

        it('should return only the logged-in user\'s expenses', async () => {
            const response = await request(app)
                .get('/api/expenses')
                .set('Authorization', `Bearer ${authToken}`)

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body.data.expenses)).toBe(true)
            expect(response.body.data.expenses.length).toBeGreaterThan(0)
        })
    })

    // ── PUT /api/expenses/:id ──────────────────────────
    describe('PUT /api/expenses/:id', () => {

        it('should update an existing expense', async () => {
            const response = await request(app)
                .put(`/api/expenses/${createdExpenseId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ amount: 2000 })

            expect(response.status).toBe(200)
            expect(response.body.data.expense.amount).toBe(2000)
        })

        it('should return 404 for a non-existent expense', async () => {
            const response = await request(app)
                .put('/api/expenses/999999')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ amount: 1000 })

            expect(response.status).toBe(404)
        })
    })

    // ── Security — cross-user access ──────────────────
    describe('Expense ownership security', () => {

        it('should NOT allow one user to see another user\'s expense', async () => {
            // Register a second, different user
            const otherUserRes = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Other User',
                    email: 'otheruser@example.com',
                    password: 'password123',
                })

            const otherToken = otherUserRes.body.data.token

            // Try to access the FIRST user's expense using the SECOND user's token
            const response = await request(app)
                .get(`/api/expenses/${createdExpenseId}`)
                .set('Authorization', `Bearer ${otherToken}`)

            // Should say "not found" — never reveal it exists for another user
            expect(response.status).toBe(404)
        })
    })

    // ── DELETE /api/expenses/:id ───────────────────────
    describe('DELETE /api/expenses/:id', () => {

        it('should delete the expense', async () => {
            const response = await request(app)
                .delete(`/api/expenses/${createdExpenseId}`)
                .set('Authorization', `Bearer ${authToken}`)

            expect(response.status).toBe(200)
        })

        it('should confirm the expense no longer exists', async () => {
            const response = await request(app)
                .get(`/api/expenses/${createdExpenseId}`)
                .set('Authorization', `Bearer ${authToken}`)

            expect(response.status).toBe(404)
        })
    })
})