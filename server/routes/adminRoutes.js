import {Router} from 'express' 
import {
    getPendingProviders, approveProvider, rejectProvider,
    getPendingReviews, approveReview, rejectReview, getAllBookings,

} from '../controllers/adminControllers.js'

import { protect,authorizeRoles } from '../middleware/authMiddleware.js'

const router=Router()

// All admin routes — apply protect + admin role check once
router.use(protect,authorizeRoles('admin'))

router.get('/providers/pending', getPendingProviders)
router.patch('/providers/:id/approve', approveProvider)
router.patch('/providers/:id/reject', rejectProvider)

router.get('/reviews/pending',getPendingReviews)
router.patch('/reviews/:id/approve', approveReview)
router.patch('/reviews/:id/reject', rejectReview)

router.get('/bookings',  getAllBookings)

export default router

