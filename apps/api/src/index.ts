import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import prisma from './config/database'  // our Prisma singleton

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ── Middleware ───────────────────────────────────────
app.use(helmet())           // adds security headers
app.use(cors({
	origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
	credentials: true,        // allow cookies to be sent
}))
app.use(morgan('dev'))      // logs every request in terminal
app.use(express.json())     // parse JSON request bodies
app.use(express.urlencoded({ extended: true }))

// ── Health Check Route ───────────────────────────────
// This route tests if both the API and DB are working
app.get('/api/health', async (req, res) => {
	try {
		// Run a simple query — if this works, DB is connected
		await prisma.$queryRaw`SELECT 1 AS result`

		res.json({
			success: true,
			message: 'SpendWise API is running',
			database: 'Connected ✅',
			timestamp: new Date().toISOString(),
		})
	} catch (error) {
		// DB query failed
		res.status(500).json({
			success: false,
			message: 'API running but DB connection failed',
			database: 'Disconnected ❌',
		})
	}
})

// ── Start Server ─────────────────────────────────────
async function startServer() {
	try {
		// Test DB connection before accepting requests
		await prisma.$connect()
		console.log('✅ Database connected successfully')

		app.listen(PORT, () => {
			console.log(` API running   → http://localhost:${PORT}`)
			console.log(` Health check  → http://localhost:${PORT}/api/health`)
		})
	} catch (error) {
		// If DB fails, don't start the server at all
		console.error('❌ Failed to connect to database:', error)
		process.exit(1)
	}
}

startServer()

export default app