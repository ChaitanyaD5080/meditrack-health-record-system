import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/common/DashboardLayout'
import { getAppointments } from '../../services/appointmentService'

function DoctorPatientList() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await getAppointments()
        const uniquePatients = []
        const seen = new Set()
        res.data.forEach((appt) => {
          if (appt.patient && !seen.has(appt.patient._id)) {
            seen.add(appt.patient._id)
            uniquePatients.push(appt.patient)
          }
        })
        setPatients(uniquePatients)
      } catch (err) {
        setError('Failed to load patients')
      } finally {
        setLoading(false)
      }
    }
    fetchPatients()
  }, [])

  return (
    <DashboardLayout>
      <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
        Doctor
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">My Patients</h1>
      <p className="text-body mb-8">{patients.length} patients under your care</p>

      {loading && <p className="text-body">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {patients.length === 0 ? (
            <p className="text-body col-span-full">No patients yet — appointments will appear here once booked.</p>
          ) : (
            patients.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/doctor/patients/${p._id}`)}
                className="bg-white border border-border rounded-2xl p-6 cursor-pointer hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-medium mb-3">
                  {p.name?.charAt(0).toUpperCase()}
                </div>
                <p className="font-display text-lg text-ink">{p.name}</p>
                <p className="text-sm text-body">{p.email}</p>
                <p className="text-xs text-primary mt-3 font-medium">View records →</p>
              </div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

export default DoctorPatientList