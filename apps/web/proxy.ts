// ============================================
// Next.js Proxy (formerly Middleware)
// ============================================
// Runs on EVERY request before the page loads.
// In Next.js 16, middleware.ts → proxy.ts
// and the function must be named 'proxy'
//
// Protects dashboard routes — redirects to
// /login if no token cookie found.
// ============================================

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require login
const protectedRoutes = [
    '/dashboard',
    '/expenses',
    '/budgets',
    '/insights',
    '/export',
    '/settings',
]

// Routes only for non-logged-in users
const authRoutes = ['/login', '/register']

// IMPORTANT: Must be named 'proxy' in Next.js 16
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Read token from cookie
    const token = request.cookies.get('spendwise_token')?.value

    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    const isAuthRoute = authRoutes.some(route =>
        pathname.startsWith(route)
    )

    // No token + protected route → redirect to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Has token + auth route → redirect to dashboard
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

// Which routes to run proxy on
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
}