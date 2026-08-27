// ============================================
// How It Works Section
// ============================================

const STEPS = [
    { num: '1', title: 'Create your free account', desc: 'Sign up in under a minute — no credit card, no hassle.' },
    { num: '2', title: 'Log your expenses', desc: 'Add expenses as they happen. Categorise them in one tap.' },
    { num: '3', title: 'Get insights & save', desc: 'See your spending patterns and get AI tips to save more each month.' },
]

export default function HowItWorks() {
    return (
        <section id="how-it-works" style={{
            padding: '60px 24px', background: 'var(--page-bg)',
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h2 style={{ fontSize: '30px', fontWeight: '700', color: 'var(--ink-primary)', letterSpacing: '-0.5px' }}>
                        Get started in 3 simple steps
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    {STEPS.map(s => (
                        <div key={s.num} style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                                color: 'white', fontSize: '18px', fontWeight: '700',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 16px',
                            }}>{s.num}</div>
                            <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--ink-primary)', marginBottom: '6px' }}>
                                {s.title}
                            </h3>
                            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.6' }}>
                                {s.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}