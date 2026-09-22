import express from 'express'
import { getStats, getUsersByRole, deleteUser, getAllAppointments } from '../controllers/adminController.js'
import { protect } from '../middleware/authMiddleware.js'
import { allowRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/stats', protect, allowRoles('admin'), getStats)
router.get('/users', protect, allowRoles('admin'), getUsersByRole)
router.delete('/users/:id', protect, allowRoles('admin'), deleteUser)
router.get('/appointments', protect, allowRoles('admin'), getAllAppointments)

export default router
