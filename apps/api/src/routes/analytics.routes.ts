// ============================================
// Analytics Routes
// ============================================
// Powers all 3 dashboard charts.
// ALL routes protected.
// ============================================

import { Router } from 'express'
import { protect } from '../middleware/auth.middleware'
import * as AnalyticsController from '../controllers/analytics.controller'

const router = Router()

// Protect all analytics routes
router.use(protect)

// GET /api/analytics/dashboard  → all dashboard data in one call
router.get('/dashboard', AnalyticsController.getDashboard)

// GET /api/analytics/summary    → pie chart data
router.get('/summary', AnalyticsController.getCategorySummary)

// GET /api/analytics/monthly    → bar chart data (last 6 months)
router.get('/monthly', AnalyticsController.getMonthlyTrend)

// GET /api/analytics/daily      → trend line data (daily this month)
router.get('/daily', AnalyticsController.getDailySpending)

export default router