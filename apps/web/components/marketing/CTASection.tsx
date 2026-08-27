// ============================================
// Bottom CTA Section
// ============================================

'use client'

import Link from 'next/link'

export default function CTASection() {
    return (
        <section style={{ padding: '60px 24px' }}>
            <div style={{
                maxWidth: '800px', margin: '0 auto',
                background: 'linear-gradient(135deg, #1e40af 0%, #4338CA 50%, #6366F1 100%)',
                borderRadius: '24px', padding: '48px 32px', textAlign: 'center',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: '-60px', right: '-60px',
                    width: '200px', height: '200px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                }} />

                <h2 style={{ fontSize: '26px', fontWeight: '700', color: 'white', marginBottom: '12px', position: 'relative' }}>
                    Start tracking your spending today
                </h2>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '28px', position: 'relative' }}>
                    Join students across Sri Lanka taking control of their finances.
                </p>
                <Link
                    href="/register"
                    className="btn btn-lg"
                    style={{ background: 'white', color: 'var(--primary-600)', position: 'relative', display: 'inline-flex' }}
                >
                    Create your free account
                </Link>
            </div>
        </section>
    )
}