import MedicalRecord from '../models/MedicalRecord.js'

export const getRecords = async (req, res) => {
  try {
    const filter =
      req.user.role === 'patient' ? { patient: req.user._id } : { doctor: req.user._id }

    const records = await MedicalRecord.find(filter)
      .populate('patient', 'name email')
      .populate('doctor', 'name email')
      .sort({ date: -1 })

    res.json(records)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createRecord = async (req, res) => {
  try {
    const { patient, diagnosis, notes } = req.body

    const record = await MedicalRecord.create({
      patient: patient || req.user._id,
      doctor: req.user.role === 'doctor' ? req.user._id : undefined,
      diagnosis,
      notes,
      attachments: req.file ? [req.file.path] : [],
    })

    res.status(201).json(record)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getPatientRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .populate('patient', 'name email')
      .populate('doctor', 'name email')
      .sort({ date: -1 })
    res.json(records)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// @desc    Delete a medical record (only the patient who owns it)
// @route   DELETE /api/records/:id
// @access  Private (patient)
export const deleteRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
    if (!record) return res.status(404).json({ message: 'Record not found' })

    if (record.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this record' })
    }

    await record.deleteOne()
    res.json({ message: 'Record deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}