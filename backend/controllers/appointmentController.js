import Appointment from '../models/Appointment.js'

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (patient)
export const bookAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason } = req.body

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      date,
      time,
      reason,
    })

    res.status(201).json(appointment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get appointments for logged-in user (patient sees own, doctor sees own)
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req, res) => {
  try {
    const filter =
      req.user.role === 'doctor' ? { doctor: req.user._id } : { patient: req.user._id }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email')
      .populate('doctor', 'name email')
      .sort({ date: 1 })

    res.json(appointments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update appointment status (cancel/confirm/complete)
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' })
    res.json(appointment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
