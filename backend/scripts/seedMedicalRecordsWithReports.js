import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import MedicalRecord from '../models/MedicalRecord.js'
import Patient from '../models/Patient.js'
import User from '../models/User.js'

dotenv.config()

const UPLOADS_DIR = path.resolve('uploads')

// Fixes orphaned User accounts that have no linked Patient profile.
// Fills in what we know from the users export; age/gender/bloodGroup/address
// left blank since that data was lost when the original registration failed.
const MISSING_PROFILES = [
  { userId: '6a92ca2c445cce9d02c98760', name: 'Janvi Mistry' },
  { userId: '6a92c997445cce9d02c98752', name: 'Krishna Parmar' },
]

const RECORDS = [
  { patientId: '6a86df8cb86f7ca41843da74', doctorId: '6a85927398740b01e1cbf02c', diagnosis: 'Migraine without aura', notes: 'Recurring migraines with light sensitivity. Prescribed Sumatriptan PRN and Propranolol prophylaxis. Advised sleep hygiene and headache diary.', file: 'report_ananya_shah_migraine.pdf' },
  { patientId: '6a86dfb6b86f7ca41843da79', doctorId: '6a85927398740b01e1cbf02c', diagnosis: 'Peripheral neuropathy - under evaluation', notes: 'Reports dizziness and intermittent numbness in left arm. MRI and nerve conduction study advised. Follow-up in 3 weeks.', file: 'report_shivam_parmar_neuropathy.pdf' },
  { patientId: '6a92c997445cce9d02c98752', doctorId: '6a85927398740b01e1cbf02c', diagnosis: 'Tension-type headache', notes: 'Sleep disturbance and stress-related tension headaches. Advised stress management and regular sleep schedule.', file: 'report_krishna_parmar_tension_headache.pdf' },

  { patientId: '6a86dfdab86f7ca41843da7e', doctorId: '6a86e04eb86f7ca41843da88', diagnosis: 'Contact dermatitis', notes: 'Persistent rash on forearms, likely allergic contact dermatitis. Prescribed topical corticosteroid, advised to identify and avoid irritant.', file: 'report_parth_chauhan_dermatitis.pdf' },
  { patientId: '6a86e01db86f7ca41843da83', doctorId: '6a86e04eb86f7ca41843da88', diagnosis: 'Acne vulgaris - moderate', notes: 'Moderate inflammatory acne. Started on topical retinoid and benzoyl peroxide. Review in 6 weeks.', file: 'report_kritika_patel_acne.pdf' },
  { patientId: '6a92ca2c445cce9d02c98760', doctorId: '6a86e04eb86f7ca41843da88', diagnosis: 'Seborrheic dermatitis (scalp)', notes: 'Dry, itchy scalp patches consistent with seborrheic dermatitis. Prescribed medicated shampoo, follow-up in 4 weeks.', file: 'report_janvi_mistry_seborrheic.pdf' },

  { patientId: '6a92cae33e369f08415cb3cc', doctorId: '6a86e093b86f7ca41843da8d', diagnosis: 'Lumbar muscle strain', notes: 'Lower back pain following heavy lifting. X-ray shows no fracture. Advised rest, physiotherapy, and NSAIDs for 1 week.', file: 'report_ajay_mishra_lumbar_strain.pdf' },
  { patientId: '6a92cb143e369f08415cb3d9', doctorId: '6a86e093b86f7ca41843da8d', diagnosis: 'Osteoarthritis - knee (early stage)', notes: 'Knee joint pain with difficulty climbing stairs. X-ray shows mild joint space narrowing. Advised weight management and physiotherapy.', file: 'report_kantilal_shah_osteoarthritis.pdf' },
  { patientId: '6a92cb613e369f08415cb3e6', doctorId: '6a86e093b86f7ca41843da8d', diagnosis: 'Shoulder soft tissue injury', notes: 'Shoulder stiffness following a minor fall. No fracture on imaging. Prescribed anti-inflammatory and range-of-motion exercises.', file: 'report_krina_pandya_shoulder_injury.pdf' },

  { patientId: '6a92cc183e369f08415cb3f3', doctorId: '6a86e0d8b86f7ca41843da92', diagnosis: 'Viral fever', notes: 'Fever and body ache for 3 days, likely viral. Advised rest, hydration, and paracetamol. Review if symptoms persist beyond 5 days.', file: 'report_aditya_gupta_viral_fever.pdf' },
  { patientId: '6a92cc633e369f08415cb400', doctorId: '6a86e0d8b86f7ca41843da92', diagnosis: 'Routine health checkup - normal', notes: 'Annual checkup, all vitals within normal range. No abnormalities noted. Advised routine follow-up in 1 year.', file: 'report_shruti_roy_checkup.pdf' },
  { patientId: '6a92cc9a3e369f08415cb40d', doctorId: '6a86e0d8b86f7ca41843da92', diagnosis: 'Upper respiratory tract infection', notes: 'Persistent cough and mild sore throat. Likely viral URTI. Prescribed symptomatic treatment, review in 1 week if not improving.', file: 'report_fatima_shaikh_urti.pdf' },

  { patientId: '6a92ccd43e369f08415cb41a', doctorId: '6a86e133b86f7ca41843da97', diagnosis: 'Fatigue - under evaluation', notes: 'General fatigue and low energy levels. Blood tests ordered to rule out anemia and thyroid dysfunction.', file: 'report_yash_parmar_fatigue.pdf' },
  { patientId: '6a92cd0e3e369f08415cb427', doctorId: '6a86e133b86f7ca41843da97', diagnosis: 'Routine checkup - blood work pending', notes: 'Requested routine blood test as part of annual health screening. Results pending, follow-up scheduled.', file: 'report_aayush_patel_checkup.pdf' },
  { patientId: '6a92cd4c3e369f08415cb434', doctorId: '6a86e133b86f7ca41843da97', diagnosis: 'Viral fever with headache', notes: 'Mild fever and headache since yesterday, likely viral. Advised rest, hydration, paracetamol as needed.', file: 'report_rajdeepsinh_mandora_fever.pdf' },
]

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not found. Make sure backend/.env exists and has MONGO_URI set.')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB:', mongoose.connection.host, '\n')

  console.log('Step 1: Fixing missing Patient profiles...\n')
  for (const m of MISSING_PROFILES) {
    const existing = await Patient.findOne({ user: m.userId })
    if (existing) {
      console.log(`- ${m.name} already has a Patient profile, skipped`)
      continue
    }
    const userDoc = await User.findById(m.userId)
    if (!userDoc) {
      console.log(`✗ User ${m.name} (${m.userId}) not found, skipped`)
      continue
    }
    await Patient.create({ user: userDoc._id })
    console.log(`✓ Created missing Patient profile for ${m.name} (fill in age/gender/blood group via their Profile page)`)
  }

  console.log('\nStep 2: Creating medical records with attached reports...\n')
  let created = 0
  let failed = 0

  for (const rec of RECORDS) {
    const patientUser = await User.findById(rec.patientId)
    const doctorUser = await User.findById(rec.doctorId)

    if (!patientUser || !doctorUser) {
      console.log(`✗ Skipped: patient or doctor not found for ${rec.file}`)
      failed++
      continue
    }

    const filePath = path.join(UPLOADS_DIR, rec.file)
    const fileExists = fs.existsSync(filePath)
    if (!fileExists) {
      console.log(`⚠ ${rec.file} not found in backend/uploads/ — did you extract the reports zip there? Creating record WITHOUT attachment.`)
    }

    try {
      await MedicalRecord.create({
        patient: patientUser._id,
        doctor: doctorUser._id,
        diagnosis: rec.diagnosis,
        notes: rec.notes,
        attachments: fileExists ? [`uploads/${rec.file}`] : [],
        date: new Date(),
      })
      console.log(`✓ ${patientUser.name} (Dr. ${doctorUser.name}) — ${rec.diagnosis}${fileExists ? ' [+PDF attached]' : ''}`)
      created++
    } catch (err) {
      console.log(`✗ Failed for ${patientUser.name}: ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone. Records created: ${created}, Failed: ${failed}`)
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error('Script error:', err)
  process.exit(1)
})
