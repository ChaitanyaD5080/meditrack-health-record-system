import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import api from '../../services/api'

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-primary/10 text-primary border-primary/30',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}

function StatusBadge({ status }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[status] || ''}`}>
      {status}
    </span>
  )
}

function ManageAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/admin/appointments')
        setAppointments(res.data)
      } catch (err) {
        setError('Failed to load appointments')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <DashboardLayout>
      <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
        Admin
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">All Appointments</h1>
      <p className="text-body mb-8">{appointments.length} total across the platform</p>

      {loading && <p className="text-body">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr className="text-left text-body">
                <th className="px-6 py-3 font-medium">Patient</th>
                <th className="px-6 py-3 font-medium">Doctor</th>
                <th className="px-6 py-3 font-medium">Date & time</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-body">
                    No appointments booked yet
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt._id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4 text-ink font-medium">{appt.patient?.name}</td>
                    <td className="px-6 py-4 text-body">Dr. {appt.doctor?.name}</td>
                    <td className="px-6 py-4 text-body">
                      {new Date(appt.date).toLocaleDateString()} at {appt.time}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={appt.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}

export default ManageAppointments