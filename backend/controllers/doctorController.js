import Doctor from '../models/Doctor.js'
import User from '../models/User.js'

// @desc    Get doctors, with optional search and pagination
// @route   GET /api/doctors?search=&page=&limit=
// @access  Private
export const getDoctors = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 2 } = req.query
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.max(1, parseInt(limit))

    let doctors = await Doctor.find().populate('user', 'name email phone')

    if (search.trim()) {
      const term = search.trim().toLowerCase()
      doctors = doctors.filter((d) => d.user?.name?.toLowerCase().includes(term))
    }

    const totalCount = doctors.length
    const totalPages = Math.max(1, Math.ceil(totalCount / limitNum))
    const start = (pageNum - 1) * limitNum
    const paginatedDoctors = doctors.slice(start, start + limitNum)

    res.json({
      doctors: paginatedDoctors,
      page: pageNum,
      totalPages,
      totalCount,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone')
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' })
    res.json(doctor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get logged-in doctor's own profile
// @route   GET /api/doctors/me
// @access  Private (doctor)
export const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email phone')
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' })
    res.json(doctor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update logged-in doctor's own profile
// @route   PUT /api/doctors/me
// @access  Private (doctor)
export const updateMyDoctorProfile = async (req, res) => {
  try {
    const { specialization, experience, qualification, name, phone } = req.body

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { specialization, experience, qualification },
      { new: true }
    ).populate('user', 'name email phone')

    if (name || phone) {
      await User.findByIdAndUpdate(req.user._id, { name, phone })
    }

    res.json(doctor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}