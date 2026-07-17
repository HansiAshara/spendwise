// ============================================
// ExportInfoCard Component
// ============================================
// Small explainer card describing the currently
// selected format (PDF or CSV).
// ============================================

'use client'

import { ExportFormat } from '@/hooks/useExport'

interface ExportInfoCardProps {
    format: ExportFormat
}

const INFO_TEXT: Record<ExportFormat, { title: string; description: string; icon: string }> = {
    pdf: {
        icon: '📄',
        title: 'PDF Report',
        description: 'Professional PDF with header, summary statistics, category breakdown, and full transaction table.',
    },
    csv: {
        icon: '📊',
        title: 'CSV Spreadsheet',
        description: 'Comma-separated file with all transactions. Import into Excel or Google Sheets for further analysis.',
    },
}

export default function ExportInfoCard({ format }: ExportInfoCardProps) {
    const info = INFO_TEXT[format]

    return (
        <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '20px', flexShrink: 0 }}>{info.icon}</div>
                <div>
                    <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'var(--ink-primary)',
                        marginBottom: '4px',
                    }}>
                        {info.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: '1.6' }}>
                        {info.description}
                    </div>
                </div>
            </div>
        </div>
    )
}