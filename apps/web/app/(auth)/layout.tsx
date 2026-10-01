// ============================================
// Auth Layout — Premium Animated Split Screen
// ============================================
// Left: Animated brand panel with gradient, floating orbs,
//       glassmorphism feature cards, and trust badges.
// Right: Clean form area, light/dark theme aware.
// Mobile: Full-screen form only.
// ============================================

import Logo from '@/components/ui/Logo'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <style>{`
                @keyframes auth-pulse {
                    0%, 100% { opacity: 0.15; transform: scale(1); }
                    50%      { opacity: 0.30; transform: scale(1.1); }
                }
                @keyframes auth-fade-up {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes auth-stagger {
                    from { opacity: 0; transform: translateX(-12px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes auth-float {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-14px); }
                }
                @keyframes auth-bg-shift {
                    0%   { background-position: 0% 50%; }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .auth-shell {
                    display: flex;
                    min-height: 100vh;
                    width: 100%;
                }

                /* ── Left brand panel ── */
                .auth-left {
                    flex: 0 0 46%;
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(-45deg, #1e3a8a, #3730a3, #4f46e5, #5b21b6, #7c3aed);
                    background-size: 400% 400%;
                    animation: auth-bg-shift 12s ease infinite;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 56px 52px;
                }

                .auth-left-mesh {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
                    background-size: 44px 44px;
                    pointer-events: none;
                    z-index: 0;
                }

                .auth-orb {
                    position: absolute;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 0;
                    animation: auth-pulse var(--orb-dur, 8s) ease-in-out infinite;
                    animation-delay: var(--orb-delay, 0s);
                }

                .auth-brand-inner {
                    position: relative;
                    z-index: 2;
                    max-width: 420px;
                    animation: auth-fade-up 0.9s ease-out both;
                }

                .auth-logo-box {
                    width: 50px;
                    height: 50px;
                    border-radius: 14px;
                    background: rgba(255,255,255,0.14);
                    border: 1.5px solid rgba(255,255,255,0.22);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(10px);
                    animation: auth-float 5s ease-in-out infinite;
                }

                .auth-feature-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                    padding: 12px 14px;
                    border-radius: 12px;
                    background: rgba(255,255,255,0.07);
                    border: 1px solid rgba(255,255,255,0.1);
                    backdrop-filter: blur(8px);
                    transition: background 0.25s, border-color 0.25s, transform 0.25s;
                    animation: auth-stagger 0.6s ease-out both;
                }
                .auth-feature-card:hover {
                    background: rgba(255,255,255,0.13);
                    border-color: rgba(255,255,255,0.22);
                    transform: translateX(4px);
                }

                .auth-feature-icon {
                    width: 36px;
                    height: 36px;
                    flex-shrink: 0;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.12);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                }

                .auth-trust-row {
                    display: flex;
                    gap: 18px;
                    flex-wrap: wrap;
                    margin-top: 28px;
                    padding-top: 22px;
                    border-top: 1px solid rgba(255,255,255,0.12);
                }

                .auth-trust-item {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 11px;
                    color: rgba(255,255,255,0.6);
                    font-weight: 500;
                }

                /* ── Right form panel ── */
                .auth-right {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 40px 24px;
                    background: var(--page-bg);
                    position: relative;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
                .auth-right::before {
                    content: '';
                    position: absolute;
                    top: -120px; right: -120px;
                    width: 380px; height: 380px;
                    border-radius: 50%;
                    background: radial-gradient(circle, var(--primary-100) 0%, transparent 70%);
                    pointer-events: none;
                    opacity: 0.6;
                }
                .auth-right::after {
                    content: '';
                    position: absolute;
                    bottom: -100px; left: -100px;
                    width: 300px; height: 300px;
                    border-radius: 50%;
                    background: radial-gradient(circle, var(--primary-50) 0%, transparent 70%);
                    pointer-events: none;
                    opacity: 0.5;
                }

                .auth-form-inner {
                    position: relative;
                    z-index: 1;
                    max-width: 440px;
                    width: 100%;
                    background: var(--card-bg);
                    border: 1px solid var(--ink-border);
                    border-radius: 20px;
                    padding: 38px 34px;
                    box-shadow:
                        0 4px 6px -1px rgba(0, 0, 0, 0.04),
                        0 10px 25px -5px rgba(0, 0, 0, 0.06),
                        0 20px 48px -12px rgba(99, 102, 241, 0.08);
                    animation: auth-fade-up 0.7s ease-out 0.1s both;
                    backdrop-filter: blur(12px);
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                [data-theme="dark"] .auth-form-inner {
                    background: rgba(30, 41, 59, 0.82);
                    border: 1px solid rgba(255, 255, 255, 0.09);
                    box-shadow:
                        0 4px 20px -2px rgba(0, 0, 0, 0.4),
                        0 12px 32px -4px rgba(0, 0, 0, 0.5),
                        0 0 0 1px rgba(255, 255, 255, 0.05),
                        0 0 40px -10px rgba(99, 102, 241, 0.15);
                }

                /* ── Mobile ── */
                @media (max-width: 900px) {
                    .auth-left { display: none !important; }
                    .auth-right {
                        background: var(--page-bg) !important;
                        padding: 32px 16px !important;
                        justify-content: flex-start !important;
                        padding-top: 48px !important;
                    }
                    .auth-right::before, .auth-right::after { display: none; }
                    .auth-mobile-logo { display: flex !important; }
                    .auth-form-inner {
                        padding: 28px 22px !important;
                        border-radius: 16px !important;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
                    }
                }
                @media (max-width: 480px) {
                    .auth-right { padding: 20px 12px !important; padding-top: 36px !important; }
                    .auth-form-inner { padding: 24px 16px !important; }
                }

                .auth-mobile-logo {
                    display: none;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 24px;
                }
            `}</style>

            <div className="auth-shell">

                {/* ══ Left — Animated Brand Panel ═════════════════ */}
                <div className="auth-left">
                    {/* Grid mesh overlay */}
                    <div className="auth-left-mesh" />

                    {/* Floating orbs */}
                    <div className="auth-orb" style={{
                        width: 340, height: 340,
                        top: '-100px', right: '-100px',
                        background: 'rgba(167,139,250,0.2)',
                        ['--orb-dur' as any]: '9s',
                        ['--orb-delay' as any]: '0s',
                    }} />
                    <div className="auth-orb" style={{
                        width: 220, height: 220,
                        bottom: '-70px', left: '-70px',
                        background: 'rgba(96,165,250,0.22)',
                        ['--orb-dur' as any]: '11s',
                        ['--orb-delay' as any]: '-3.5s',
                    }} />
                    <div className="auth-orb" style={{
                        width: 110, height: 110,
                        top: '42%', right: '10%',
                        background: 'rgba(216,180,254,0.18)',
                        ['--orb-dur' as any]: '7s',
                        ['--orb-delay' as any]: '-1.8s',
                    }} />

                    {/* Brand content */}
                    <div className="auth-brand-inner">

                        {/* Logo row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                            <div className="auth-logo-box">
                                <Logo size={28} />
                            </div>
                            <div>
                                <div style={{ fontSize: '21px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                                    SpendWise
                                </div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    Finance Tracker
                                </div>
                            </div>
                        </div>

                        {/* Hero tagline */}
                        <p style={{
                            fontSize: '26px',
                            fontWeight: '700',
                            color: 'white',
                            lineHeight: 1.25,
                            marginBottom: '10px',
                            letterSpacing: '-0.5px',
                        }}>
                            Take control of<br />
                            <span style={{
                                background: 'linear-gradient(90deg, #a5b4fc 0%, #f0abfc 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                your finances
                            </span>
                        </p>
                        <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.7, marginBottom: '28px', maxWidth: '340px' }}>
                            Track every rupee, set budgets, and grow smarter with AI-powered insights — built for Sri Lanka.
                        </p>

                        {/* Features */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                            {[
                                { icon: '📊', title: 'Visual spending breakdown', desc: 'Pie, bar & trend charts', delay: '0.3s' },
                                { icon: '🎯', title: 'Smart budget goals',        desc: 'Alerts at 80% & 100%',   delay: '0.45s' },
                                { icon: '🤖', title: 'AI-powered insights',       desc: 'Personalised tips',      delay: '0.6s' },
                                { icon: '🇱🇰', title: 'Built for Sri Lanka',      desc: 'LKR currency, local context', delay: '0.75s' },
                            ].map((f) => (
                                <div key={f.title} className="auth-feature-card" style={{ animationDelay: f.delay }}>
                                    <div className="auth-feature-icon">{f.icon}</div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '600', color: 'white', marginBottom: '2px' }}>
                                            {f.title}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                                            {f.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Trust badges */}
                        <div className="auth-trust-row">
                            {[
                                { icon: '🔒', label: 'Secure & private' },
                                { icon: '⚡', label: 'Free forever' },
                                { icon: '🌙', label: 'Dark mode ready' },
                            ].map((b) => (
                                <div key={b.label} className="auth-trust-item">
                                    <span>{b.icon}</span>
                                    <span>{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ══ Right — Form Panel ═══════════════════════════ */}
                <div className="auth-right">
                    <div className="auth-form-inner">

                        {/* Mobile logo (hidden on desktop) */}
                        <div className="auth-mobile-logo">
                            <Logo size={28} />
                            <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink-primary)' }}>
                                SpendWise
                            </span>
                        </div>

                        {children}
                    </div>
                </div>

            </div>
        </>
    )
}