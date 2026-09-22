import Prescription from '../models/Prescription.js'

// @desc    Create a prescription (includes condition/vitals + medicines)
// @route   POST /api/prescriptions
// @access  Private (doctor)
export const createPrescription = async (req, res) => {
  try {
    const { patient, appointment, condition, medicines, notes } = req.body

    const prescription = await Prescription.create({
      patient,
      doctor: req.user._id,
      appointment: appointment || undefined,
      condition,
      medicines,
      notes,
    })

    res.status(201).json(prescription)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get prescriptions (patient sees own, doctor sees ones they wrote)
// @route   GET /api/prescriptions
// @access  Private
export const getPrescriptions = async (req, res) => {
  try {
    const filter =
      req.user.role === 'patient' ? { patient: req.user._id } : { doctor: req.user._id }

    const prescriptions = await Prescription.find(filter)
      .populate('patient', 'name email')
      .populate('doctor', 'name email')
      .sort({ date: -1 })

    res.json(prescriptions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get prescriptions for a specific patient (doctor viewing patient history)
// @route   GET /api/prescriptions/patient/:patientId
// @access  Private (doctor)
export const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.patientId })
      .populate('patient', 'name email')
      .populate('doctor', 'name email')
      .sort({ date: -1 })

    res.json(prescriptions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}