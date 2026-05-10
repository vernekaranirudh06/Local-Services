import mongoose from 'mongoose'
import dotenv   from 'dotenv'
import User     from '../models/User.js'

dotenv.config()

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB Connected')

    const existing = await User.findOne({ email: 'admin@localservices.com' })

    if (existing) {
      console.log('⚠️  Admin already exists, skipping...')
      process.exit(0)
    }

    await User.create({
      name:        'Super Admin',
      email:       'admin@localservices.com',
      password:    'Admin@1234',
      role:        'admin',
      isApproved:  true,
    })

    console.log('✅ Admin created successfully!')
    console.log('📧 Email:    admin@localservices.com')
    console.log('🔑 Password: Admin@1234')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    process.exit(0)
  }
}

createAdmin()