import { Router } from 'express'
import { submitReview, getProviderReviews } from '../controllers/reviewControllers.js'

import {protect , authorizeRoles} from '../middleware/authMiddleware.js'

const router= Router()

router.post('/:bookingId', protect,authorizeRoles('customer'),submitReview)
router.get('/provider/:providerId',getProviderReviews)

export default router