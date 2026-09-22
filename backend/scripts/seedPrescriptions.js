// Creates one prescription per patient, tied to the same doctor and
// diagnosis as their medical record, with medicines and dosages matched
// to the condition. Inserts Prescription documents directly via Mongoose
// using your .env connection — backend does not need to be running.
//
// Run from the backend folder with:  node scripts/seedPrescriptions.js

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Prescription from '../models/Prescription.js'
import User from '../models/User.js'

dotenv.config()

const PRESCRIPTIONS = [
  // --- Dr. Tirth Patel (Neurology) ---
  {
    patientId: '6a86df8cb86f7ca41843da74', doctorId: '6a85927398740b01e1cbf02c',
    condition: {
      bloodPressure: '122/78 mmHg', heartRate: '74 bpm', temperature: '98.4°F', weight: '',
      symptoms: 'Recurrent throbbing headaches with photophobia, no visual aura.',
      diagnosis: 'Migraine without aura',
    },
    medicines: [
      { name: 'Sumatriptan', dosage: '50mg', frequency: 'PRN at headache onset (max 2 doses/24 hrs)', duration: 'As needed' },
      { name: 'Propranolol', dosage: '20mg', frequency: 'Twice daily', duration: '6 weeks' },
    ],
    notes: 'Maintain headache diary. Reduce caffeine intake. Follow up in 6 weeks.',
  },
  {
    patientId: '6a86dfb6b86f7ca41843da79', doctorId: '6a85927398740b01e1cbf02c',
    condition: {
      bloodPressure: '118/76 mmHg', heartRate: '80 bpm', temperature: '98.2°F', weight: '',
      symptoms: 'Intermittent dizziness and numbness in left arm.',
      diagnosis: 'Peripheral neuropathy - under evaluation',
    },
    medicines: [
      { name: 'Methylcobalamin (Vitamin B12)', dosage: '1500mcg', frequency: 'Once daily', duration: '4 weeks' },
      { name: 'Gabapentin', dosage: '100mg', frequency: 'Twice daily', duration: '2 weeks, review after' },
    ],
    notes: 'MRI and nerve conduction study pending. Reassess medication after test results.',
  },
  {
    patientId: '6a92c997445cce9d02c98752', doctorId: '6a85927398740b01e1cbf02c',
    condition: {
      bloodPressure: '126/80 mmHg', heartRate: '76 bpm', temperature: '98.6°F', weight: '',
      symptoms: 'Frequent tension headaches, work-related stress, irregular sleep.',
      diagnosis: 'Tension-type headache',
    },
    medicines: [
      { name: 'Ibuprofen', dosage: '400mg', frequency: 'PRN for acute episodes (max 3/day)', duration: '2 weeks' },
      { name: 'Amitriptyline', dosage: '10mg', frequency: 'Once daily at night', duration: '4 weeks, for prevention' },
    ],
    notes: 'Advised stress management and regular sleep schedule. Follow up in 4 weeks.',
  },

  // --- Dr. Priyanka Shah (Dermatology) ---
  {
    patientId: '6a86dfdab86f7ca41843da7e', doctorId: '6a86e04eb86f7ca41843da88',
    condition: {
      bloodPressure: '120/78 mmHg', heartRate: '72 bpm', temperature: '98.4°F', weight: '',
      symptoms: 'Persistent itchy rash on both forearms.',
      diagnosis: 'Contact dermatitis',
    },
    medicines: [
      { name: 'Mometasone Furoate 0.1% cream', dosage: 'Apply thin layer', frequency: 'Twice daily', duration: '10 days' },
      { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily at night', duration: '7 days' },
    ],
    notes: 'Identify and avoid the causative irritant. Review in 2 weeks.',
  },
  {
    patientId: '6a86e01db86f7ca41843da83', doctorId: '6a86e04eb86f7ca41843da88',
    condition: {
      bloodPressure: '116/74 mmHg', heartRate: '70 bpm', temperature: '98.3°F', weight: '',
      symptoms: 'Moderate inflammatory acne on face, worsening over 1 month.',
      diagnosis: 'Acne vulgaris - moderate',
    },
    medicines: [
      { name: 'Adapalene 0.1% gel', dosage: 'Apply thin layer', frequency: 'Once daily at night', duration: '6 weeks' },
      { name: 'Benzoyl Peroxide 2.5% wash', dosage: 'Cleanse affected area', frequency: 'Once daily, morning', duration: '6 weeks' },
    ],
    notes: 'Use non-comedogenic skincare products. Review in 6 weeks.',
  },
  {
    patientId: '6a92ca2c445cce9d02c98760', doctorId: '6a86e04eb86f7ca41843da88',
    condition: {
      bloodPressure: '124/80 mmHg', heartRate: '74 bpm', temperature: '98.5°F', weight: '',
      symptoms: 'Dry, itchy scalp patches with visible flaking.',
      diagnosis: 'Seborrheic dermatitis (scalp)',
    },
    medicines: [
      { name: 'Ketoconazole 2% shampoo', dosage: 'Apply and leave for 5 min', frequency: 'Twice weekly', duration: '4 weeks' },
      { name: 'Hydrocortisone 1% lotion', dosage: 'Apply thin layer', frequency: 'Once daily for flare-ups', duration: 'As needed' },
    ],
    notes: 'Follow up in 4 weeks.',
  },

  // --- Dr. Sarthak Solanki (Orthopedics) ---
  {
    patientId: '6a92cae33e369f08415cb3cc', doctorId: '6a86e093b86f7ca41843da8d',
    condition: {
      bloodPressure: '130/84 mmHg', heartRate: '78 bpm', temperature: '98.4°F', weight: '',
      symptoms: 'Acute lower back pain following heavy lifting.',
      diagnosis: 'Lumbar muscle strain',
    },
    medicines: [
      { name: 'Diclofenac', dosage: '50mg', frequency: 'Twice daily', duration: '5 days' },
      { name: 'Thiocolchicoside', dosage: '4mg', frequency: 'Twice daily', duration: '5 days' },
    ],
    notes: 'Avoid heavy lifting for 2 weeks. Physiotherapy referral given. Review if no improvement in 1 week.',
  },
  {
    patientId: '6a92cb143e369f08415cb3d9', doctorId: '6a86e093b86f7ca41843da8d',
    condition: {
      bloodPressure: '134/86 mmHg', heartRate: '80 bpm', temperature: '98.3°F', weight: '',
      symptoms: 'Chronic right knee pain, worse with stair climbing.',
      diagnosis: 'Osteoarthritis - knee (early stage)',
    },
    medicines: [
      { name: 'Paracetamol', dosage: '650mg', frequency: 'PRN for pain (max 3/day)', duration: '4 weeks' },
      { name: 'Glucosamine + Chondroitin', dosage: '500mg/400mg', frequency: 'Once daily', duration: '3 months' },
    ],
    notes: 'Weight management and physiotherapy for quadriceps strengthening advised. Review in 8 weeks.',
  },
  {
    patientId: '6a92cb613e369f08415cb3e6', doctorId: '6a86e093b86f7ca41843da8d',
    condition: {
      bloodPressure: '114/72 mmHg', heartRate: '76 bpm', temperature: '98.2°F', weight: '',
      symptoms: 'Right shoulder stiffness and pain following a minor fall.',
      diagnosis: 'Shoulder soft tissue injury',
    },
    medicines: [
      { name: 'Diclofenac gel', dosage: 'Apply thin layer', frequency: 'Three times daily', duration: '2 weeks' },
      { name: 'Paracetamol', dosage: '650mg', frequency: 'PRN for pain', duration: '1 week' },
    ],
    notes: 'Ice for first 48 hours, then heat therapy. Gentle range-of-motion exercises. Review in 2 weeks.',
  },

  // --- Dr. Rohit Singh (General Physician) ---
  {
    patientId: '6a92cc183e369f08415cb3f3', doctorId: '6a86e0d8b86f7ca41843da92',
    condition: {
      bloodPressure: '122/80 mmHg', heartRate: '88 bpm', temperature: '100.8°F', weight: '',
      symptoms: 'Fever and body ache for 3 days.',
      diagnosis: 'Viral fever',
    },
    medicines: [
      { name: 'Paracetamol', dosage: '650mg', frequency: 'Every 6 hours for fever', duration: '5 days' },
    ],
    notes: 'Adequate hydration and rest advised. Review if fever persists beyond 5 days.',
  },
  {
    patientId: '6a92cc633e369f08415cb400', doctorId: '6a86e0d8b86f7ca41843da92',
    condition: {
      bloodPressure: '118/76 mmHg', heartRate: '72 bpm', temperature: '98.4°F', weight: '',
      symptoms: 'Asymptomatic, routine annual checkup.',
      diagnosis: 'Routine health checkup - normal',
    },
    medicines: [
      { name: 'Multivitamin', dosage: '1 tablet', frequency: 'Once daily', duration: 'Ongoing' },
    ],
    notes: 'Routine blood work advised (CBC, lipid profile, fasting glucose). Annual follow-up recommended.',
  },
  {
    patientId: '6a92cc9a3e369f08415cb40d', doctorId: '6a86e0d8b86f7ca41843da92',
    condition: {
      bloodPressure: '116/74 mmHg', heartRate: '78 bpm', temperature: '99.2°F', weight: '',
      symptoms: 'Persistent cough and mild sore throat.',
      diagnosis: 'Upper respiratory tract infection (viral)',
    },
    medicines: [
      { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily at night', duration: '5 days' },
      { name: 'Dextromethorphan cough syrup', dosage: '10ml', frequency: 'Three times daily', duration: '5 days' },
      { name: 'Paracetamol', dosage: '650mg', frequency: 'PRN for throat discomfort', duration: '5 days' },
    ],
    notes: 'Warm saline gargles advised. Review in 1 week if symptoms do not improve.',
  },

  // --- Dr. Yashvi Jain (General Physician) ---
  {
    patientId: '6a92ccd43e369f08415cb41a', doctorId: '6a86e133b86f7ca41843da97',
    condition: {
      bloodPressure: '120/78 mmHg', heartRate: '74 bpm', temperature: '98.3°F', weight: '',
      symptoms: 'Generalized fatigue and low energy for 3 weeks.',
      diagnosis: 'Fatigue - under evaluation',
    },
    medicines: [
      { name: 'Vitamin B-Complex', dosage: '1 tablet', frequency: 'Once daily', duration: '4 weeks' },
    ],
    notes: 'Blood tests ordered: CBC, thyroid profile, ferritin. Advised adequate sleep and hydration. Follow up in 1 week with results.',
  },
  {
    patientId: '6a92cd0e3e369f08415cb427', doctorId: '6a86e133b86f7ca41843da97',
    condition: {
      bloodPressure: '128/82 mmHg', heartRate: '76 bpm', temperature: '98.4°F', weight: '',
      symptoms: 'Asymptomatic, routine annual screening.',
      diagnosis: 'Routine checkup - blood work pending',
    },
    medicines: [
      { name: 'Multivitamin', dosage: '1 tablet', frequency: 'Once daily', duration: 'Ongoing' },
    ],
    notes: 'Fasting blood glucose and lipid profile ordered. Follow-up scheduled once results are available.',
  },
  {
    patientId: '6a92cd4c3e369f08415cb434', doctorId: '6a86e133b86f7ca41843da97',
    condition: {
      bloodPressure: '118/76 mmHg', heartRate: '82 bpm', temperature: '99.6°F', weight: '',
      symptoms: 'Mild fever with headache since yesterday.',
      diagnosis: 'Viral fever with headache',
    },
    medicines: [
      { name: 'Paracetamol', dosage: '650mg', frequency: 'Every 6-8 hours as needed', duration: '3 days' },
    ],
    notes: 'Rest and adequate fluid intake advised. Review if fever persists beyond 3 days.',
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

  for (const rx of PRESCRIPTIONS) {
    const patientUser = await User.findById(rx.patientId)
    const doctorUser = await User.findById(rx.doctorId)

    if (!patientUser || !doctorUser) {
      console.log(`✗ Skipped: patient or doctor not found for ${rx.condition.diagnosis}`)
      failed++
      continue
    }

    try {
      await Prescription.create({
        patient: patientUser._id,
        doctor: doctorUser._id,
        condition: rx.condition,
        medicines: rx.medicines,
        notes: rx.notes,
        date: new Date(),
      })
      const medList = rx.medicines.map((m) => m.name).join(', ')
      console.log(`✓ ${patientUser.name} (Dr. ${doctorUser.name}) — ${rx.condition.diagnosis} — [${medList}]`)
      created++
    } catch (err) {
      console.log(`✗ Failed for ${patientUser.name}: ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone. Prescriptions created: ${created}, Failed: ${failed}`)
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error('Script error:', err)
  process.exit(1)
})