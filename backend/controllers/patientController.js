import Patient from '../models/Patient.js'
import User from '../models/User.js'

export const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id }).populate(
      'user',
      'name email phone role'
    )
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' })
    res.json(patient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateMyProfile = async (req, res) => {
  try {
    const { age, dob, gender, bloodGroup, allergies, address, name, phone } = req.body

    const patient = await Patient.findOneAndUpdate(
      { user: req.user._id },
      { age, dob, gender, bloodGroup, allergies, address },
      { new: true }
    )

    if (name || phone) {
      await User.findByIdAndUpdate(req.user._id, { name, phone })
    }

    res.json(patient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getPatientProfileById = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.params.id }).populate(
      'user',
      'name email phone role'
    )
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' })
    res.json(patient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}