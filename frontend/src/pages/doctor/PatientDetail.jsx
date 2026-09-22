import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/common/DashboardLayout'
import { getPatientRecords } from '../../services/recordService'
import { getPatientProfileById } from '../../services/patientService'
import { getPatientPrescriptions } from '../../services/prescriptionService'

function DoctorPatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [records, setRecords] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, recordsRes, prescRes] = await Promise.all([
          getPatientProfileById(id),
          getPatientRecords(id),
          getPatientPrescriptions(id),
        ])
        setProfile(profileRes.data)
        setRecords(recordsRes.data)
        setPrescriptions(prescRes.data)
      } catch (err) {
        setError('Failed to load patient data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-body">Loading...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
        <div>
          <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
            Doctor
          </p>
          <h1 className="font-display text-3xl text-ink mb-1">
            {profile?.user?.name || 'Patient'}
          </h1>
        </div>
        <button
          onClick={() => navigate(`/doctor/prescribe/${id}`)}
          className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          Write Prescription
        </button>
      </div>
      <p className="text-body mb-8">Patient overview, records, and prescriptions</p>

      {error && <p className="text-red-600 mb-6">{error}</p>}

      {profile && (
        <div className="bg-white border border-border rounded-2xl p-6 mb-6">
          <h2 className="font-display text-lg text-ink mb-4">Patient info</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-body uppercase font-mono mb-1">Age</p>
              <p className="text-ink font-medium">{profile.age || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-body uppercase font-mono mb-1">Gender</p>
              <p className="text-ink font-medium capitalize">{profile.gender || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-body uppercase font-mono mb-1">Blood group</p>
              <p className="text-ink font-medium">{profile.bloodGroup || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-body uppercase font-mono mb-1">Phone</p>
              <p className="text-ink font-medium">{profile.user?.phone || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-body uppercase font-mono mb-1">Email</p>
              <p className="text-ink font-medium">{profile.user?.email || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-body uppercase font-mono mb-1">Address</p>
              <p className="text-ink font-medium">{profile.address || '—'}</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="font-display text-lg text-ink mb-3">Prescriptions</h2>
      <div className="space-y-3 mb-8">
        {prescriptions.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-6 text-center">
            <p className="text-body text-sm">No prescriptions written yet</p>
          </div>
        ) : (
          prescriptions.map((rx) => (
            <div key={rx._id} className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <p className="font-medium text-ink">{rx.condition?.diagnosis}</p>
                <p className="text-xs text-body">
                  {new Date(rx.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-body mb-3">
                {rx.condition?.bloodPressure && <span>BP: {rx.condition.bloodPressure}</span>}
                {rx.condition?.heartRate && <span>HR: {rx.condition.heartRate}</span>}
                {rx.condition?.temperature && <span>Temp: {rx.condition.temperature}</span>}
              </div>
              <div className="space-y-1">
                {rx.medicines?.map((m, i) => (
                  <p key={i} className="text-sm text-ink">
                    <span className="font-medium">{m.name}</span> — {m.dosage}, {m.frequency}, {m.duration}
                  </p>
                ))}
              </div>
              {rx.notes && <p className="text-xs text-body mt-2 italic">{rx.notes}</p>}
            </div>
          ))
        )}
      </div>

      <h2 className="font-display text-lg text-ink mb-3">Medical records</h2>
      <div className="space-y-3">
        {records.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-8 text-center">
            <p className="text-body">No records for this patient yet</p>
          </div>
        ) : (
          records.map((rec) => (
            <div key={rec._id} className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-medium text-ink">{rec.diagnosis || 'Untitled record'}</p>
                  <p className="text-xs text-body mt-0.5">
                    {new Date(rec.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                {rec.attachments?.[0] && (
                  <a
                    href={`http://localhost:5000/${rec.attachments[0]}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    View attachment
                  </a>
                )}
              </div>
              {rec.notes && <p className="text-sm text-body mt-2">{rec.notes}</p>}
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  )
}

export default DoctorPatientDetail