// ============================================
// CategoryFilter Component
// ============================================
// Simple dropdown to filter export by category.
// ============================================

'use client'

import { Category } from '@/hooks/useExport'

interface CategoryFilterProps {
    categories: Category[]
    value: string
    onChange: (categoryId: string) => void
}

export default function CategoryFilter({ categories, value, onChange }: CategoryFilterProps) {
    return (
        <div className="card" style={{ padding: '20px' }}>
            <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--ink-primary)',
                marginBottom: '14px',
            }}>
                Filter by category
                <span style={{
                    fontSize: '11px',
                    fontWeight: '400',
                    color: 'var(--ink-faint)',
                    marginLeft: '8px',
                }}>
                    optional
                </span>
            </div>

            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="form-input"
            >
                <option value="">All categories</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                    </option>
                ))}
            </select>
        </div>
    )
}