import api from './api'

export const getPatientProfile = () => api.get('/patients/me')
export const updatePatientProfile = (data) => api.put('/patients/me', data)
export const getPatientProfileById = (id) => api.get(`/patients/${id}`)