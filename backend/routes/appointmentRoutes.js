import express from 'express'
import {
  bookAppointment,
  getAppointments,
  updateAppointment,
} from '../controllers/appointmentController.js'
import { protect } from '../middleware/authMiddleware.js'
import { allowRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.post('/', protect, allowRoles('patient'), bookAppointment)
router.get('/', protect, getAppointments)
router.put('/:id', protect, updateAppointment)

export default router
