import Image from 'next/image'

interface LogoProps {
    size?: number
    className?: string
    style?: React.CSSProperties
    withText?: boolean
    textColor?: string
    subtextColor?: string
}

export default function Logo({
    size = 36,
    className = '',
    style = {},
    withText = false,
    textColor = 'var(--ink-primary)',
    subtextColor = 'var(--ink-muted)',
}: LogoProps) {
    const icon = (
        <div
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
                ...style,
            }}
            className={className}
        >
            <Image
                src="/logo.png"
                alt="SpendWise Logo"
                width={size}
                height={size}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                }}
                priority
            />
        </div>
    )

    if (!withText) return icon

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {icon}
            <div>
                <div style={{
                    fontSize: `${Math.max(14, Math.round(size * 0.42))}px`,
                    fontWeight: '600',
                    color: textColor,
                    letterSpacing: '-0.3px',
                    lineHeight: 1.2,
                }}>
                    SpendWise
                </div>
                <div style={{
                    fontSize: `${Math.max(10, Math.round(size * 0.28))}px`,
                    color: subtextColor,
                    lineHeight: 1.2,
                }}>
                    Personal Finance
                </div>
            </div>
        </div>
    )
}
