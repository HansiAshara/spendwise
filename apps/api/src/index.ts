// ============================================
// SpendWise API — Entry Point
// ============================================
// This file only does 4 things:
//   1. Sets up middleware
//   2. Registers routes
//   3. Connects to database
//   4. Starts the server
// All actual logic lives in routes/controllers/services
// ============================================

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'
import prisma from './config/database'
import router from './routes/index'
import { errorHandler, notFoundHandler } from './middleware/error.middleware'

const app = express()

// ── Security Middleware ──────────────────────────────
app.use(helmet())           // sets secure HTTP headers automatically
app.use(cors({
	origin: env.corsOrigin,  // only allow our frontend URL
	credentials: true,            // allow cookies and auth headers
}))

// ── Logging Middleware ───────────────────────────────
// Prints every request in terminal: GET /api/health 200 3ms
app.use(morgan(env.isDev ? 'dev' : 'combined'))

// ── Body Parser Middleware ───────────────────────────
app.use(express.json())                         // parse JSON bodies
app.use(express.urlencoded({ extended: true })) // parse form data

// ── API Routes ───────────────────────────────────────
// All routes are prefixed with /api
// e.g. /api/health, /api/auth/login, /api/expenses
app.use('/api', router)

// ── 404 Handler ──────────────────────────────────────
// If no route matched anywhere above, return 404
// IMPORTANT: must be AFTER all routes
app.use(notFoundHandler)

// ── Global Error Handler ─────────────────────────────
// Catches any unhandled errors thrown in any route
// IMPORTANT: must be LAST middleware in the whole file
app.use(errorHandler)

// ── Start Server ─────────────────────────────────────
async function startServer() {
	try {
		// Connect to database first before accepting any requests
		await prisma.$connect()
		console.log('✅ Database connected')

		app.listen(env.port, () => {
			console.log(`🚀 API running   → http://localhost:${env.port}`)
			console.log(`📋 Health check  → http://localhost:${env.port}/api/health`)
			console.log(`🌍 Environment   → ${env.nodeEnv}`)
		})
	} catch (error) {
		// If DB connection fails, stop the server completely
		console.error('❌ Failed to start server:', error)
		process.exit(1)
	}
}

// Connect to database when this module loads
// Works for both traditional server AND serverless environments
prisma.$connect()
	.then(() => console.log('✅ Database connected'))
    .catch((err) => console.error('❌ Database connection failed:', err))




export default app