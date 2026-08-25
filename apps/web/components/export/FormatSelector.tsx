// ============================================
// FormatSelector Component
// ============================================
// Two selectable cards — PDF or CSV.
// Purely presentational — receives format and
// setFormat from parent, no logic of its own.
// ============================================

'use client'

import { ExportFormat } from '@/hooks/useExport'

interface FormatSelectorProps {
    format: ExportFormat
    onChange: (format: ExportFormat) => void
}

// Config for each format option — easy to extend later
const FORMAT_OPTIONS: {
    value: ExportFormat
    icon: string
    title: string
    description: string
}[] = [
        {
            value: 'pdf',
            icon: '📄',
            title: 'PDF Report',
            description: 'Formatted report with charts, summary, and transaction table',
        },
        {
            value: 'csv',
            icon: '📊',
            title: 'CSV Spreadsheet',
            description: 'Raw data file — open in Excel, Google Sheets, or Numbers',
        },
    ]

export default function FormatSelector({ format, onChange }: FormatSelectorProps) {
    return (
        <div className="card" style={{ padding: '20px' }}>
            <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--ink-primary)',
                marginBottom: '14px',
            }}>
                Export format
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {FORMAT_OPTIONS.map(option => {
                    const isSelected = format === option.value
                    return (
                        <button
                            key={option.value}
                            onClick={() => onChange(option.value)}
                            style={{
                                padding: '16px',
                                borderRadius: '12px',
                                border: `2px solid ${isSelected ? 'var(--primary-500)' : 'var(--ink-border)'}`,
                                background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--card-bg)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.15s',
                                fontFamily: 'inherit',
                            }}
                        >
                            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{option.icon}</div>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: isSelected ? 'var(--primary-500)' : 'var(--ink-primary)',
                                marginBottom: '4px',
                            }}>
                                {option.title}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: '1.5' }}>
                                {option.description}
                            </div>

                            {isSelected && (
                                <div style={{
                                    marginTop: '10px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '11px',
                                    fontWeight: '500',
                                    color: 'var(--primary-500)',
                                }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Selected
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}