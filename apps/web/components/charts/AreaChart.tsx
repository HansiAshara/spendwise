// ============================================
// Area Chart — Daily Spending This Month
// ============================================
// Line chart with gradient fill underneath.
// Shows spending pattern day by day.
// Helps identify peak spending days.
// ============================================

'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { DailySpending } from '@/types'
import { formatLKRCompact, formatLKR } from '@/lib/utils'

Chart.register(...registerables)

interface AreaChartProps {
    data: DailySpending[]
    loading: boolean
}

export default function AreaChart({ data, loading }: AreaChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const chartRef = useRef<Chart | null>(null)

    useEffect(() => {
        if (!canvasRef.current || loading || data.length === 0) return

        if (chartRef.current) chartRef.current.destroy()

        const ctx = canvasRef.current.getContext('2d')
        if (!ctx) return

        // Gradient fill under the line
        const gradient = ctx.createLinearGradient(0, 0, 0, 220)
        gradient.addColorStop(0, 'rgba(99,102,241,0.25)')
        gradient.addColorStop(0.6, 'rgba(99,102,241,0.05)')
        gradient.addColorStop(1, 'rgba(99,102,241,0)')

        // Only show every N-th label to avoid crowding
        const labelInterval = Math.ceil(data.length / 10)

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.label),
                datasets: [{
                    label: 'Daily spending',
                    data: data.map(d => d.total),
                    borderColor: '#6366F1',
                    borderWidth: 2.5,
                    backgroundColor: gradient,   // gradient fill
                    fill: true,       // enable area fill
                    tension: 0.4,        // curve smoothness
                    pointBackgroundColor: '#6366F1',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: (ctx) => {
                        // Only show point if there was spending that day
                        return (ctx.raw as number) > 0 ? 4 : 0
                    },
                    pointHoverRadius: 7,
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
                        titleFont: { size: 12 },
                        bodyFont: { size: 13, weight: 'bold' },
                        callbacks: {
                            title: (items) => items[0].label,
                            label: (ctx) => {
                                const val = ctx.raw as number
                                return val > 0
                                    ? ` Spent: ${formatLKR(val)}`
                                    : ' No spending'
                            },
                        },
                        filter: (item) => (item.raw as number) >= 0,
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: {
                            font: { size: 10, family: 'Inter, sans-serif' },
                            color: '#94A3B8',
                            maxTicksLimit: 10,
                            // Show every Nth label
                            callback: function (_, index) {
                                return index % labelInterval === 0
                                    ? this.getLabelForValue(index)
                                    : ''
                            },
                        },
                    },
                    y: {
                        grid: {
                            color: 'rgba(226,232,240,0.6)',
                            lineWidth: 1,
                        },
                        border: { display: false },
                        ticks: {
                            font: { size: 10, family: 'Inter, sans-serif' },
                            color: '#94A3B8',
                            maxTicksLimit: 5,
                            callback: (val) => formatLKRCompact(val as number),
                        },
                        beginAtZero: true,
                    },
                },
                animation: {
                    duration: 800,
                    easing: 'easeInOutQuart',
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
            },
        })

        return () => { chartRef.current?.destroy() }
    }, [data, loading])

    if (loading) {
        return (
            <div className="skeleton" style={{ height: '200px', borderRadius: '8px' }} />
        )
    }

    const hasData = data.some(d => d.total > 0)

    if (!hasData) {
        return (
            <div className="empty-state" style={{ padding: '30px 0' }}>
                <div className="empty-state-icon" style={{ fontSize: '36px' }}>📉</div>
                <div className="empty-state-title" style={{ fontSize: '14px' }}>No daily data</div>
                <div className="empty-state-desc">Log expenses to see your daily spending pattern</div>
            </div>
        )
    }

    return (
        <div style={{ height: '200px', position: 'relative' }}>
            <canvas ref={canvasRef} />
        </div>
    )
}