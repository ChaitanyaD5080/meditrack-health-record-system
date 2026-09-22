import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { registerUser } from '../../services/authService'

function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [role, setRole] = useState('patient')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    specialization: '',
    experience: '',
    qualification: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        phone: formData.phone,
      }

      if (role === 'patient') {
        payload.age = formData.age
        payload.gender = formData.gender
        payload.bloodGroup = formData.bloodGroup
      } else {
        payload.specialization = formData.specialization
        payload.experience = formData.experience
        payload.qualification = formData.qualification
      }

      const res = await registerUser(payload)

      login(
        { name: res.data.name, email: res.data.email, role: res.data.role },
        res.data.token
      )

      navigate(res.data.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg font-sans flex">
      <div className="hidden lg:flex lg:w-5/12 bg-ink text-white flex-col justify-between p-10">
        <span onClick={() => navigate('/')} className="font-display text-xl cursor-pointer">
          Medi<span className="text-primary italic">Track</span>
        </span>
        <div>
          <p className="font-display text-3xl leading-snug mb-4">
            "One chart, kept
            <br />
            in good order."
          </p>
          <p className="text-white/50 text-sm font-mono">
            Set up your account as a patient or a doctor — takes under a minute.
          </p>
        </div>
        <p className="text-xs text-white/30 font-mono">RECORD #PT-04821</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-sm">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-body hover:text-primary transition-colors mb-6"
          >
            ← Back to home
          </button>

          <span
            onClick={() => navigate('/')}
            className="font-display text-xl text-ink cursor-pointer lg:hidden block mb-8 text-center"
          >
            Medi<span className="text-primary italic">Track</span>
          </span>

          <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
            Create account
          </p>
          <h2 className="font-display text-3xl text-ink mb-6">Join MediTrack.</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Account Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            {role === 'patient' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    placeholder="30"
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </>
            )}

            {role === 'doctor' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    placeholder="Cardiology"
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Experience (years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    placeholder="5"
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                    placeholder="MD, Board Certified"
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-body text-center mt-8">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-primary font-medium cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register