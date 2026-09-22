import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/common/DashboardLayout'
import { createPrescription } from '../../services/prescriptionService'

function WritePrescription() {
  const { patientId } = useParams()
  const navigate = useNavigate()

  const [condition, setCondition] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    symptoms: '',
    diagnosis: '',
  })

  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', duration: '' },
  ])

  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleConditionChange = (e) => {
    setCondition({ ...condition, [e.target.name]: e.target.value })
  }

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines]
    updated[index][field] = value
    setMedicines(updated)
  }

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }])
  }

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!condition.diagnosis.trim()) {
      setError('Please enter a diagnosis before prescribing')
      return
    }

    const validMedicines = medicines.filter((m) => m.name.trim())
    if (validMedicines.length === 0) {
      setError('Please add at least one medicine')
      return
    }

    setSaving(true)
    try {
      await createPrescription({
        patient: patientId,
        condition,
        medicines: validMedicines,
        notes,
      })
      setSuccess(true)
      setTimeout(() => navigate(`/doctor/patients/${patientId}`), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save prescription')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
        Doctor
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">Write Prescription</h1>
      <p className="text-body mb-8">Record the patient's condition, then prescribe accordingly.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-6 max-w-2xl">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-primary/10 border border-primary/30 text-primary text-sm rounded-lg px-4 py-2.5 mb-6 max-w-2xl">
          Prescription saved successfully. Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* STEP 1: Condition / Vitals */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="font-display text-lg text-ink mb-1">1. Patient condition</h2>
          <p className="text-sm text-body mb-5">Record vitals and symptoms first.</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Blood pressure</label>
              <input
                type="text"
                name="bloodPressure"
                value={condition.bloodPressure}
                onChange={handleConditionChange}
                placeholder="120/80"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Heart rate</label>
              <input
                type="text"
                name="heartRate"
                value={condition.heartRate}
                onChange={handleConditionChange}
                placeholder="72 bpm"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Temperature</label>
              <input
                type="text"
                name="temperature"
                value={condition.temperature}
                onChange={handleConditionChange}
                placeholder="98.6°F"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Weight</label>
              <input
                type="text"
                name="weight"
                value={condition.weight}
                onChange={handleConditionChange}
                placeholder="65 kg"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1.5">Symptoms</label>
            <textarea
              name="symptoms"
              value={condition.symptoms}
              onChange={handleConditionChange}
              rows="2"
              placeholder="What the patient is experiencing..."
              className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Diagnosis <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="diagnosis"
              value={condition.diagnosis}
              onChange={handleConditionChange}
              required
              placeholder="e.g. Migraine, Type 2 Diabetes"
              className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>
        </div>

        {/* STEP 2: Medicines */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display text-lg text-ink">2. Prescribe medicines</h2>
            <button
              type="button"
              onClick={addMedicine}
              className="text-xs font-medium text-primary hover:underline"
            >
              + Add medicine
            </button>
          </div>
          <p className="text-sm text-body mb-5">Based on the diagnosis above.</p>

          <div className="space-y-4">
            {medicines.map((med, index) => (
              <div key={index} className="border border-border rounded-lg p-4 relative">
                {medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicine(index)}
                    className="absolute top-3 right-3 text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Medicine name</label>
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      placeholder="Paracetamol"
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Dosage</label>
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      placeholder="500mg"
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Frequency</label>
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                      placeholder="Twice a day"
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Duration</label>
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      placeholder="5 days"
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 3: Notes */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="font-display text-lg text-ink mb-1">3. Additional notes</h2>
          <p className="text-sm text-body mb-4">Optional — follow-up advice, precautions, etc.</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            placeholder="e.g. Follow up in 2 weeks. Avoid caffeine."
            className="w-full px-4 py-2.5 border border-border rounded-lg text-ink placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save prescription'}
        </button>
      </form>
    </DashboardLayout>
  )
}

export default WritePrescription