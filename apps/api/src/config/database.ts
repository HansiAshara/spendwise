// ============================================
// Prisma Client Singleton
// ============================================
// We create ONE Prisma instance and reuse it
// across the whole app. Creating multiple
// instances causes connection pool problems.
// ============================================

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']  // show SQL queries in dev
        : ['error'],                   // only errors in production
})

export default prisma