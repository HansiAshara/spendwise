// ============================================
// ExportPreview Component
// ============================================
// Shows live count + total for the current filters
// before the user commits to downloading.
// Has its own loading skeleton state.
// ============================================

'use client'

import { Preview } from '@/hooks/useExport'
import { formatLKRCompact } from '@/lib/utils'

interface ExportPreviewProps {
    preview: Preview | null
    loading: boolean
    startDate: string
    endDate: string
}

export default function ExportPreview({ preview, loading, startDate, endDate }: ExportPreviewProps) {
    return (
        <div className="card" style={{ padding: '20px' }}>
            <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--ink-primary)',
                marginBottom: '16px',
            }}>
                Export preview
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="skeleton" style={{ height: '14px', width: '70%' }} />
                    <div className="skeleton" style={{ height: '14px', width: '50%' }} />
                </div>
            ) : preview ? (
                <div>
                    {/* Transaction count */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px',
                        background: preview.count > 0 ? 'var(--primary-50)' : 'var(--page-bg)',
                        borderRadius: '10px',
                        marginBottom: '10px',
                        border: `1px solid ${preview.count > 0 ? 'rgba(99,102,241,0.2)' : 'var(--ink-border)'}`,
                    }}>
                        <div style={{ fontSize: '22px' }}>
                            {preview.count > 0 ? '📋' : '📭'}
                        </div>
                        <div>
                            <div style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                color: preview.count > 0 ? 'var(--primary-600)' : 'var(--ink-muted)',
                            }}>
                                {preview.count} transaction{preview.count !== 1 ? 's' : ''}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                                {preview.count > 0 ? 'Ready to export' : 'No data for this filter'}
                            </div>
                        </div>
                    </div>

                    {/* Total amount */}
                    {preview.count > 0 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 12px',
                            background: 'var(--page-bg)',
                            borderRadius: '8px',
                            border: '1px solid var(--ink-border)',
                            marginBottom: '10px',
                        }}>
                            <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                                Total amount
                            </span>
                            <span style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'var(--ink-primary)',
                                fontVariantNumeric: 'tabular-nums',
                            }}>
                                {formatLKRCompact(preview.total)}
                            </span>
                        </div>
                    )}

                    {/* Date range info */}
                    <div style={{ fontSize: '11px', color: 'var(--ink-faint)', textAlign: 'center' }}>
                        {new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {' — '}
                        {new Date(endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                </div>
            ) : (
                <div style={{ fontSize: '13px', color: 'var(--ink-muted)', textAlign: 'center', padding: '16px 0' }}>
                    Select filters to preview
                </div>
            )}
        </div>
    )
}