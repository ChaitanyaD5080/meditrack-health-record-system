import Appointment from '../models/Appointment.js'
import User from '../models/User.js'


// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private (admin)
export const getStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' })
    const totalDoctors = await User.countDocuments({ role: 'doctor' })
    const totalAppointments = await Appointment.countDocuments()

    res.json({ totalPatients, totalDoctors, totalAppointments })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all users of a given role
// @route   GET /api/admin/users?role=doctor
// @access  Private (admin)
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query
    const filter = role ? { role } : {}
    const users = await User.find(filter).select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ message: 'User removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// @desc    Get all appointments platform-wide
// @route   GET /api/admin/appointments
// @access  Private (admin)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name email')
      .sort({ date: -1 })
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
