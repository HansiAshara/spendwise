// ============================================
// Auth Layout — Split Screen Design
// ============================================
// Shared layout for /login and /register pages.
//
// Left side  → Brand story, features list
// Right side → The actual form (login or register)
//
// This layout only applies to pages inside (auth)/.
// Dashboard pages get a completely different layout.
// ============================================

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: 'var(--page-bg)',
        }}>

            {/* ── Left side — Brand panel ─────────────────── */}
            {/* Hidden on mobile, shown on tablet and above  */}
            <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, #1e40af 0%, #4338CA 50%, #6366F1 100%)',
                padding: '48px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
                className="hidden md:flex"
            >

                {/* Background decoration circles */}
                <div style={{
                    position: 'absolute', top: '-80px', right: '-80px',
                    width: '300px', height: '300px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-60px', left: '-60px',
                    width: '200px', height: '200px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                }} />

                {/* Logo */}
                <div style={{ marginBottom: '48px', position: 'relative' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        marginBottom: '8px',
                    }}>
                        {/* Logo icon */}
                        <div style={{
                            width: '40px', height: '40px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '20px',
                        }}>
                            💰
                        </div>
                        <span style={{
                            fontSize: '22px', fontWeight: '600', color: 'white',
                            letterSpacing: '-0.5px',
                        }}>
                            SpendWise
                        </span>
                    </div>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6' }}>
                        Personal finance tracker built for<br />
                        Sri Lankan students and young adults.
                    </p>
                </div>

                {/* Feature list */}
                <div style={{ position: 'relative' }}>
                    {[
                        { icon: '📊', title: 'Visual spending breakdown', desc: 'Pie charts, bar charts, and trend lines' },
                        { icon: '🎯', title: 'Smart budget goals', desc: 'Alerts when you hit 80% or 100%' },
                        { icon: '🤖', title: 'AI-powered insights', desc: 'Personalised tips from Claude AI' },
                        { icon: '🇱🇰', title: 'Built for Sri Lanka', desc: 'LKR currency, local context' },
                    ].map((feature) => (
                        <div key={feature.title} style={{
                            display: 'flex', alignItems: 'flex-start',
                            gap: '14px', marginBottom: '24px',
                        }}>
                            {/* Feature icon box */}
                            <div style={{
                                width: '36px', height: '36px',
                                background: 'rgba(255,255,255,0.15)',
                                borderRadius: '8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '18px', flexShrink: 0,
                            }}>
                                {feature.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginBottom: '2px' }}>
                                    {feature.title}
                                </div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                                    {feature.desc}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom quote */}
                <div style={{
                    marginTop: 'auto',
                    padding: '16px',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    borderLeft: '3px solid rgba(255,255,255,0.3)',
                    position: 'relative',
                }}>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', fontStyle: 'italic' }}>
                        "Financial literacy is the key to a secure future.
                        Start tracking today."
                    </p>
                </div>

            </div>

            {/* ── Right side — Form area ───────────────────── */}
            {/* This is where login/register page.tsx renders */}
            <div style={{
                width: '100%',
                maxWidth: '480px',
                padding: '48px 40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: 'white',
                boxShadow: '-4px 0 24px rgba(0,0,0,0.04)',
            }}>
                {children}
            </div>

        </div>
    )
}