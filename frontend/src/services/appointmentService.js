import api from './api'

export const bookAppointment = (data) => api.post('/appointments', data)
export const getAppointments = () => api.get('/appointments')
