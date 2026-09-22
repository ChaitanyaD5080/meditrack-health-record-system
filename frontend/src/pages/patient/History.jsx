import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { getAppointments } from '../../services/appointmentService'
import { getRecords } from '../../services/recordService'

function History() {
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [apptRes, recRes] = await Promise.all([getAppointments(), getRecords()])

        const apptEvents = apptRes.data.map((a) => ({
          type: 'appointment',
          date: a.date,
          title: `Appointment with Dr. ${a.doctor?.name}`,
          subtitle: a.reason || 'No reason given',
          status: a.status,
        }))

        const recordEvents = recRes.data.map((r) => ({
          type: 'record',
          date: r.date,
          title: r.diagnosis || 'Medical record',
          subtitle: r.notes || (r.doctor?.name ? `Added by Dr. ${r.doctor.name}` : 'Self-uploaded'),
        }))

        const combined = [...apptEvents, ...recordEvents].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )

        setTimeline(combined)
      } catch (err) {
        setError('Failed to load history')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  return (
    <DashboardLayout>
      <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
        Patient
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">Medical History</h1>
      <p className="text-body mb-8">A complete timeline of your appointments and records.</p>

      {loading && <p className="text-body">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="relative">
          {timeline.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-8 text-center">
              <p className="text-body">No history yet — book an appointment or upload a record to get started.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {timeline.map((event, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
                        event.type === 'appointment' ? 'bg-primary' : 'bg-accent'
                      }`}
                    />
                    {idx !== timeline.length - 1 && (
                      <div className="w-px flex-1 bg-border my-1" />
                    )}
                  </div>

                  <div className="pb-6 flex-1">
                    <p className="text-xs text-body font-mono mb-1">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <div className="bg-white border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="font-medium text-ink text-sm">{event.title}</p>
                        <span
                          className={`text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${
                            event.type === 'appointment'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-accent/10 text-accent'
                          }`}
                        >
                          {event.type === 'appointment' ? event.status : 'Record'}
                        </span>
                      </div>
                      {event.subtitle && (
                        <p className="text-xs text-body mt-1.5">{event.subtitle}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

export default History