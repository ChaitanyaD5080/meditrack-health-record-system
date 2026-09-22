import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { getRecords, uploadRecord, deleteRecord } from '../../services/recordService'

function MedicalRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const res = await getRecords()
      setRecords(res.data)
    } catch (err) {
      setError('Failed to load records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    setUploading(true)
    setUploadError('')
    try {
      const formData = new FormData()
      formData.append('diagnosis', diagnosis)
      formData.append('notes', notes)
      if (file) formData.append('attachment', file)

      await uploadRecord(formData)

      setDiagnosis('')
      setNotes('')
      setFile(null)
      setShowForm(false)
      fetchRecords()
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload report')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this record? This cannot be undone.')) return
    try {
      await deleteRecord(id)
      setRecords(records.filter((r) => r._id !== id))
    } catch (err) {
      alert('Failed to delete record')
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
            Patient
          </p>
          <h1 className="font-display text-3xl text-ink mb-1">Medical Records</h1>
          <p className="text-body">{records.length} records on file</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          {showForm ? 'Cancel' : 'Upload report'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleUpload}
          className="bg-white border border-border rounded-2xl p-6 max-w-lg space-y-4 mb-8"
        >
          {uploadError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">
              {uploadError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Diagnosis / Title</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Blood test results"
              required
              className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full px-4 py-2.5 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Attachment (optional)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-body file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:text-sm file:font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      )}

      {loading && <p className="text-body">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {records.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-8 text-center">
              <p className="text-body">No records uploaded yet</p>
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
                      {rec.doctor?.name && ` · Dr. ${rec.doctor.name}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
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
                    <button
                      onClick={() => handleDelete(rec._id)}
                      className="text-xs font-medium text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {rec.notes && <p className="text-sm text-body mt-2">{rec.notes}</p>}
              </div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

export default MedicalRecords