import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { getPatientProfile, updatePatientProfile } from '../../services/patientService'

function Profile() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    address: '',
    emergencyContact: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getPatientProfile()
        setFormData({
          name: res.data.user?.name || '',
          phone: res.data.user?.phone || '',
          age: res.data.age || '',
          dob: res.data.dob ? res.data.dob.slice(0, 10) : '',
          gender: res.data.gender || '',
          bloodGroup: res.data.bloodGroup || '',
          address: res.data.address || '',
          emergencyContact: res.data.emergencyContact || '',
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
      await updatePatientProfile(formData)
      setMessage('Profile updated successfully')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile')
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

  const inputClass =
    'w-full px-4 py-2.5 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition'

  return (
    <DashboardLayout>
      <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
        Patient
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">My Profile</h1>
      <p className="text-body mb-8">Update your personal and medical information.</p>

      {message && (
        <div className="bg-primary/10 border border-primary/30 text-primary text-sm rounded-lg px-4 py-2.5 mb-6 max-w-lg">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Full name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="0"
            max="120"
            placeholder="28"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Date of birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              max={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Blood group</label>
          <input
            type="text"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            placeholder="O+"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Emergency contact</label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="Name - +91 98765 43210"
            className={inputClass}
          />
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

export default Profile