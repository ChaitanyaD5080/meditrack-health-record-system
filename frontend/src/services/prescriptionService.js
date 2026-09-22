import api from './api'

export const createPrescription = (data) => api.post('/prescriptions', data)
export const getPrescriptions = () => api.get('/prescriptions')
export const getPatientPrescriptions = (patientId) => api.get(`/prescriptions/patient/${patientId}`)