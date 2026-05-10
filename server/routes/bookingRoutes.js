import {Router} from 'express'
import {
    createBooking, getMyBookings, getProviderBookings,
    getBooking, updateStatus, cancelBooking,
    rescheduleBooking, uploadImages,
} from '../controllers/bookingControllers.js'

import {protect,authorizeRoles} from '../middleware/authMiddleware.js'
import  { upload } from '../config/cloudinary.js'

const  router= Router()

//Create Booking 
router.post('/',
    protect,authorizeRoles('customer'),upload.single('customerImage'),createBooking
)

//Get customers own booking
router.get('/my',
    protect,authorizeRoles('customer'),getMyBookings
)

//Get providers booking
router.get('/provider',
    protect,authorizeRoles('provider'),getProviderBookings
)

//Get particular booking
router.get('/:id',
    protect,getBooking
)

//Provider can update status
router.patch('/:id/status',
    protect,authorizeRoles('provider'),updateStatus
)

// Cancel Booking
router.patch('/:id/cancel',
    protect,authorizeRoles('customer','provider'),cancelBooking
)

//Reschedule the booking
router.patch('/:id/reschedule',
    protect, authorizeRoles('customer'), rescheduleBooking
)

//Post the images
router.post('/:id/images',
    protect, authorizeRoles('provider'), upload.single('image'), uploadImages)

export default router



