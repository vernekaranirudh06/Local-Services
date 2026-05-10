import { Router } from 'express'
import {getProvider,getProviders,updateProfile,toggleAvailability} from '../controllers/providerController.js'
import {protect,authorizeRoles} from '../middleware/authMiddleware.js'

const router= Router()

router.get('/', getProviders)
router.get('/:id',getProvider)

// Secure routes

router.patch('/profile',protect,authorizeRoles('provider'),updateProfile)
router.patch('/availability',protect, authorizeRoles('provider'),toggleAvailability)

export default router