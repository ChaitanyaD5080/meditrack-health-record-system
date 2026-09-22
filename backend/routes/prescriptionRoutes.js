import express from 'express'
import {
  createPrescription,
  getPrescriptions,
  getPatientPrescriptions,
} from '../controllers/prescriptionController.js'
import { protect } from '../middleware/authMiddleware.js'
import { allowRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.post('/', protect, allowRoles('doctor'), createPrescription)
router.get('/', protect, getPrescriptions)
router.get('/patient/:patientId', protect, allowRoles('doctor'), getPatientPrescriptions)

export default router