import express   from 'express'
import dotenv    from 'dotenv'
import cors      from 'cors'
import morgan    from 'morgan'
import connectDB from './config/db.js'

import authRoutes from './routes/authRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import providerRoutes from './routes/providerRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

import { errorHandler,notFound } from './middleware/errorMiddleware.js'

//Load .env data

dotenv.config()

connectDB()

const app=express()


//Global middleware
app.use(cors())   //Allows all origin for now....
app.use(express.json())    // Parse body in json format
app.use(express.urlencoded({ extended: true}))
app.use(morgan('dev'))   //Continuos logging

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/providers',  providerRoutes)
app.use('/api/bookings',  bookingRoutes)
app.use('/api/reviews',  reviewRoutes)
app.use('/api/admin',  adminRoutes)

//Health check

app.get('/api/health',(req,res)=>{
    res.json({status:'Ok',time: new Date().toISOString()})
})

//Error handling

app.use(notFound)
app.use(errorHandler)

const PORT= process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server running on  http://localhost:${PORT}`)
})

