// ============================================
// Insights Routes
// ============================================
// GET /api/insights → protected route
// ============================================

import { Router }      from 'express'
import { protect }     from '../middleware/auth.middleware'
import { getInsights } from '../controllers/insights.controller'

const router = Router()

// All insight routes require login
router.use(protect)

// GET /api/insights
router.get('/', getInsights)

export default router