// ============================================
// Vercel Zero-Config Serverless Entry Point
// ============================================
// Vercel automatically detects any file inside
// an /api folder at the project root and turns
// it into a serverless function.
//
// [...slug].ts is a catch-all — it matches ANY
// path starting with /api/ (e.g. /api/auth/login,
// /api/expenses, /api/health) and forwards the
// entire request to our existing Express app.
// ============================================

import app from './src/index'

export default app