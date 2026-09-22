import mongoose from 'mongoose'

const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    condition: {
      bloodPressure: { type: String, default: '' },
      heartRate: { type: String, default: '' },
      temperature: { type: String, default: '' },
      weight: { type: String, default: '' },
      symptoms: { type: String, default: '' },
      diagnosis: { type: String, default: '' },
    },
    medicines: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
      },
    ],
    notes: { type: String, default: '' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

const Prescription = mongoose.model('Prescription', prescriptionSchema)
export default Prescription