import api from './api'

export const getDoctors = (params = {}) => api.get('/doctors', { params })
export const getDoctorById = (id) => api.get(`/doctors/${id}`)
export const getMyDoctorProfile = () => api.get('/doctors/me')
export const updateMyDoctorProfile = (data) => api.put('/doctors/me', data)