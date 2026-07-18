// ============================================
// Export Service
// ============================================
// Generates PDF and CSV files from expense data.
// ============================================

import PDFDocument from 'pdfkit'
import prisma from '../config/database'

interface ExportFilters {
    userId: number
    startDate: Date
    endDate: Date
    categoryId?: number
}

// ── Fetch expenses for export ─────────────────────
async function fetchExpensesForExport(filters: ExportFilters) {
    const where: any = {
        userId: filters.userId,
        date: {
            gte: filters.startDate,
            lte: filters.endDate,
        },
    }

    if (filters.categoryId) {
        where.categoryId = filters.categoryId
    }

    return prisma.expense.findMany({
        where,
        include: {
            category: {
                select: { name: true, icon: true, color: true },
            },
        },
        orderBy: { date: 'desc' },
    })
}

// ── Generate PDF ──────────────────────────────────
export async function generatePDF(filters: ExportFilters): Promise<Buffer> {
    const expenses = await fetchExpensesForExport(filters)

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, size: 'A4' })
        const chunks: Buffer[] = []

        doc.on('data', chunk => chunks.push(chunk))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', err => reject(err))

        const PRIMARY = '#6366F1'
        const DARK = '#0F172A'
        const MUTED = '#64748B'
        const BORDER = '#E2E8F0'

        // Header
        doc.rect(0, 0, doc.page.width, 80).fill(PRIMARY)
        doc.fillColor('white').fontSize(22).font('Helvetica-Bold').text('SpendWise', 50, 25)
        doc.fontSize(10).font('Helvetica').text('Personal Finance Report', 50, 52)
        doc.fontSize(9).text(
            `Generated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`,
            0, 35,
            { align: 'right', width: doc.page.width - 50 }
        )

        const startStr = filters.startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
        const endStr = filters.endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

        doc.fillColor(MUTED).fontSize(9).font('Helvetica')
            .text(`Report Period: ${startStr} — ${endStr}`, 50, 100)

        const grandTotal = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
        const avgAmount = expenses.length > 0 ? grandTotal / expenses.length : 0

        // Summary box
        doc.rect(50, 120, doc.page.width - 100, 70).fillAndStroke('#F8FAFC', BORDER)
        doc.fillColor(DARK).fontSize(10).font('Helvetica-Bold').text('SUMMARY', 65, 132)

        const stats = [
            { label: 'Total Spent', value: `LKR ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
            { label: 'Transactions', value: String(expenses.length) },
            { label: 'Avg per Transaction', value: `LKR ${avgAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        ]

        stats.forEach((stat, i) => {
            const x = 65 + i * 160
            doc.fillColor(MUTED).fontSize(8).font('Helvetica').text(stat.label, x, 150)
            doc.fillColor(PRIMARY).fontSize(12).font('Helvetica-Bold').text(stat.value, x, 163)
        })

        // Category breakdown
        const categoryMap: Record<string, number> = {}
        for (const exp of expenses) {
            const name = exp.category.name
            categoryMap[name] = (categoryMap[name] || 0) + Number(exp.amount)
        }
        const categories = Object.entries(categoryMap).sort(([, a], [, b]) => b - a)

        if (categories.length > 0) {
            doc.fillColor(DARK).fontSize(11).font('Helvetica-Bold').text('Category Breakdown', 50, 205)

            let catY = 222
            categories.forEach(([name, total]) => {
                const pct = grandTotal > 0 ? ((total / grandTotal) * 100).toFixed(1) : '0'
                const barW = grandTotal > 0 ? ((total / grandTotal) * 200) : 0

                doc.fillColor(DARK).fontSize(9).font('Helvetica').text(name, 50, catY)
                doc.rect(150, catY + 1, 200, 10).fill('#E2E8F0')
                doc.rect(150, catY + 1, barW, 10).fill(PRIMARY)
                doc.fillColor(MUTED).fontSize(9).font('Helvetica')
                    .text(`LKR ${total.toLocaleString()} (${pct}%)`, 360, catY)

                catY += 20
            })
        }

        // Table
        const tableStartY = categories.length > 0 ? 225 + categories.length * 20 + 20 : 220
        doc.fillColor(DARK).fontSize(11).font('Helvetica-Bold').text('Transaction Details', 50, tableStartY)

        const headerY = tableStartY + 18
        doc.rect(50, headerY, doc.page.width - 100, 20).fill(PRIMARY)

        const cols = [
            { label: 'Date', x: 55 },
            { label: 'Description', x: 140 },
            { label: 'Category', x: 305 },
            { label: 'Amount (LKR)', x: 410 },
        ]
        cols.forEach(col => {
            doc.fillColor('white').fontSize(8).font('Helvetica-Bold').text(col.label, col.x, headerY + 6)
        })

        let rowY = headerY + 20
        expenses.forEach((expense, idx) => {
            if (idx % 2 === 0) {
                doc.rect(50, rowY, doc.page.width - 100, 18).fill('#F8FAFC')
            }

            const dateStr = new Date(expense.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            const note = expense.note || '-'
            const truncNote = note.length > 28 ? note.slice(0, 25) + '...' : note
            const amount = Number(expense.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })

            doc.fillColor(DARK).fontSize(8).font('Helvetica')
                .text(dateStr, 55, rowY + 5)
                .text(truncNote, 140, rowY + 5)
                .text(expense.category.name, 305, rowY + 5)

            doc.fillColor(DARK).fontSize(8).font('Helvetica-Bold').text(amount, 410, rowY + 5)

            rowY += 18
            if (rowY > doc.page.height - 80) {
                doc.addPage()
                rowY = 50
            }
        })

        doc.rect(50, rowY, doc.page.width - 100, 22).fill(DARK)
        doc.fillColor('white').fontSize(9).font('Helvetica-Bold')
            .text('TOTAL', 55, rowY + 7)
            .text(`LKR ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 410, rowY + 7)

        doc.fillColor(MUTED).fontSize(8).font('Helvetica').text(
            'Generated by SpendWise — Personal Finance Tracker for Sri Lankan Students',
            50, doc.page.height - 40,
            { align: 'center', width: doc.page.width - 100 }
        )

        doc.end()
    })
}

// ── Generate CSV ──────────────────────────────────
export async function generateCSV(filters: ExportFilters): Promise<string> {
    const expenses = await fetchExpensesForExport(filters)

    const header = 'ID,Date,Category,Description,Amount (LKR)\n'
    const rows = expenses.map(exp => {
        const date = new Date(exp.date).toLocaleDateString('en-GB')
        const note = (exp.note || '-').replace(/,/g, ';')
        const amount = Number(exp.amount).toFixed(2)
        return `${exp.id},${date},${exp.category.name},${note},${amount}`
    }).join('\n')

    const grandTotal = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    const summary = `\n\nSUMMARY\nTotal Transactions,${expenses.length}\nTotal Amount (LKR),${grandTotal.toFixed(2)}\nPeriod,${filters.startDate.toLocaleDateString('en-GB')} to ${filters.endDate.toLocaleDateString('en-GB')}`

    return header + rows + summary
}

// ── Get export preview ────────────────────────────
export async function getExportPreview(filters: ExportFilters) {
    const expenses = await fetchExpensesForExport(filters)
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

    return { count: expenses.length, total }
}