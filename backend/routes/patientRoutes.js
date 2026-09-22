import express from 'express'
import { getMyProfile, updateMyProfile, getPatientProfileById } from '../controllers/patientController.js'
import { protect } from '../middleware/authMiddleware.js'
import { allowRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/me', protect, allowRoles('patient'), getMyProfile)
router.put('/me', protect, allowRoles('patient'), updateMyProfile)
router.get('/:id', protect, allowRoles('doctor'), getPatientProfileById)

export default router