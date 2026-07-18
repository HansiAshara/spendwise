// ============================================
// Export Controller
// ============================================

import { Request, Response } from 'express'
import { generatePDF, generateCSV, getExportPreview } from '../services/export.service'
import { sendSuccess, sendError } from '../utils/response'

function parseDate(dateStr: string, fallback: Date): Date {
    const parsed = new Date(dateStr)
    return isNaN(parsed.getTime()) ? fallback : parsed
}

export async function exportPDF(req: Request, res: Response): Promise<void> {
    try {
        const now = new Date()
        const startDate = parseDate(req.query.startDate as string, new Date(now.getFullYear(), now.getMonth(), 1))
        const endDate = parseDate(req.query.endDate as string, new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59))
        const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined

        const pdfBuffer = await generatePDF({ userId: req.user!.userId, startDate, endDate, categoryId })

        const filename = `spendwise-report-${new Date().toISOString().split('T')[0]}.pdf`
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
        res.setHeader('Content-Length', pdfBuffer.length)
        res.send(pdfBuffer)

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to generate PDF'
        sendError(res, message, 500)
    }
}

export async function exportCSV(req: Request, res: Response): Promise<void> {
    try {
        const now = new Date()
        const startDate = parseDate(req.query.startDate as string, new Date(now.getFullYear(), now.getMonth(), 1))
        const endDate = parseDate(req.query.endDate as string, new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59))
        const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined

        const csvContent = await generateCSV({ userId: req.user!.userId, startDate, endDate, categoryId })

        const filename = `spendwise-expenses-${new Date().toISOString().split('T')[0]}.csv`
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
        res.send(csvContent)

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to generate CSV'
        sendError(res, message, 500)
    }
}

export async function exportPreview(req: Request, res: Response): Promise<void> {
    try {
        const now = new Date()
        const startDate = parseDate(req.query.startDate as string, new Date(now.getFullYear(), now.getMonth(), 1))
        const endDate = parseDate(req.query.endDate as string, new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59))
        const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined

        const preview = await getExportPreview({ userId: req.user!.userId, startDate, endDate, categoryId })
        sendSuccess(res, preview, 'Preview fetched successfully')

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch preview'
        sendError(res, message, 500)
    }
}