import express from 'express'
import {
	getDoctors,
	getDoctorById,
	getMyDoctorProfile,
	updateMyDoctorProfile,
} from '../controllers/doctorController.js'
import { protect } from '../middleware/authMiddleware.js'
import { allowRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/', protect, getDoctors)
router.get('/me', protect, allowRoles('doctor'), getMyDoctorProfile)
router.put('/me', protect, allowRoles('doctor'), updateMyDoctorProfile)
router.get('/:id', protect, getDoctorById)

export default router
