import Doctor from '../models/Doctor.js'
import User from '../models/User.js'

// @desc    Get the logged-in doctor's profile
// @route   GET /api/doctors/me
// @access  Private (doctor)
export const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate(
      'user',
      'name email phone role'
    )
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' })
    res.json(doctor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update the logged-in doctor's profile
// @route   PUT /api/doctors/me
// @access  Private (doctor)
export const updateMyDoctorProfile = async (req, res) => {
  try {
    const { name, phone, specialization, experience, qualification } = req.body
    const doctor = await Doctor.findOne({ user: req.user._id })
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' })

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    ).select('name email phone role')

    doctor.specialization = specialization
    doctor.experience = experience
    doctor.qualification = qualification
    await doctor.save()

    res.json({ ...doctor.toObject(), user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all doctors (for patients to browse)
// @route   GET /api/doctors
// @access  Private
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('user', 'name email phone')
    res.json(doctors)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get single doctor by id
// @route   GET /api/doctors/:id
// @access  Private
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone')
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' })
    res.json(doctor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
