import User from '../models/User.js'
import Booking from '../models/Booking.js'
import Review from '../models/Review.js'


// GET all pending users

export const getPendingProviders = async (req, res) => {
  // Debug: find ALL users first
    // const allUsers = await User.find({})
    // allUsers.forEach(u => console.log(u.name, u.role, u.isApproved))

    const providers = await User.find({ role: 'provider', isApproved: false }).select('-password')
    // console.log('Pending providers:', providers.length)

    res.json(providers)
    }

//PATCH :  Approve the users via id

export const approveProvider = async (req,res)=>{
    const provider= await User.findByIdAndUpdate(
        {_id:req.params.id, role:'Provider'},
        {isApproved:true},
        {new:true}
    ).select('-password')

    if(!provider){
        return res.status(401).json({message: "Provider not found " })
    }
    res.json({ message: 'Provider approved successfully', provider })

}

//PATCH : Reject the provider

export const rejectProvider= async (req,res)=>{
    const provider= await User.findOneAndDelete({_id:req.params.id, role: 'Provider'})

    if(!provider){
        return res.status(401).json({message:"Provider doesn't exists"})
    }

    res.json({message: "Provider rejected and removed"})
}

//REVIEWS SECTION

//GET : get all pending reviews

export const getPendingReviews= async (req,res)=>{
    const reviews= await Review.find({isApproved: false})
        .populate('customer', 'name')
        .populate('provider', 'name')
        .sort({createdAt:-1})
    res.json(reviews)
}

//PATCH : Approve the Review

export const approveReview= async (req,res)=>{
    const review= await Review.findOneAndUpdate(
        {_id:req.params.id},
        {isApproved: true},
        {new: true}
    )
    if (!review) return res.status(404).json({ message: 'Review not found' })
        res.json({ message: 'Review approved', review })
    
}

//PATCH : Delete the Review

export const rejectReview= async (req,res)=>{
    const review= await Review.findOneAndDelete({_id:req.params.id})
    if(!review){
        res.status(401).json({message:"Review doesn't exists!! "})
    }
    res.json("REview got rejected and deleted")
}

// GET /api/admin/bookings
export const getAllBookings = async (req, res) => {
    const { status } = req.query
    const filter = {}
    if (status) filter.status = status

    const bookings = await Booking.find(filter)
        .populate('customer', 'name email')
        .populate('provider', 'name email')
        .populate('service',  'name category')
        .sort({ createdAt: -1 })

    res.json(bookings)
}