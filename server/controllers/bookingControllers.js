import Booking from '../models/Booking.js'
import Service from '../models/Service.js'
import User from '../models/User.js'

import {isValidTransition} from '../utils/stateTransitions.js'


//POST -> create an Booking
// Populate concept in MongoDb
/**
 * Concept:
In Mongoose, populate() replaces a stored ObjectId reference with the actual document from MongoDB.

What this statement does:

It populates two referenced fields of a booking: service and provider.

For service, it fetches the related document but returns only name, category, and basePrice.

For provider, it fetches the related document but returns only name, city, and phone.

An array is used because multiple fields are being populated.

await is required because fetching those referenced documents involves asynchronous database queries.

Logic in one line:
Take the booking’s service and provider IDs, query their collections, and replace those IDs with the selected fields from the actual documen
 */
export const createBooking= async (req,res)=>{
    const { providerId, serviceId, address, scheduledAt, customerNotes } = req.body

    // Validate
    if (!providerId || !serviceId || !address || !scheduledAt) {
        return res.status(400).json({ message: 'providerId, serviceId, address, scheduledAt are required' })
    }
    
    //Check whether Service exists?
    const service= await Service.findOne({_id:serviceId, isActive:true})
    if (!service) return res.status(404).json({ message: 'Service not found or inactive' })

    // Check For provider
    const provider=await User.findOne({
        _id: providerId,
        role : "provider",
        isApproved: true,
        isAvailable :true,
    })
    if (!provider) return res.status(404).json({ message: 'Provider not found or unavailable' })

    // Scheduled date must be in future
    if (new Date(scheduledAt) <= new Date()) {
        return res.status(400).json({ message: 'Scheduled time must be in the future' })
    }

    const customerImage= req.file?.path || ''

    const booking = await Booking.create({
    customer:      req.user._id,
    provider:      providerId,
    service:       serviceId,
    address,
    scheduledAt,
    price:         service.basePrice, // lock price at booking time
    customerNotes: customerNotes || '',
    customerImage,
    status:        'Requested',
    statusHistory: [{
        status:    'Requested',
        changedBy: req.user._id,
        note:      'Booking created by customer',
    }],
})

// Populate the result
await booking.populate([
    {path:'service', select: 'name category basePrice'},
    {path:'provider', select: 'name city phone'},

])

res.status(201).json(booking)

}

//[Customer] Find its own booking

export const getMyBookings= async (req,res)=>{
    const {status}=req.query
    const filter={ customer:req.user._id }
    if(status) filter.status=status

    const booking= await Booking.find(filter)
        .populate('provider','name city phone profileImage')
        .populate('service','name category')
        .sort({createdAt:-1})

    res.json(booking)
}

//[Provider] Find all bookings

export const getProviderBookings = async (req, res) => {
    const { status } = req.query
    const filter = { provider: req.user._id }
    if (status) filter.status = status

    const bookings = await Booking.find(filter)
        .populate('customer', 'name city phone')
        .populate('service',  'name category')
        .sort({ createdAt: -1 })

    res.json(bookings)
}

//Single booking detail/GET req via id

export const getBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('customer', 'name phone city profileImage')
    .populate('provider', 'name phone city bio profileImage')
    .populate('service')

  if (!booking) return res.status(404).json({ message: 'Booking not found' })

  // ✅ Safe check — populate might return null if user was deleted
  const customerId = booking.customer?._id?.toString()
  const providerId = booking.provider?._id?.toString()
  const userId     = req.user._id.toString()

  const isAllowed =
    customerId === userId ||
    providerId === userId ||
    req.user.role === 'admin'

  if (!isAllowed) return res.status(403).json({ message: 'Access denied' })

  res.json(booking)
}

//Update status PATCH REQ [Provider]
export const updateStatus= async (req,res) => {
    const {newStatus,note} =req.body
    if (!newStatus) return res.status(400).json({ message: 'newStatus is required' })

    const booking =await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })   
    
    //Verify whether this booking is assigned to this particular provider
    if(booking.provider.toString()!==req.user._id.toString()){
        return res.status(403).json({ message: 'This is not your booking' })
    }  

    const {allowed,message}= isValidTransition(booking.status,newStatus,'provider')
    if(!allowed){
        return res.status(400).json({ message })
    }

    booking.status = newStatus
    booking.statusHistory.push({
    status:    newStatus,
    changedBy: req.user._id,
    note:      note || '',
})

    await booking.save()
    res.json(booking)
}

//Cancel Booking -> [customer or provider]

export const cancelBooking = async (req, res) => {
  const { note } = req.body
  const booking  = await Booking.findById(req.params.id)

  if (!booking) return res.status(404).json({ message: 'Booking not found' })

  const userId = req.user._id.toString()

  // ✅ Compare against raw ObjectId strings, not populated objects
  const isCustomer = booking.customer.toString() === userId
  const isProvider = booking.provider.toString() === userId

  if (!isCustomer && !isProvider) {
    return res.status(403).json({ message: 'Access denied' })
  }

  const { allowed, message } = isValidTransition(
    booking.status, 'Cancelled', req.user.role
  )
  if (!allowed) return res.status(400).json({ message })

  booking.status           = 'Cancelled'
  booking.cancelledBy      = req.user._id
  booking.cancellationNote = note || ''
  booking.statusHistory.push({
    status:    'Cancelled',
    changedBy: req.user._id,
    note:      note || 'No reason provided',
  })

  await booking.save()
  res.json(booking)
}
//Reschedule the booking [Customer]

export const rescheduleBooking= async (req,res)=>{
    const { newSchedule }= req.body
    if(!newSchedule) return res.status(401).json({message:"New schedule is required"})
    
    const booking = await Booking.findById(req.params.id)
    if(!booking) return res.status(401).json({message:"Booking not found"}) 
    
    if(booking.customer.toString()!==req.user._id.toString()){
        return res.status(403).json({ message: 'Not your booking' })
    }

    if(!['Requested','Confirmed'].includes(booking.status)){
        return res.status(400).json({ message: 'Cannot reschedule at this stage' })
    }

    //Check whether new date is valid
    if(new Date(newSchedule)<=new Date()){
        return res.status(400).json({ message: 'New schedule must be in the future' })
    }

    const oldDate=booking.scheduledAt
    booking.scheduledAt=newSchedule
    booking.statusHistory.push({
        status: booking.status,
        changedBy : req.user._id,
        note: `Rescheduled from ${oldDate} to ${newSchedule}`
    })

    await booking.save()
    res.json(booking)
    
}

//Upload Job images [Provider]

export const uploadImages=async (req,res)=>{
    const {type}= req.body
    
    const booking = await Booking.findById(req.params.id);

    if(!booking){
        return res.status(401).json({message : "Booking not found" })
    }

    if(booking.provider.toString()!==req.user._id.toString()){
        return res.status(403).json({ message: 'Not your booking' })
    }

    if(!req.file) return res.status(400).json({ message: 'No image uploaded' })

    if(!['before','after'].includes(type)){
        return res.status(400).json({ message: 'type must be "before" or "after"' })
    }

    if(type==='before') booking.beforeImage=req.file.path
    if(type==='after') booking.afterImage=req.file.path

    await booking.save()
    res.json({ message: `${type} image uploaded`, url: req.file.path })


}
