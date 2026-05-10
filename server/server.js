import express   from 'express'
import dotenv    from 'dotenv'
import cors      from 'cors'
import morgan    from 'morgan'
import connectDB from './config/db.js'

import authRoutes     from './routes/authRoutes.js'
import serviceRoutes  from './routes/serviceRoutes.js'
import providerRoutes from './routes/providerRoutes.js'
import bookingRoutes  from './routes/bookingRoutes.js'
import reviewRoutes   from './routes/reviewRoutes.js'
import adminRoutes    from './routes/adminRoutes.js'

import { errorHandler, notFound } from './middleware/errorMiddleware.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
  ],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Only use morgan in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.use('/api/auth',      authRoutes)
app.use('/api/services',  serviceRoutes)
app.use('/api/providers', providerRoutes)
app.use('/api/bookings',  bookingRoutes)
app.use('/api/reviews',   reviewRoutes)
app.use('/api/admin',     adminRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.use(notFound)
app.use(errorHandler)

// ✅ For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
}

// ✅ For Vercel serverless — export the app
export default app