import { useState } from 'react'
import { bookAppointment } from '../../services/appointmentService'

function BookingModal({ doctor, onClose, onSuccess }) {
  const [formData, setFormData] = useState({ date: '', time: '', reason: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await bookAppointment({
        doctor: doctor.user._id,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-body hover:text-ink text-xl leading-none"
        >
          ✕
        </button>

        <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
          Book appointment
        </p>
        <h2 className="font-display text-2xl text-ink mb-1">
          Dr. {doctor.user?.name}
        </h2>
        <p className="text-sm text-body mb-6">{doctor.specialization || 'General Physician'}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Reason for visit</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              placeholder="Briefly describe your symptoms or reason..."
              className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {saving ? 'Booking...' : 'Confirm booking'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookingModal