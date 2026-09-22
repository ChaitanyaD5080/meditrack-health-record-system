import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { getAppointments } from '../../services/appointmentService'

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

function AppointmentList() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await getAppointments()
        setAppointments(res.data)
      } catch (err) {
        setError('Failed to load appointments')
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [])

  return (
    <DashboardLayout>
      <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
        Patient
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">My Appointments</h1>
      <p className="text-body mb-8">{appointments.length} total bookings</p>

      {loading && <p className="text-body">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-8 text-center">
              <p className="text-body">No appointments booked yet</p>
            </div>
          ) : (
            appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white border border-border rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3"
              >
                <div>
                  <p className="font-medium text-ink">Dr. {appt.doctor?.name}</p>
                  <p className="text-sm text-body mt-0.5">
                    {new Date(appt.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    at {appt.time}
                  </p>
                  {appt.reason && (
                    <p className="text-xs text-body/70 mt-1 max-w-md">{appt.reason}</p>
                  )}
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

export default AppointmentList