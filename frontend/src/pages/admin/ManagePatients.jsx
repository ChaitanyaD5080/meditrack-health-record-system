import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { getUsersByRole, deleteUser } from '../../services/adminService'

function ManagePatients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const res = await getUsersByRole('patient')
      setPatients(res.data)
    } catch (err) {
      setError('Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Remove this patient account?')) return
    try {
      await deleteUser(id)
      setPatients(patients.filter((p) => p._id !== id))
    } catch (err) {
      alert('Failed to delete')
    }
  }

  return (
    <DashboardLayout>
      <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
        Admin
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">Manage Patients</h1>
      <p className="text-body mb-8">{patients.length} registered patients</p>

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
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-body">
                    No patients registered yet
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p._id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4 text-ink font-medium">{p.name}</td>
                    <td className="px-6 py-4 text-body">{p.email}</td>
                    <td className="px-6 py-4 text-body">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(p._id)}
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

export default ManagePatients