import User from '../models/User.js'
import Patient from '../models/Patient.js'
import Doctor from '../models/Doctor.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'
import { isValidEmail, isStrongPassword } from '../utils/validators.js'

export const registerUser = async (req, res) => {
  try {
    const {
      name, email, password, role,
      age, dob, gender, bloodGroup, phone, emergencyContact,
      specialization, experience, qualification,
    } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email' })
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    if (dob && new Date(dob) > new Date()) {
      return res.status(400).json({ message: 'Date of birth cannot be in the future' })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === 'doctor' ? 'doctor' : 'patient',
      phone: phone || '',
    })

    if (user.role === 'patient') {
      await Patient.create({
        user: user._id,
        age: age || undefined,
        dob: dob || undefined,
        gender: gender || undefined,
        bloodGroup: bloodGroup || '',
        emergencyContact: emergencyContact || '',
      })
    } else if (user.role === 'doctor') {
      await Doctor.create({
        user: user._id,
        specialization: specialization || 'General Physician',
        experience: experience || 0,
        qualification: qualification || '',
      })
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email. Please register first.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMe = async (req, res) => {
  res.json(req.user)
}