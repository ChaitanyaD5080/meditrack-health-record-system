// One-time script: assigns a realistic qualification to each doctor
// based on their current specialization, and normalizes common typos.
// Run from the backend folder with:  node scripts/updateDoctorQualifications.js

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Doctor from '../models/Doctor.js'
import User from '../models/User.js' // must import so mongoose registers the User schema before populate()

dotenv.config()

// Map of specialization (lowercase, trimmed) -> { specialization, qualification }
// Add more entries here any time you add a new specialization.
const SPEC_MAP = {
  'cardiology': { specialization: 'Cardiology', qualification: 'MBBS, MD (Cardiology)' },
  'dermatology': { specialization: 'Dermatology', qualification: 'MBBS, MD (Dermatology)' },
  'dermatologist': { specialization: 'Dermatology', qualification: 'MBBS, MD (Dermatology)' },
  'neurology': { specialization: 'Neurology', qualification: 'MBBS, DM (Neurology)' },
  'orthopedics': { specialization: 'Orthopedics', qualification: 'MBBS, MS (Orthopedics)' },
  'orthopedic': { specialization: 'Orthopedics', qualification: 'MBBS, MS (Orthopedics)' },
  'psychiatry': { specialization: 'Psychiatry', qualification: 'MBBS, MD (Psychiatry)' },
  'psychiatrists': { specialization: 'Psychiatry', qualification: 'MBBS, MD (Psychiatry)' },
  'pediatrics': { specialization: 'Pediatrics', qualification: 'MBBS, MD (Pediatrics)' },
  'general physician': { specialization: 'General Physician', qualification: 'MBBS' },
  'gynecology': { specialization: 'Gynecology', qualification: 'MBBS, MS (Gynecology)' },
  'ent': { specialization: 'ENT', qualification: 'MBBS, MS (ENT)' },
  'ophthalmology': { specialization: 'Ophthalmology', qualification: 'MBBS, MS (Ophthalmology)' },
  'urology': { specialization: 'Urology', qualification: 'MBBS, MCh (Urology)' },
  'endocrinology': { specialization: 'Endocrinology', qualification: 'MBBS, DM (Endocrinology)' },
  'gastroenterology': { specialization: 'Gastroenterology', qualification: 'MBBS, DM (Gastroenterology)' },
  'pulmonology': { specialization: 'Pulmonology', qualification: 'MBBS, DM (Pulmonology)' },
  'oncology': { specialization: 'Oncology', qualification: 'MBBS, DM (Oncology)' },
  'nephrology': { specialization: 'Nephrology', qualification: 'MBBS, DM (Nephrology)' },
}

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not found. Make sure backend/.env exists and has MONGO_URI set.')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB:', mongoose.connection.host)

  const doctors = await Doctor.find().populate('user', 'name email')

  if (doctors.length === 0) {
    console.log('No doctor records found.')
    await mongoose.disconnect()
    return
  }

  console.log(`Found ${doctors.length} doctor(s). Updating...\n`)

  for (const doc of doctors) {
    const key = (doc.specialization || '').trim().toLowerCase()
    const match = SPEC_MAP[key] || SPEC_MAP['general physician']

    const before = `${doc.specialization || '(none)'} / ${doc.qualification || '(none)'}`

    doc.specialization = match.specialization
    doc.qualification = match.qualification
    await doc.save()

    const name = doc.user?.name || '(no name)'
    const email = doc.user?.email || '(no email)'
    console.log(`✓ ${name} <${email}>`)
    console.log(`   before: ${before}`)
    console.log(`   after:  ${doc.specialization} / ${doc.qualification}\n`)
  }

  console.log('Done. All doctor qualifications updated.')
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error('Error running script:', err)
  process.exit(1)
})
