import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema(
    {
        name:        { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        category:    { type: String, required: true, trim: true },
        basePrice:   { type: Number, required: true, min: 0 },
        image:       { type: String, default: '' },
        isActive:    { type: Boolean, default: true },
    },
    { timestamps: true }
)

const Service = mongoose.model('Service', serviceSchema)
export default Service