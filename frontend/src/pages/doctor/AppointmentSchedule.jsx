import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { getAppointments } from '../../services/appointmentService'
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

function AppointmentSchedule() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const res = await getAppointments()
      setAppointments(res.data)
    } catch (err) {
      setError('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status })
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      )
    } catch (err) {
      alert('Failed to update appointment')
    }
  }

  return (
    <DashboardLayout>
      <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
        Doctor
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">My Schedule</h1>
      <p className="text-body mb-8">{appointments.length} total appointments</p>

      {loading && <p className="text-body">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-8 text-center">
              <p className="text-body">No appointments scheduled yet</p>
            </div>
          ) : (
            appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white border border-border rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3"
              >
                <div>
                  <p className="font-medium text-ink">{appt.patient?.name}</p>
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

                <div className="flex items-center gap-2">
                  <StatusBadge status={appt.status} />
                  {appt.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(appt._id, 'confirmed')}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Confirm
                    </button>
                  )}
                  {appt.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(appt._id, 'completed')}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Mark completed
                    </button>
                  )}
                  {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                    <button
                      onClick={() => updateStatus(appt._id, 'cancelled')}
                      className="text-xs font-medium text-red-500 hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

export default AppointmentSchedule