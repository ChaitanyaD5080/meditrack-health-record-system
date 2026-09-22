import api from './api'

export const getUsersByRole = (role) => api.get(`/admin/users?role=${role}`)
export const deleteUser = (id) => api.delete(`/admin/users/${id}`)
export const getStats = () => api.get('/admin/stats')