// ============================================
// Bar Chart — Monthly Spending Trend
// ============================================
// Shows last 6 months of total spending.
// Current month bar is highlighted in indigo.
// Previous months in lighter color.
// Gradient fill makes it look premium.
// ============================================

'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { MonthlyTrend } from '@/types'
import { formatLKRCompact } from '@/lib/utils'

Chart.register(...registerables)

interface BarChartProps {
    data: MonthlyTrend[]
    loading: boolean
}

export default function BarChart({ data, loading }: BarChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const chartRef = useRef<Chart | null>(null)

    useEffect(() => {
        if (!canvasRef.current || loading || data.length === 0) return

        if (chartRef.current) chartRef.current.destroy()

        const ctx = canvasRef.current.getContext('2d')
        if (!ctx) return

        // Create gradient for current month bar
        const gradientCurrent = ctx.createLinearGradient(0, 0, 0, 300)
        gradientCurrent.addColorStop(0, '#6366F1')
        gradientCurrent.addColorStop(1, '#818CF8')

        // Lighter gradient for previous months
        const gradientPrev = ctx.createLinearGradient(0, 0, 0, 300)
        gradientPrev.addColorStop(0, '#C7D2FE')
        gradientPrev.addColorStop(1, '#E0E7FF')

        // Current month is the last item in array
        const currentIdx = data.length - 1

        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.label),
                datasets: [{
                    label: 'Total spent (LKR)',
                    data: data.map(d => d.total),
                    // Current month gets primary color, rest get lighter
                    backgroundColor: data.map((_, i) =>
                        i === currentIdx ? gradientCurrent : gradientPrev
                    ),
                    borderRadius: 8,
                    borderSkipped: false,
                    barThickness: 32,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#0F172A',
                        padding: 12,
                        cornerRadius: 10,
                        titleFont: { size: 13, weight: 'bold' },
                        bodyFont: { size: 12 },
                        callbacks: {
                            label: (ctx) => ` ${formatLKRCompact(ctx.raw as number)}`,
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: {
                            font: { size: 11, family: 'Inter, sans-serif' },
                            color: '#94A3B8',
                        },
                    },
                    y: {
                        grid: {
                            color: 'rgba(226,232,240,0.6)',
                            lineWidth: 1,
                        },
                        border: { display: false, dash: [4, 4] },
                        ticks: {
                            font: { size: 11, family: 'Inter, sans-serif' },
                            color: '#94A3B8',
                            maxTicksLimit: 5,
                            callback: (val) => formatLKRCompact(val as number),
                        },
                    },
                },
                animation: {
                    duration: 700,
                    easing: 'easeInOutQuart',
                },
            },
        })

        return () => { chartRef.current?.destroy() }
    }, [data, loading])

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px', padding: '0 8px' }}>
                {[60, 80, 50, 90, 70, 100].map((h, i) => (
                    <div key={i} className="skeleton" style={{
                        flex: 1, height: `${h}%`, borderRadius: '6px',
                    }} />
                ))}
            </div>
        )
    }

    if (data.length === 0 || data.every(d => d.total === 0)) {
        return (
            <div className="empty-state" style={{ padding: '30px 0' }}>
                <div className="empty-state-icon" style={{ fontSize: '36px' }}>📈</div>
                <div className="empty-state-title" style={{ fontSize: '14px' }}>No trend data</div>
                <div className="empty-state-desc">Track expenses for multiple months to see trends</div>
            </div>
        )
    }

    return (
        <div style={{ height: '200px', position: 'relative' }}>
            <canvas ref={canvasRef} />
        </div>
    )
}