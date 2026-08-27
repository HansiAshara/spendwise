// ============================================
// Feature Grid Section
// ============================================

const FEATURES = [
    { icon: '🧾', title: 'Effortless expense logging', desc: 'Add an expense in seconds — pick a category, enter the amount, done.' },
    { icon: '🎯', title: 'Smart budget alerts', desc: "Get warned before you overspend, not after — alerts at 80% and 100% of your budget." },
    { icon: '📊', title: 'Visual spending insights', desc: 'See exactly where your money goes with clear charts, not spreadsheets.' },
    { icon: '🤖', title: 'AI-powered saving tips', desc: 'Personalised suggestions based on your real spending, powered by AI.' },
    { icon: '📄', title: 'Export anytime', desc: 'Download your data as a PDF report or CSV spreadsheet whenever you need it.' },
    { icon: '🔒', title: 'Private by default', desc: 'Your financial data is yours — never shared, never sold.' },
]

export default function FeatureGrid() {
    return (
        <section id="features" style={{ padding: '60px 24px', maxWidth: '1080px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 style={{ fontSize: '30px', fontWeight: '700', color: 'var(--ink-primary)', letterSpacing: '-0.5px', marginBottom: '10px' }}>
                    Everything you need to stay on budget
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                    No complicated spreadsheets. Just clarity.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {FEATURES.map(f => (
                    <div key={f.title} className="card-hover" style={{ padding: '24px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: 'var(--primary-50)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: '20px', marginBottom: '16px',
                            border: '1px solid var(--ink-border)',
                        }}>{f.icon}</div>
                        <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--ink-primary)', marginBottom: '8px' }}>
                            {f.title}
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.6' }}>
                            {f.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}