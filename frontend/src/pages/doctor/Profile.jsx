import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { getMyDoctorProfile, updateMyDoctorProfile } from '../../services/doctorService'

function DoctorProfile() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialization: '',
    experience: '',
    qualification: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyDoctorProfile()
        setFormData({
          name: res.data.user?.name || '',
          phone: res.data.user?.phone || '',
          specialization: res.data.specialization || '',
          experience: res.data.experience || '',
          qualification: res.data.qualification || '',
        })
      } catch (err) {
        console.log('Profile fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await updateMyDoctorProfile(formData)
      setMessage('Profile updated successfully')
    } catch (err) {
      setMessage('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-body">Loading profile...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
        Doctor
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">My Profile</h1>
      <p className="text-body mb-8">Update your professional information.</p>

      {message && (
        <div className="bg-primary/10 border border-primary/30 text-primary text-sm rounded-lg px-4 py-2.5 mb-6 max-w-lg">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Full name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-2.5 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Specialization</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="Cardiology"
            className="w-full px-4 py-2.5 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Experience (years)</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2.5 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Qualification</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="MBBS, MD"
              className="w-full px-4 py-2.5 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </DashboardLayout>
  )
}

export default DoctorProfile