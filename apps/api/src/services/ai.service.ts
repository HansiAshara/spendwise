// ============================================
// AI Service — Google Gemini
// ============================================
// Generates personalised spending insights
// using Google Gemini API (completely free).
// ============================================

import { GoogleGenerativeAI } from '@google/generative-ai'
import prisma from '../config/database'
import { env } from '../config/env'

// Initialize Gemini with API key from .env
//const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const genAI = new GoogleGenerativeAI(env.geminiKey)

export async function generateInsights(userId: number) {

    // ── Fetch last 30 days of expenses ───────────────
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const expenses = await prisma.expense.findMany({
        where: {
            userId,
            date: { gte: thirtyDaysAgo },
        },
        include: {
            category: {
                select: { name: true, icon: true },
            },
        },
        orderBy: { date: 'desc' },
    })

    // ── No data yet ───────────────────────────────────
    if (expenses.length === 0) {
        return {
            tips: [],
            summary: 'No expense data found for the last 30 days. Start logging your expenses to get personalised AI insights.',
            dataPoints: 0,
            totalSpent: 0,
        }
    }

    // ── Group by category ─────────────────────────────
    const categoryTotals: Record<string, {
        total: number
        count: number
        icon: string
    }> = {}

    let grandTotal = 0

    for (const expense of expenses) {
        const name = expense.category.name

        if (!categoryTotals[name]) {
            categoryTotals[name] = { total: 0, count: 0, icon: expense.category.icon }
        }

        categoryTotals[name].total += Number(expense.amount)
        categoryTotals[name].count += 1
        grandTotal += Number(expense.amount)
    }

    // ── Format category breakdown for prompt ─────────
    const categoryBreakdown = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b.total - a.total)
        .map(([name, data]) => {
            const pct = ((data.total / grandTotal) * 100).toFixed(1)
            return `- ${data.icon} ${name}: LKR ${data.total.toLocaleString()} (${pct}% of spending, ${data.count} transactions)`
        })
        .join('\n')

    // ── Build prompt ──────────────────────────────────
    const prompt = `
You are a personal finance advisor helping a Sri Lankan university student manage their money wisely.

Here is their real spending data for the last 30 days:

TOTAL SPENT: LKR ${grandTotal.toLocaleString()}
TOTAL TRANSACTIONS: ${expenses.length}

BREAKDOWN BY CATEGORY:
${categoryBreakdown}

Based on this REAL data, give exactly 3 personalised and actionable money-saving tips.

Important rules:
- Be specific to their actual spending categories shown above
- Always mention specific LKR amounts from their data
- Be friendly, encouraging, and practical — not judgmental
- Give advice relevant to Sri Lanka (local context, local prices)
- Each tip must include a realistic monthly saving amount in LKR
- Keep each tip concise — 2 to 3 sentences maximum
- Focus on the highest spending categories first

Respond in this EXACT JSON format only — no extra text, no markdown:
{
    "summary": "One sentence overview of their spending pattern this month",
    "tips": [
    {
        "title": "Short actionable tip title",
        "description": "2-3 sentence specific advice based on their data",
        "potentialSaving": 3000,
        "category": "The category this tip applies to",
        "priority": "high"
    },
    {
        "title": "Short actionable tip title",
        "description": "2-3 sentence specific advice based on their data",
        "potentialSaving": 1500,
        "category": "The category this tip applies to",
        "priority": "medium"
    },
    {
        "title": "Short actionable tip title",
        "description": "2-3 sentence specific advice based on their data",
        "potentialSaving": 800,
        "category": "The category this tip applies to",
        "priority": "low"
    }
    ]
}
`

    // ── Call Gemini API ───────────────────────────────
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
        const result = await model.generateContent(prompt)
        const text = result.response.text()

        // Clean response — remove markdown code blocks if present
        const cleaned = text
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim()

        const parsed = JSON.parse(cleaned)

        return {
            tips: parsed.tips || [],
            summary: parsed.summary || '',
            dataPoints: expenses.length,
            totalSpent: grandTotal,
            categoryBreakdown: categoryTotals,
        }

    } catch (error) {
        console.error('Gemini API error:', error)
        throw new Error('Failed to generate insights. Please try again later.')
    }
}