import api from './api'

export const getRecords = () => api.get('/records')

export const uploadRecord = (formData) =>
  api.post('/records', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const getPatientRecords = (patientId) => api.get(`/records/patient/${patientId}`)

export const deleteRecord = (id) => api.delete(`/records/${id}`)