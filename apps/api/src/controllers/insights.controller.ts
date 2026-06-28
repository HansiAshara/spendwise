// ============================================
// Insights Controller
// ============================================
// Handles GET /api/insights
// Calls AI service and returns tips to frontend
// ============================================

import { Request, Response } from 'express'
import { generateInsights } from '../services/ai.service'
import { sendSuccess, sendError } from '../utils/response'

export async function getInsights(req: Request, res: Response): Promise<void> {
    try {
        const insights = await generateInsights(req.user!.userId)
        sendSuccess(res, insights, 'Insights generated successfully')
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to generate insights'
        sendError(res, message, 500)
    }
}