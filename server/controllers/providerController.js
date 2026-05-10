import User    from '../models/User.js'
import Review  from '../models/Review.js'
import Service from '../models/Service.js'

// GET /api/providers
export const getProviders = async (req, res) => {
  const { city, serviceId } = req.query
  const filter = { role: 'provider', isApproved: true }

  if (city)      filter.city   = new RegExp(city, 'i')
  if (serviceId) filter.skills = { $in: [serviceId] } // filter by service ID

  const providers = await User.find(filter)
    .select('-password')
    .populate('skills', 'name category basePrice') // populate service details

  res.json(providers)
}

// GET /api/providers/:id
export const getProvider = async (req, res) => {
  const provider = await User.findOne({
    _id: req.params.id,
    role: 'provider',
    isApproved: true,
  })
    .select('-password')
    .populate('skills', 'name category basePrice')

  if (!provider) return res.status(404).json({ message: 'Provider not found' })

  const reviews   = await Review.find({ provider: provider._id, isApproved: true })
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  res.json({ ...provider.toJSON(), avgRating, totalReviews: reviews.length })
}

// PATCH /api/providers/profile  [Provider]
export const updateProfile = async (req, res) => {
  const { bio, experience, city, phone, skills } = req.body
  // skills here is array of Service IDs sent from frontend

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { bio, experience, city, phone, skills },
    { new: true, runValidators: true }
  )
    .select('-password')
    .populate('skills', 'name category basePrice')

  res.json(updated)
}

// PATCH /api/providers/availability
export const toggleAvailability = async (req, res) => {
  const provider      = await User.findById(req.user._id)
  provider.isAvailable = !provider.isAvailable
  await provider.save()
  res.json({ isAvailable: provider.isAvailable })
}