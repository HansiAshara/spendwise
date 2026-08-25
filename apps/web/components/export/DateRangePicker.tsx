// ============================================
// DateRangePicker Component
// ============================================
// Quick preset pills + custom From/To date inputs.
// All state lives in parent via useExport hook —
// this component just renders and calls callbacks.
// ============================================

'use client'

interface DateRangePickerProps {
    startDate: string
    endDate: string
    onStartChange: (date: string) => void
    onEndChange: (date: string) => void
    onPreset: (preset: string) => void
}

const PRESETS = [
    { label: 'This month', value: 'this_month' },
    { label: 'Last month', value: 'last_month' },
    { label: 'Last 3 months', value: 'last_3_months' },
    { label: 'This year', value: 'this_year' },
]

export default function DateRangePicker({
    startDate,
    endDate,
    onStartChange,
    onEndChange,
    onPreset,
}: DateRangePickerProps) {
    return (
        <div className="card" style={{ padding: '20px' }}>
            <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--ink-primary)',
                marginBottom: '14px',
            }}>
                Date range
            </div>

            {/* Quick presets */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                {PRESETS.map(preset => (
                    <button
                        key={preset.value}
                        onClick={() => onPreset(preset.value)}
                        style={{
                            padding: '5px 12px',
                            borderRadius: '20px',
                            border: '1px solid var(--ink-border)',
                            background: 'var(--card-bg)',
                            fontSize: '12px',
                            color: 'var(--ink-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--primary-500)'
                            e.currentTarget.style.color = 'var(--primary-500)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--ink-border)'
                            e.currentTarget.style.color = 'var(--ink-secondary)'
                        }}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {/* Custom date inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label className="form-label">From</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => onStartChange(e.target.value)}
                        className="form-input"
                        max={endDate}
                    />
                </div>
                <div>
                    <label className="form-label">To</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={e => onEndChange(e.target.value)}
                        className="form-input"
                        min={startDate}
                    />
                </div>
            </div>
        </div>
    )
}