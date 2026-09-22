// Books 3 real appointments per doctor (15 total) using your ACTUAL
// existing user IDs from your database export. Inserts Appointment
// documents directly via Mongoose using your .env connection.
//
// Run from the backend folder with:  node scripts/bookAppointments.js

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Appointment from '../models/Appointment.js'
import User from '../models/User.js'

dotenv.config()

// doctor user _id -> { name, reasons for that specialization }
const DOCTORS = [
  {
    id: '6a85927398740b01e1cbf02c',
    name: 'Tirth Patel',
    specialization: 'Neurology',
    patients: [
      { id: '6a86df8cb86f7ca41843da74', name: 'Ananya Shah', reason: 'Recurring migraines and light sensitivity.' },
      { id: '6a86dfb6b86f7ca41843da79', name: 'Shivam Parmar', reason: 'Dizziness and occasional numbness in left arm.' },
      { id: '6a92c997445cce9d02c98752', name: 'Krishna Parmar', reason: 'Sleep disturbance and tension headaches.' },
    ],
  },
  {
    id: '6a86e04eb86f7ca41843da88',
    name: 'Priyanka Shah',
    specialization: 'Dermatology',
    patients: [
      { id: '6a86dfdab86f7ca41843da7e', name: 'Parth Chauhan', reason: 'Persistent skin rash on forearms.' },
      { id: '6a86e01db86f7ca41843da83', name: 'Kritika Patel', reason: 'Acne breakout, requesting treatment plan.' },
      { id: '6a92ca2c445cce9d02c98760', name: 'Janvi Mistry', reason: 'Dry, itchy patches on scalp.' },
    ],
  },
  {
    id: '6a86e093b86f7ca41843da8d',
    name: 'Sarthak Solanki',
    specialization: 'Orthopedics',
    patients: [
      { id: '6a92cae33e369f08415cb3cc', name: 'Ajay Mishra', reason: 'Lower back pain after lifting heavy object.' },
      { id: '6a92cb143e369f08415cb3d9', name: 'Kantilal Shah', reason: 'Knee joint pain, difficulty climbing stairs.' },
      { id: '6a92cb613e369f08415cb3e6', name: 'Krina Pandya', reason: 'Shoulder stiffness after minor fall.' },
    ],
  },
  {
    id: '6a86e0d8b86f7ca41843da92',
    name: 'Rohit Singh',
    specialization: 'General Physician',
    patients: [
      { id: '6a92cc183e369f08415cb3f3', name: 'Aditya Gupta', reason: 'Fever and body ache for 3 days.' },
      { id: '6a92cc633e369f08415cb400', name: 'Shruti Roy', reason: 'Routine annual health checkup.' },
      { id: '6a92cc9a3e369f08415cb40d', name: 'Fatima Shaikh', reason: 'Persistent cough and mild sore throat.' },
    ],
  },
  {
    id: '6a86e133b86f7ca41843da97',
    name: 'Yashvi Jain',
    specialization: 'General Physician',
    patients: [
      { id: '6a92ccd43e369f08415cb41a', name: 'Yash Parmar', reason: 'General fatigue and low energy levels.' },
      { id: '6a92cd0e3e369f08415cb427', name: 'Aayush Patel', reason: 'Routine checkup, requesting blood test.' },
      { id: '6a92cd4c3e369f08415cb434', name: 'Rajdeepsinh Mandora', reason: 'Mild fever and headache since yesterday.' },
    ],
  },
]

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not found. Make sure backend/.env exists and has MONGO_URI set.')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB:', mongoose.connection.host, '\n')

  let created = 0
  let failed = 0

  for (const doctor of DOCTORS) {
    // Confirm the doctor's user record actually exists before booking under them
    const doctorUser = await User.findById(doctor.id)
    if (!doctorUser) {
      console.log(`✗ Doctor user ${doctor.name} (${doctor.id}) not found — skipping their 3 patients\n`)
      failed += doctor.patients.length
      continue
    }

    console.log(`Dr. ${doctorUser.name} (${doctor.specialization}):`)

    for (let i = 0; i < doctor.patients.length; i++) {
      const p = doctor.patients[i]

      const patientUser = await User.findById(p.id)
      if (!patientUser) {
        console.log(`   ✗ Patient ${p.name} (${p.id}) not found — skipped`)
        failed++
        continue
      }

      const date = new Date()
      date.setDate(date.getDate() + 3 + i * 4)
      const time = ['09:30', '11:00', '15:00'][i % 3]

      try {
        await Appointment.create({
          patient: patientUser._id,
          doctor: doctorUser._id,
          date,
          time,
          reason: p.reason,
          status: 'pending',
        })
        console.log(`   ✓ ${patientUser.name} booked for ${date.toDateString()} at ${time}`)
        created++
      } catch (err) {
        console.log(`   ✗ Failed to book ${patientUser.name}: ${err.message}`)
        failed++
      }
    }
    console.log('')
  }

  console.log(`Done. Created: ${created} appointment(s), Failed: ${failed}`)
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error('Script error:', err)
  process.exit(1)
})