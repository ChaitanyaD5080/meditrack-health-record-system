import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: { type: String, default: 'General Physician' },
    experience: { type: Number, default: 0 },
    qualification: { type: String, default: '' },
    availability: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],
  },
  { timestamps: true }
)

const Doctor = mongoose.model('Doctor', doctorSchema)
export default Doctor
