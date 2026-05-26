// ============================================
// Analytics Controller
// ============================================
// Powers all dashboard charts and summary cards.
// ============================================

import { Request, Response } from 'express'
import * as AnalyticsService from '../services/analytics.service'
import { sendSuccess, sendError } from '../utils/response'

// ── Dashboard Summary ─────────────────────────────────
// GET /api/analytics/dashboard
// Returns ALL dashboard data in one request
export async function getDashboard(req: Request, res: Response): Promise<void> {
    try {
        const summary = await AnalyticsService.getDashboardSummary(
            req.user!.userId
        )
        sendSuccess(res, summary, 'Dashboard data fetched successfully')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch dashboard'
        sendError(res, message, 400)
    }
}

// ── Category Summary ──────────────────────────────────
// GET /api/analytics/summary?month=5&year=2025
// Data for pie chart
export async function getCategorySummary(req: Request, res: Response): Promise<void> {
    try {
        const now = new Date()
        const month = parseInt(req.query.month as string) || now.getMonth() + 1
        const year = parseInt(req.query.year as string) || now.getFullYear()

        const summary = await AnalyticsService.getCategorySummary(
            req.user!.userId,
            month,
            year
        )

        sendSuccess(res, summary, 'Category summary fetched successfully')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch summary'
        sendError(res, message, 400)
    }
}

// ── Monthly Trend ─────────────────────────────────────
// GET /api/analytics/monthly
// Data for bar chart — last 6 months
export async function getMonthlyTrend(req: Request, res: Response): Promise<void> {
    try {
        const trend = await AnalyticsService.getMonthlyTrend(req.user!.userId)
        sendSuccess(res, { trend }, 'Monthly trend fetched successfully')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch trend'
        sendError(res, message, 400)
    }
}

// ── Daily Spending ────────────────────────────────────
// GET /api/analytics/daily?month=5&year=2025
// Data for trend line chart
export async function getDailySpending(req: Request, res: Response): Promise<void> {
    try {
        const now = new Date()
        const month = parseInt(req.query.month as string) || now.getMonth() + 1
        const year = parseInt(req.query.year as string) || now.getFullYear()

        const daily = await AnalyticsService.getDailySpending(
            req.user!.userId,
            month,
            year
        )

        sendSuccess(res, { daily }, 'Daily spending fetched successfully')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch daily spending'
        sendError(res, message, 400)
    }
}