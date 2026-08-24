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
	origin: (origin, callback) => {
		// Allow requests with no origin (like mobile apps, curl, server-to-server)
		if (!origin) return callback(null, true);
		
		const allowedOrigins = [
			env.corsOrigin,
			'https://spendwise-web-zeta.vercel.app',
			'http://localhost:3000',
			'http://localhost:5000'
		];
		
		if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
			return callback(null, true);
		}
		
		return callback(null, true); // Allow all Vercel origins during dev/prod setup
	},
	credentials: true,            // allow cookies and auth headers
	exposedHeaders: ['Content-Disposition', 'Content-Type', 'Content-Length'],
}))

// ── Logging Middleware ───────────────────────────────
// Prints every request in terminal: GET /api/health 200 3ms
app.use(morgan(env.isDev ? 'dev' : 'combined'))

// ── Body Parser Middleware ───────────────────────────
app.use(express.json())                         // parse JSON bodies
app.use(express.urlencoded({ extended: true })) // parse form data

// ── API Routes ───────────────────────────────────────
// Root status check
app.get('/', (req, res) => {
	res.json({ message: 'SpendWise API is running!' })
})

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

// Connect to database when this module loads
prisma.$connect()
	.then(() => console.log('✅ Database connected'))
	.catch((err) => console.error('❌ Database connection failed:', err))

export default app