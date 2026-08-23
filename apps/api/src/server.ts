// ============================================
// Local Development Server Entry
// ============================================
// Only used for `npm run dev` locally.
// Vercel's serverless deployment never touches
// this file — it uses index.ts's exported `app`
// directly through the /api catch-all function.
// ============================================

import app from './index'
import { env } from './config/env'

app.listen(env.port, () => {
    console.log(`🚀 API running   → http://localhost:${env.port}`)
    console.log(`📋 Health check  → http://localhost:${env.port}/api/health`)
    console.log(`🌍 Environment   → ${env.nodeEnv}`)
})