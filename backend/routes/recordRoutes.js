import express from 'express'
import { getRecords, createRecord, getPatientRecords, deleteRecord } from '../controllers/recordController.js'
import { protect } from '../middleware/authMiddleware.js'
import { allowRoles } from '../middleware/roleMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/', protect, getRecords)
router.post('/', protect, upload.single('attachment'), createRecord)
router.get('/patient/:patientId', protect, allowRoles('doctor'), getPatientRecords)
router.delete('/:id', protect, deleteRecord)

export default router