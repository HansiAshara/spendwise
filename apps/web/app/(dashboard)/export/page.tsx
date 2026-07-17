// ============================================
// Export Page
// ============================================
// Composes all export sub-components together.
// All state and API logic lives in useExport hook.
// This file only handles layout and wiring.
// ============================================

'use client'

import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import FormatSelector from '@/components/export/FormatSelector'
import DateRangePicker from '@/components/export/DateRangePicker'
import CategoryFilter from '@/components/export/CategoryFilter'
import ExportPreview from '@/components/export/ExportPreview'
import ExportInfoCard from '@/components/export/ExportInfoCard'
import { useExport } from '@/hooks/useExport'
import { useToast } from '@/hooks/useToast'

export default function ExportPage() {
    const {
        format, setFormat,
        startDate, setStartDate,
        endDate, setEndDate,
        categoryId, setCategoryId,
        categories,
        preview, previewLoading,
        downloading,
        applyPreset,
        downloadFile,
    } = useExport()

    const { toasts, addToast, removeToast } = useToast()
    const toast = toasts[0]

    const handleDownload = async () => {
        const result = await downloadFile()
        addToast(result.message, result.success ? 'success' : 'error')
    }

    return (
        <div className="page-animate">

            <PageHeader
                title="Export"
                subtitle="Download your expense data as PDF or CSV"
            />

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 320px',
                gap: '20px',
                alignItems: 'start',
            }}>

                {/* ── Left column — filters ─────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <FormatSelector
                        format={format}
                        onChange={setFormat}
                    />

                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartChange={setStartDate}
                        onEndChange={setEndDate}
                        onPreset={applyPreset}
                    />

                    <CategoryFilter
                        categories={categories}
                        value={categoryId}
                        onChange={setCategoryId}
                    />
                </div>

                {/* ── Right column — preview + download ─────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    <ExportPreview
                        preview={preview}
                        loading={previewLoading}
                        startDate={startDate}
                        endDate={endDate}
                    />

                    <ExportInfoCard format={format} />

                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleDownload}
                        loading={downloading}
                        disabled={downloading || preview?.count === 0}
                        fullWidth
                        style={{
                            height: '48px',
                            fontSize: '14px',
                            boxShadow: preview && preview.count > 0
                                ? '0 4px 14px rgba(99,102,241,0.35)'
                                : 'none',
                        }}
                    >
                        {!downloading && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        )}
                        {downloading
                            ? 'Preparing download...'
                            : preview?.count === 0
                                ? 'No data to export'
                                : `Download ${format.toUpperCase()}`
                        }
                    </Button>

                    <p style={{
                        fontSize: '11px',
                        color: 'var(--ink-faint)',
                        textAlign: 'center',
                        lineHeight: '1.6',
                    }}>
                        Files are generated on demand and not stored on our servers.
                        Your data stays private.
                    </p>

                </div>
            </div>

            <Toast
                message={toast?.message ?? ''}
                type={toast?.type === 'success' || toast?.type === 'error' ? toast.type : 'error'}
                visible={!!toast}
                onClose={() => toast && removeToast(toast.id)}
            />

        </div>
    )
}