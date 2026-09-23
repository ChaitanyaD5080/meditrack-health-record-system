import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import BookingModal from '../../components/patient/BookingModal'
import { getDoctors } from '../../services/doctorService'

const PAGE_SIZE = 2

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

function Pagination({ page, totalPages, onPrev, onNext }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="px-4 py-2 text-sm font-medium text-primary border border-border rounded-lg hover:border-primary/40 disabled:text-body/40 disabled:hover:border-border disabled:cursor-not-allowed transition-colors"
      >
        &larr; Previous
      </button>
      <span className="text-sm text-body">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="px-4 py-2 text-sm font-medium text-primary border border-border rounded-lg hover:border-primary/40 disabled:text-body/40 disabled:hover:border-border disabled:cursor-not-allowed transition-colors"
      >
        Next &rarr;
      </button>
    </div>
  )
}

function DoctorSearch() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchDoctors = async (searchTerm, pageNum) => {
    setLoading(true)
    try {
      const res = await getDoctors({ search: searchTerm, page: pageNum, limit: PAGE_SIZE })
      setDoctors(res.data.doctors)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      setError('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors(search, page)
  }, [page])

  // Reset to page 1 whenever the search term changes, then fetch
  useEffect(() => {
    if (page === 1) {
      fetchDoctors(search, 1)
    } else {
      setPage(1)
    }
  }, [search])

  const handleBookingSuccess = () => {
    setSelectedDoctor(null)
    setSuccessMsg('Appointment booked successfully! Check your Appointments page.')
    setTimeout(() => setSuccessMsg(''), 5000)
    fetchDoctors(search, page)
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
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.length === 0 ? (
              <p className="text-body col-span-full">No doctors found.</p>
            ) : (
              doctors.map((doc) => (
                <DoctorCard key={doc._id} doctor={doc} onBook={setSelectedDoctor} />
              ))
            )}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </>
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