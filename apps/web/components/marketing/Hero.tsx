// ============================================
// Hero Section
// ============================================

'use client'

import Link from 'next/link'

export default function Hero() {
    return (
        <section style={{
            padding: '80px 24px 60px',
            textAlign: 'center',
            maxWidth: '760px', margin: '0 auto',
        }}>
            <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '5px 14px', background: 'var(--primary-50)',
                borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                color: 'var(--primary-600)', marginBottom: '24px',
            }}>
                🇱🇰 Built for Sri Lankan students
            </div>

            <h1 style={{
                fontSize: '44px', fontWeight: '700', lineHeight: '1.15',
                color: 'var(--ink-primary)', letterSpacing: '-1px', marginBottom: '20px',
            }}>
                Track your money.<br />
                <span style={{ color: 'var(--primary-500)' }}>Save without stress.</span>
            </h1>

            <p style={{
                fontSize: '16px', color: 'var(--ink-muted)', lineHeight: '1.7',
                maxWidth: '520px', margin: '0 auto 32px',
            }}>
                SpendWise helps you log expenses, set budgets, and get AI-powered saving tips
                in LKR — built specifically for students managing money in Sri Lanka.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/register" className="btn btn-primary btn-lg">
                    Get started — it's free
                </Link>
                <a href="#how-it-works" className="btn btn-secondary btn-lg">
                    See how it works
                </a>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--ink-faint)', marginTop: '16px' }}>
                No credit card required · Free forever
            </p>
        </section>
    )
}