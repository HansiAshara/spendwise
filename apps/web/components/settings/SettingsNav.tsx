'use client'

export type SettingsSection = 'profile' | 'password' | 'notifications' | 'currency' | 'appearance' | 'danger'

interface SettingsNavProps {
    active: SettingsSection
    onChange: (section: SettingsSection) => void
}

const GROUPS: { label: string; items: { id: SettingsSection; label: string; icon: React.ReactNode; danger?: boolean }[] }[] = [
    {
        label: 'Account',
        items: [
            { id: 'profile', label: 'Profile', icon: <IconUser /> },
            { id: 'password', label: 'Password', icon: <IconLock /> },
        ],
    },
    {
        label: 'Preferences',
        items: [
            { id: 'notifications', label: 'Notifications', icon: <IconBell /> },
            { id: 'currency', label: 'Currency', icon: <IconCurrency /> },
            { id: 'appearance', label: 'Appearance', icon: <IconPalette /> },
        ],
    },
    {
        label: 'Danger Zone',
        items: [
            { id: 'danger', label: 'Delete account', icon: <IconTrash />, danger: true },
        ],
    },
]

function IconUser() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg> }
function IconLock() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg> }
function IconBell() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg> }
function IconCurrency() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M9 9h4.5a2 2 0 0 1 0 4H9m0 0h5" /></svg> }
function IconPalette() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="8" cy="10" r="1.2" fill="currentColor" /><circle cx="12" cy="7" r="1.2" fill="currentColor" /><circle cx="16" cy="10" r="1.2" fill="currentColor" /></svg> }
function IconTrash() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg> }

export default function SettingsNav({ active, onChange }: SettingsNavProps) {
    return (
        <div className="card" style={{ padding: '10px', height: 'fit-content' }}>
            {GROUPS.map((group, gi) => (
                <div key={group.label} style={{ marginBottom: gi < GROUPS.length - 1 ? '14px' : 0 }}>
                    <div style={{
                        fontSize: '10px', fontWeight: '600', color: 'var(--ink-faint)',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        padding: '0 10px', marginBottom: '6px',
                    }}>
                        {group.label}
                    </div>
                    {group.items.map(item => {
                        const isActive = active === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => onChange(item.id)}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '9px 10px', borderRadius: '8px', border: 'none',
                                    background: isActive ? (item.danger ? 'var(--danger-bg)' : 'var(--primary-50)') : 'transparent',
                                    color: isActive ? (item.danger ? 'var(--danger)' : 'var(--primary-600)') : (item.danger ? 'var(--danger)' : 'var(--ink-secondary)'),
                                    fontSize: '13px', fontWeight: isActive ? '600' : '500',
                                    cursor: 'pointer', marginBottom: '2px', textAlign: 'left',
                                    fontFamily: 'inherit', transition: 'all 0.15s',
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}