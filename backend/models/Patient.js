import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    age: { type: Number },
    dob: { type: Date },
   gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    bloodGroup: { type: String, default: '' },
    allergies: [{ type: String }],
    address: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
  },
  { timestamps: true }
)

const Patient = mongoose.model('Patient', patientSchema)
export default Patient