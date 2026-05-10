import mongoose  from 'mongoose'


// Tracks the status data

const statusHistorySchema= new mongoose.Schema(
    {
        status: {type:String,required:true},
        changedBy: {type:mongoose.Schema.Types.ObjectId,ref:'User'},
        note:  {type:String,default:''},
        changedAt: { type: Date, default: Date.now },
    },
    {
        _id:false // dont create id for every status history
    }
)


const bookingSchema= new mongoose.Schema(
    {
        customer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true,
        },
        provider:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true,
        },
        service:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Service',
            required: true,
        },

        address:     { type: String, required: true },
        scheduledAt: { type: Date,   required: true },

        //Initial price is locked
        price: { type: Number, required: true },

        status: {
        type: String,
        enum: ['Requested', 'Confirmed', 'In-Progress', 'Completed', 'Cancelled'],
        default: 'Requested',
        },

        // Customer inputs
        customerNotes: { type: String, default: '' },
        customerImage: { type: String, default: '' }, // Cloudinary URL

        // Provider inputs
        workNotes:   { type: String, default: '' },
        beforeImage: { type: String, default: '' },
        afterImage:  { type: String, default: '' },

        // Cancellation info
        cancelledBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        cancellationNote: { type: String, default: '' },

        // Full status change log
        statusHistory: [statusHistorySchema],


    },
    {timestamps:true}

)

const Booking= mongoose.model('Booking',bookingSchema)

export default Booking;