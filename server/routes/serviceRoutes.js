import { Router } from 'express'
import {getServices, getService,createService,updateService,deactivateService}  from '../controllers/serviceControllers.js'
import {protect,authorizeRoles} from '../middleware/authMiddleware.js'
import {upload} from '../config/cloudinary.js'


const router= Router()

router.get('/', getServices)
router.get('/:id', getService)

// Secure routes
router.post('/',protect,authorizeRoles('admin'),upload.single('image'),createService)

router.patch('/:id',protect, authorizeRoles('admin'), updateService)
router.delete('/:id',protect,authorizeRoles('admin'),deactivateService)

export default router