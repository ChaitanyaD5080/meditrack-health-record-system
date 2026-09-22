import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import BookingModal from '../../components/patient/BookingModal'
import { getDoctors } from '../../services/doctorService'

function DoctorCard({ doctor, onBook }) {
  const name = doctor.user?.name || 'Unknown Doctor'
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="bg-white border border-border rounded-2xl p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-medium shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg text-ink truncate">Dr. {name}</p>
          <p className="text-xs text-body">{doctor.specialization || 'General Physician'}</p>
        </div>
      </div>

      <div className="text-sm text-body space-y-1 mb-5">
        <p>{doctor.experience || 0} years experience</p>
        <p className="truncate">{doctor.user?.email}</p>
      </div>

      <button
        onClick={() => onBook(doctor)}
        className="mt-auto w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
      >
        Book Appointment
      </button>
    </div>
  )
}

function DoctorSearch() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const res = await getDoctors()
      setDoctors(res.data)
    } catch (err) {
      setError('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const filtered = doctors.filter((d) =>
    (d.user?.name || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleBookingSuccess = () => {
    setSelectedDoctor(null)
    setSuccessMsg('Appointment booked successfully! Check your Appointments page.')
    setTimeout(() => setSuccessMsg(''), 5000)
  }

  return (
    <DashboardLayout>
      <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
        Find a Doctor
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">Browse doctors</h1>
      <p className="text-body mb-8">Choose a doctor to book an appointment with.</p>

      {successMsg && (
        <div className="bg-primary/10 border border-primary/30 text-primary text-sm rounded-lg px-4 py-2.5 mb-6 max-w-lg">
          {successMsg}
        </div>
      )}

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition mb-8"
      />

      {loading && <p className="text-body">Loading doctors...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.length === 0 ? (
            <p className="text-body col-span-full">No doctors found.</p>
          ) : (
            filtered.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} onBook={setSelectedDoctor} />
            ))
          )}
        </div>
      )}

      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </DashboardLayout>
  )
}

export default DoctorSearch