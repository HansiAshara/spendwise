// ============================================
// Footer
// ============================================

import Logo from '@/components/ui/Logo'

export default function Footer() {
    return (
        <footer style={{ borderTop: '1px solid var(--ink-border)', padding: '32px 24px', background: 'var(--page-bg)' }}>
            <div style={{
                maxWidth: '1080px', margin: '0 auto',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '12px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Logo size={24} />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink-primary)' }}>SpendWise</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>
                    © {new Date().getFullYear()} SpendWise. Built for Sri Lankan students.
                </p>
            </div>
        </footer>
    )
}