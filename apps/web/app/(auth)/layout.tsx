// ============================================
// Auth Layout — Split Screen Design (v2)
// ============================================
// Fixed: both sides now have balanced, capped widths
// instead of the banner stretching infinitely on
// wide screens. Centered as a whole on the page.
// ============================================

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--page-bg)',
            width: '100%',
        }}>

            {/* Full-viewport shell — edge-to-edge auth layout */}
            <div
                className="auth-shell"
                style={{
                    display: 'flex',
                    width: '100%',
                    minHeight: '100vh',
                }}
            >

                {/* ── Left side — Brand panel ─────────────────── */}
                <div
                    className="auth-left"
                    style={{
                        flex: '0 0 48%',
                        background: 'linear-gradient(135deg, #1e40af 0%, #4338CA 50%, #6366F1 100%)',
                        padding: '48px 40px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Background decoration circles */}
                    <div style={{
                        position: 'absolute', top: '-80px', right: '-80px',
                        width: '260px', height: '260px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-60px', left: '-60px',
                        width: '180px', height: '180px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                    }} />

                    <div style={{
                        width: '100%',
                        maxWidth: '440px',
                        margin: '0 auto',
                        position: 'relative',
                    }}>
                        {/* Logo */}
                        <div style={{ marginBottom: '40px', position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{
                                    width: '38px', height: '38px', background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '10px', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontSize: '19px',
                                }}>
                                    💰
                                </div>
                                <span style={{ fontSize: '20px', fontWeight: '600', color: 'white', letterSpacing: '-0.5px' }}>
                                    SpendWise
                                </span>
                            </div>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6' }}>
                                Personal finance tracker built for Sri Lankan students and young adults.
                            </p>
                        </div>

                        {/* Feature list */}
                        <div style={{ position: 'relative' }}>
                            {[
                                { icon: '📊', title: 'Visual spending breakdown', desc: 'Pie, bar, and trend charts' },
                                { icon: '🎯', title: 'Smart budget goals', desc: 'Alerts at 80% and 100%' },
                                { icon: '🤖', title: 'AI-powered insights', desc: 'Personalised tips' },
                                { icon: '🇱🇰', title: 'Built for Sri Lanka', desc: 'LKR currency, local context' },
                            ].map((feature) => (
                                <div key={feature.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '18px' }}>
                                    <div style={{
                                        width: '32px', height: '32px', background: 'rgba(255,255,255,0.15)',
                                        borderRadius: '8px', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontSize: '15px', flexShrink: 0,
                                    }}>
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '500', color: 'white', marginBottom: '1px' }}>
                                            {feature.title}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                                            {feature.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quote */}
                        <div style={{
                            marginTop: '20px',
                            fontSize: '12px', color: 'rgba(255,255,255,0.55)',
                            fontStyle: 'italic', lineHeight: '1.6',
                        }}>
                            &ldquo;Financial literacy is the key to a secure future.&rdquo;
                        </div>
                    </div>
                </div>

                {/* ── Right side — Form area ───────────────────── */}
                <div
                    className="auth-right"
                    style={{
                        flex: '1',
                        padding: '48px 56px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        backgroundColor: 'var(--card-bg)',
                    }}
                >
                    <div style={{ maxWidth: '360px', width: '100%', margin: '0 auto' }}>
                        {children}
                    </div>
                </div>

            </div>

            {/* Mobile — stack vertically, hide left banner entirely */}
            <style>{`
        @media (max-width: 768px) {
            .auth-shell { flex-direction: column; min-height: 100vh !important; }
            .auth-left  { display: none !important; }
            .auth-right { padding: 28px 20px !important; }
        }
    `}</style>
        </div>
    )
}