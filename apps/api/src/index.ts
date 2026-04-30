import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
		credentials: true
	})
)
app.use(morgan('dev'))
app.use(express.json())
app.use(
	express.urlencoded({
		extended: true
	})
)

// Health check route
app.get('/api/health', (req, res) => {
	res.json({
		success: true,
		message: 'SpendWise API is running',
		timestamp: new Date().toISOString()
	})
})

// Start server
app.listen(PORT, () => {
	console.log(`API running on http://localhost:${PORT}`)
})

export default app
