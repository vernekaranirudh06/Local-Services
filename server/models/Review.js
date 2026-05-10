import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
    {
        booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        unique: true, // One review per booking — enforced at DB level
        },
        customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        },
        provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        },
        rating:     { type: Number, required: true, min: 1, max: 5 },
        comment:    { type: String, trim: true },
        isApproved: { type: Boolean, default: false },
    },
    { timestamps: true }
)

const Review = mongoose.model('Review', reviewSchema)
export default Review