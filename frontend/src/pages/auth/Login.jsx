import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { loginUser } from '../../services/authService'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await loginUser(formData)

      login(
        { name: res.data.name, email: res.data.email, role: res.data.role },
        res.data.token
      )

      if (res.data.role === 'doctor') navigate('/doctor/dashboard')
      else if (res.data.role === 'admin') navigate('/admin/dashboard')
      else navigate('/patient/dashboard')
    } catch (err) {
      console.log('Login error:', err)
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
            "Every visit, every
            <br />
            report, one record."
          </p>
          <p className="text-white/50 text-sm font-mono">
            Welcome back — your chart is right where you left it.
          </p>
        </div>
        <p className="text-xs text-white/30 font-mono">RECORD #PT-04821</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-body hover:text-primary transition-colors mb-8"
          >
            ← Back to home
          </button>

          <span
            onClick={() => navigate('/')}
            className="font-display text-xl text-ink cursor-pointer lg:hidden block mb-10 text-center"
          >
            Medi<span className="text-primary italic">Track</span>
          </span>

          <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
            Welcome back
          </p>
          <h2 className="font-display text-3xl text-ink mb-6">Sign in to MediTrack.</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            <div className="text-right">
              <span
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-primary font-medium cursor-pointer hover:underline"
              >
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-body text-center mt-8">
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-primary font-medium cursor-pointer hover:underline"
            >
              Create one
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login