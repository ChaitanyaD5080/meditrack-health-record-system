import mongoose from 'mongoose'

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    diagnosis: { type: String, default: '' },
    notes: { type: String, default: '' },
    attachments: [{ type: String }],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema)
export default MedicalRecord
