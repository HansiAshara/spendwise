// ============================================
// Donut Chart — Category Spending
// ============================================
// Shows spending breakdown by category.
// Center displays total amount.
// Legend shows each category with amount + %.
// ============================================

'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { CategorySummary } from '@/types'
import { formatLKRCompact, formatLKR } from '@/lib/utils'

// Register all Chart.js components
Chart.register(...registerables)

interface DonutChartProps {
    data: CategorySummary[]
    loading: boolean
}

export default function DonutChart({ data, loading }: DonutChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const chartRef = useRef<Chart | null>(null)

    useEffect(() => {
        if (!canvasRef.current || loading || data.length === 0) return

        // Destroy previous chart instance before creating new
        // Prevents "canvas already in use" error
        if (chartRef.current) {
            chartRef.current.destroy()
        }

        const ctx = canvasRef.current.getContext('2d')
        if (!ctx) return

        const grandTotal = data.reduce((sum, d) => sum + d.spent, 0)

        chartRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(d => d.categoryName),
                datasets: [{
                    data: data.map(d => d.spent),
                    backgroundColor: data.map(d => d.color),
                    borderColor: data.map(d => d.color),
                    borderWidth: 0,
                    // Gap between segments
                    spacing: 3,
                    // Rounded segment ends
                    borderRadius: 4,
                    hoverOffset: 8,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%', // how thick the donut ring is
                plugins: {
                    legend: { display: false }, // we build custom legend below
                    tooltip: {
                        backgroundColor: '#0F172A',
                        padding: 12,
                        cornerRadius: 10,
                        titleFont: { size: 13, weight: 'bold' },
                        bodyFont: { size: 12 },
                        callbacks: {
                            label: (ctx) => {
                                const val = ctx.raw as number
                                const pct = ((val / grandTotal) * 100).toFixed(1)
                                return ` ${formatLKR(val)} (${pct}%)`
                            },
                        },
                    },
                },
                animation: {
                    animateRotate: true,
                    duration: 800,
                    easing: 'easeInOutQuart',
                },
            },
            // Draw total in center of donut
            plugins: [{
                id: 'centerText',
                beforeDraw: (chart) => {
                    const { ctx, chartArea: { left, right, top, bottom } } = chart
                    const centerX = (left + right) / 2
                    const centerY = (top + bottom) / 2

                    ctx.save()

                    // "TOTAL" label
                    ctx.font = '500 11px Inter, sans-serif'
                    ctx.fillStyle = '#94A3B8'
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    ctx.fillText('TOTAL', centerX, centerY - 12)

                    // Amount value
                    ctx.font = '600 16px Inter, sans-serif'
                    ctx.fillStyle = '#0F172A'
                    ctx.fillText(formatLKRCompact(grandTotal), centerX, centerY + 10)

                    ctx.restore()
                },
            }],
        })

        // Cleanup on unmount
        return () => {
            chartRef.current?.destroy()
        }
    }, [data, loading])

    const grandTotal = data.reduce((sum, d) => sum + d.spent, 0)

    // ── Loading skeleton ─────────────────────────────────
    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div className="skeleton" style={{ width: '160px', height: '160px', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
                            <div className="skeleton" style={{ width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 }} />
                            <div className="skeleton" style={{ height: '12px', flex: 1 }} />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // ── Empty state ──────────────────────────────────────
    if (data.length === 0) {
        return (
            <div className="empty-state" style={{ padding: '30px 0' }}>
                <div className="empty-state-icon" style={{ fontSize: '36px' }}>📊</div>
                <div className="empty-state-title" style={{ fontSize: '14px' }}>No spending data</div>
                <div className="empty-state-desc">Log expenses to see category breakdown</div>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>

            {/* Donut chart canvas */}
            <div style={{ width: '170px', height: '170px', flexShrink: 0, position: 'relative' }}>
                <canvas ref={canvasRef} />
            </div>

            {/* Custom legend */}
            <div style={{ flex: 1, minWidth: 0 }}>
                {data.slice(0, 6).map((item) => {
                    const pct = grandTotal > 0
                        ? ((item.spent / grandTotal) * 100).toFixed(1)
                        : '0'
                    return (
                        <div key={item.categoryId} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '10px',
                        }}>
                            {/* Color dot */}
                            <div style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: item.color,
                                flexShrink: 0,
                            }} />

                            {/* Category name */}
                            <span style={{
                                fontSize: '12px',
                                color: 'var(--ink-secondary)',
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                {item.icon} {item.categoryName}
                            </span>

                            {/* Percentage */}
                            <span style={{
                                fontSize: '11px',
                                color: 'var(--ink-muted)',
                                fontWeight: '500',
                            }}>
                                {pct}%
                            </span>

                            {/* Amount */}
                            <span style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: 'var(--ink-primary)',
                                minWidth: '70px',
                                textAlign: 'right',
                                fontVariantNumeric: 'tabular-nums',
                            }}>
                                {formatLKRCompact(item.spent)}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}