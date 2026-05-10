import Review from '../models/Review.js'
import Booking from '../models/Booking.js'


//[POST] review for particular booking  [Customer]

///api/reviews/:bookingId 
export const submitReview = async (req, res) => {
    const { rating, comment } = req.body

    if(!rating ){
        return res.status(401).json({message: " Rating is required" })
    }
    if(typeof rating !=='number' || (rating<1 || rating >5)){
        return res.status(400).json({ message: 'Rating must be 1 to 5' })
    }

    const booking =await Booking.findById(req.params.bookingId)
    if(!booking) return res.status(401).json({message :" Booking not found" })
    
    // Review can be given only if status is completed
    if(booking.status!=='Completed'){
        return res.status(401).json({message:"Work is not completed yet!!"})
    }

    // Must be the booking's own customer
    if(booking.customer.toString()!==req.user._id.toString()){
        return res.status(403).json({ message: 'Not your booking' }) 
    }
    console.log(booking)
    //Check whether its already reviewed
    const isReviewed= await Review.findOne({booking:booking._id})
    if(isReviewed){
        return res.status(401).json({message: "Booking is already been reviewed" })
    }
    const review= await Review.create({
        booking: booking._id,
        customer: req.user._id,
        provider:booking.provider,
        rating: Number(rating),
        comment,

    })
    res.status(200).json(review)


}

// Get Reviews of an particular provider .. [Public]

export const getProviderReviews= async (req,res)=>{
    const reviews= await Review.find({
        provider:req.params.providerId,
        isApproved:true,
    })
        .populate('Customer', 'name profileImage')
        .sort({ createdAt : -1})
    
    const avgRating= reviews.length ? (reviews.reduce((sum , r)=>sum+r.rating,0)/reviews.length).toFixed(1): null

    res.json({reviews,avgRating,total:reviews.length})
}