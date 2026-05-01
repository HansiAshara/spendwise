// ============================================
// Database Seed File
// Fills the categories table with default data
// Run with: npm run seed
// ============================================

import { PrismaClient } from '@prisma/client'

declare const process: {
    exit: (code?: number) => never
}

const prisma = new PrismaClient()

async function main() {
    console.log(' Seeding categories...')

    const categories = [
        { name: 'Food', icon: '🍔', color: '#FF6384' },
        { name: 'Transport', icon: '🚌', color: '#36A2EB' },
        { name: 'Education', icon: '📚', color: '#FFCE56' },
        { name: 'Entertainment', icon: '🎮', color: '#4BC0C0' },
        { name: 'Health', icon: '💊', color: '#9966FF' },
        { name: 'Utilities', icon: '💡', color: '#FF9F40' },
        { name: 'Shopping', icon: '🛍️', color: '#FF6B6B' },
        { name: 'Other', icon: '📦', color: '#C9CBCF' },
    ]

    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name }, // if exists, skip
            update: {},                       // don't change anything
            create: category,                 // if not exists, create
        })
        console.log(`  ✅ ${category.icon}  ${category.name}`)
    }

    console.log('✅ Seeding complete!')
}

main()
    .catch((error) => {
        console.error('❌ Seed failed:', error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })