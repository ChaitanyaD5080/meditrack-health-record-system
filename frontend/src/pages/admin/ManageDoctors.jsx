import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { getUsersByRole, deleteUser } from '../../services/adminService'

function ManageDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const res = await getUsersByRole('doctor')
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

  const handleDelete = async (id) => {
    if (!confirm('Remove this doctor account?')) return
    try {
      await deleteUser(id)
      setDoctors(doctors.filter((d) => d._id !== id))
    } catch (err) {
      alert('Failed to delete')
    }
  }

  return (
    <DashboardLayout>
      <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
        Admin
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">Manage Doctors</h1>
      <p className="text-body mb-8">{doctors.length} registered doctors</p>

      {loading && <p className="text-body">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr className="text-left text-body">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-body">
                    No doctors registered yet
                  </td>
                </tr>
              ) : (
                doctors.map((doc) => (
                  <tr key={doc._id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4 text-ink font-medium">{doc.name}</td>
                    <td className="px-6 py-4 text-body">{doc.email}</td>
                    <td className="px-6 py-4 text-body">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="text-red-500 hover:underline text-xs font-medium"
                      >
                        Remove
                      </button>
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

export default ManageDoctors