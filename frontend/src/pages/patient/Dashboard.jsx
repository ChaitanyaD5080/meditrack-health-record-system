import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { useAuth } from '../../hooks/useAuth'
import { getAppointments } from '../../services/appointmentService'
import { getRecords } from '../../services/recordService'

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-6">
      <p className="text-xs font-mono text-body uppercase tracking-wide mb-3">{label}</p>
      <p className="font-display text-3xl text-ink mb-1">{value}</p>
      <p className="text-sm text-body">{sub}</p>
    </div>
  )
}

function PatientDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, recRes] = await Promise.all([getAppointments(), getRecords()])
        setAppointments(apptRes.data)
        setRecords(recRes.data)
      } catch (err) {
        console.log('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const upcomingCount = appointments.filter(
    (a) => a.status !== 'cancelled' && a.status !== 'completed'
  ).length

  return (
    <DashboardLayout>
      <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
        Patient Dashboard
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">Welcome, {user?.name}</h1>
      <p className="text-body mb-8">Here's what's happening with your health records.</p>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <StatCard label="Upcoming" value={loading ? '-' : upcomingCount} sub="Appointments" />
        <StatCard label="Records" value={loading ? '-' : records.length} sub="Medical reports" />
        <StatCard label="Prescriptions" value="0" sub="Active prescriptions" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="font-display text-lg text-ink mb-1">Upcoming appointments</h2>
          {loading ? (
            <p className="text-sm text-body py-4">Loading...</p>
          ) : appointments.length === 0 ? (
            <div className="flex items-center justify-between py-4">
              <p className="text-sm text-body">No appointments booked</p>
              <a href="/patient/doctors" className="text-xs font-medium text-primary hover:underline">
                Find a doctor
              </a>
            </div>
          ) : (
            appointments.slice(0, 3).map((appt) => (
              <div key={appt._id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-ink">Dr. {appt.doctor?.name}</p>
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
          <h2 className="font-display text-lg text-ink mb-1">Recent records</h2>
          {loading ? (
            <p className="text-sm text-body py-4">Loading...</p>
          ) : records.length === 0 ? (
            <div className="flex items-center justify-between py-4">
              <p className="text-sm text-body">No records uploaded</p>
              <a href="/patient/records" className="text-xs font-medium text-primary hover:underline">
                Upload report
              </a>
            </div>
          ) : (
            records.slice(0, 3).map((rec) => (
              <div key={rec._id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <p className="text-sm font-medium text-ink">{rec.diagnosis || 'Untitled record'}</p>
                <p className="text-xs text-body">{new Date(rec.date).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default PatientDashboard