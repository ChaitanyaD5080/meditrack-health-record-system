import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { getPrescriptions } from '../../services/prescriptionService'

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await getPrescriptions()
        setPrescriptions(res.data)
      } catch (err) {
        setError('Failed to load prescriptions')
      } finally {
        setLoading(false)
      }
    }
    fetchPrescriptions()
  }, [])

  return (
    <DashboardLayout>
      <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
        Patient
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">My Prescriptions</h1>
      <p className="text-body mb-8">{prescriptions.length} prescriptions on file</p>

      {loading && <p className="text-body">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          {prescriptions.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-8 text-center">
              <p className="text-body">No prescriptions yet</p>
            </div>
          ) : (
            prescriptions.map((rx) => (
              <div key={rx._id} className="bg-white border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <p className="font-display text-lg text-ink">{rx.condition?.diagnosis}</p>
                  <p className="text-xs text-body">{new Date(rx.date).toLocaleDateString()}</p>
                </div>
                <p className="text-sm text-body mb-4">Prescribed by Dr. {rx.doctor?.name}</p>

                {(rx.condition?.bloodPressure || rx.condition?.heartRate || rx.condition?.temperature) && (
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-body mb-4 border-b border-border pb-4">
                    {rx.condition?.bloodPressure && <span>BP: {rx.condition.bloodPressure}</span>}
                    {rx.condition?.heartRate && <span>HR: {rx.condition.heartRate}</span>}
                    {rx.condition?.temperature && <span>Temp: {rx.condition.temperature}</span>}
                    {rx.condition?.weight && <span>Weight: {rx.condition.weight}</span>}
                  </div>
                )}

                {rx.condition?.symptoms && (
                  <p className="text-sm text-body mb-4">
                    <span className="font-medium text-ink">Symptoms: </span>
                    {rx.condition.symptoms}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  <p className="text-xs font-mono uppercase text-body">Medicines</p>
                  {rx.medicines?.map((m, i) => (
                    <div key={i} className="bg-surface rounded-lg px-4 py-2.5 text-sm">
                      <span className="font-medium text-ink">{m.name}</span>
                      <span className="text-body"> — {m.dosage}, {m.frequency}, {m.duration}</span>
                    </div>
                  ))}
                </div>

                {rx.notes && (
                  <p className="text-sm text-body italic border-t border-border pt-4">{rx.notes}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

export default Prescriptions