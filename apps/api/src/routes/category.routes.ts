// ============================================
// Category Routes
// ============================================
// Returns the list of all spending categories.
// Used by the frontend to populate dropdowns
// when logging a new expense or setting a budget.
//
// Categories are read-only — users cannot create
// or delete them. They are seeded once by us.
// ============================================

import { Router } from 'express'
import { protect } from '../middleware/auth.middleware'
import prisma from '../config/database'
import { sendSuccess, sendError } from '../utils/response'

const router = Router()

// Protect — must be logged in to see categories
router.use(protect)

// GET /api/categories
// Returns all categories with icon and color
router.get('/', async (req, res) => {
    try {
        const rawCategories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
        })

        // Sort alphabetically, but keep 'Other' at the very end
        const categories = rawCategories.sort((a, b) => {
            if (a.name.toLowerCase() === 'other') return 1
            if (b.name.toLowerCase() === 'other') return -1
            return a.name.localeCompare(b.name)
        })

        sendSuccess(res, { categories }, 'Categories fetched successfully')

    } catch (error) {
        sendError(res, 'Failed to fetch categories', 500)
    }
})

export default router