//Central place that registers all route groups

// ============================================
// Main Router — Register All Routes
// ============================================
// This file is the single entry point for all
// API routes. Instead of cluttering index.ts
// with dozens of routes, we register them here.
//
// As we build more features (auth, expenses,
// budgets, insights) we simply add them here.
// ============================================

import { Router } from 'express'
import authRoutes   from './auth.routes' 

const router = Router()


// ── Health Check ─────────────────────────────────────
// Simple ping to confirm API is alive
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'SpendWise API is running ✅',
        timestamp: new Date().toISOString(),
    })
})

// ── Feature Routes ───────────────────────────────────
// We will uncomment these as we build each feature:
//
//import authRoutes     from './auth.routes'
// import expenseRoutes  from './expense.routes' -uncommit
// import budgetRoutes   from './budget.routes'
// import insightRoutes  from './insights.routes'
// import analyticsRoutes from './analytics.routes'
// import exportRoutes   from './export.routes'
//
router.use('/auth',      authRoutes)
// router.use('/expenses',  expenseRoutes)
// router.use('/budgets',   budgetRoutes)
// router.use('/insights',  insightRoutes)
// router.use('/analytics', analyticsRoutes)
// router.use('/export',    exportRoutes)

export default router