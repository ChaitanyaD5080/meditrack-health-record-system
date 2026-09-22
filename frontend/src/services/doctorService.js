import api from './api'

export const getDoctors = () => api.get('/doctors')
export const getDoctorById = (id) => api.get(`/doctors/${id}`)
export const getMyDoctorProfile = () => api.get('/doctors/me')
export const updateMyDoctorProfile = (data) => api.put('/doctors/me', data)
