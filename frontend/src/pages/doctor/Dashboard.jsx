import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/common/DashboardLayout'
import { useAuth } from '../../hooks/useAuth'
import { getAppointments } from '../../services/appointmentService'

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-6">
      <p className="text-xs font-mono text-body uppercase tracking-wide mb-3">{label}</p>
      <p className="font-display text-3xl text-ink mb-1">{value}</p>
      <p className="text-sm text-body">{sub}</p>
    </div>
  )
}

function DoctorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAppointments()
        setAppointments(res.data)
      } catch (err) {
        console.log('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const today = new Date().toDateString()
  const todayCount = appointments.filter(
    (a) => new Date(a.date).toDateString() === today
  ).length

  const uniquePatients = new Set(appointments.map((a) => a.patient?._id)).size
  const pendingCount = appointments.filter((a) => a.status === 'pending').length

  return (
    <DashboardLayout>
      <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
        Doctor Dashboard
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">Welcome, Dr. {user?.name}</h1>
      <p className="text-body mb-8">Here's an overview of your patients and schedule.</p>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <StatCard label="Today" value={loading ? '-' : todayCount} sub="Appointments" />
        <StatCard label="Patients" value={loading ? '-' : uniquePatients} sub="Under your care" />
        <StatCard label="Pending" value={loading ? '-' : pendingCount} sub="Awaiting confirmation" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="font-display text-lg text-ink mb-1">Recent appointments</h2>
          {loading ? (
            <p className="text-sm text-body py-4">Loading...</p>
          ) : appointments.length === 0 ? (
            <p className="text-sm text-body py-4">No appointments scheduled yet</p>
          ) : (
            appointments.slice(0, 4).map((appt) => (
              <div key={appt._id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-ink">{appt.patient?.name}</p>
                  <p className="text-xs text-body">
                    {new Date(appt.date).toLocaleDateString()} at {appt.time}
                  </p>
                </div>
                <span className="text-xs text-body capitalize">{appt.status}</span>
              </div>
            ))
          )}
        </div>

        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="font-display text-lg text-ink mb-3">Quick actions</h2>
          <button
            onClick={() => navigate('/doctor/patients')}
            className="w-full text-left px-4 py-3 border border-border rounded-lg hover:border-primary/40 transition-colors mb-2"
          >
            <p className="text-sm font-medium text-ink">View my patients</p>
            <p className="text-xs text-body mt-0.5">See patient list and records</p>
          </button>
          <button
            onClick={() => navigate('/doctor/schedule')}
            className="w-full text-left px-4 py-3 border border-border rounded-lg hover:border-primary/40 transition-colors"
          >
            <p className="text-sm font-medium text-ink">Manage schedule</p>
            <p className="text-xs text-body mt-0.5">Confirm or update appointments</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DoctorDashboard