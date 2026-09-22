import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import NotFound from './pages/NotFound'
import DoctorProfile from './pages/doctor/Profile'

import RoleRoute from './routes/RoleRoute'

import PatientDashboard from './pages/patient/Dashboard'
import PatientProfile from './pages/patient/Profile'
import DoctorSearch from './pages/patient/DoctorSearch'
import BookAppointment from './pages/patient/BookAppointment'
import AppointmentList from './pages/patient/AppointmentList'
import MedicalRecords from './pages/patient/MedicalRecords'
import RecordDetail from './pages/patient/RecordDetail'

import DoctorDashboard from './pages/doctor/Dashboard'
import DoctorPatientList from './pages/doctor/PatientList'
import DoctorPatientDetail from './pages/doctor/PatientDetail'
import WritePrescription from './pages/doctor/WritePrescription'
import AppointmentSchedule from './pages/doctor/AppointmentSchedule'

import AdminDashboard from './pages/admin/Dashboard'
import ManageDoctors from './pages/admin/ManageDoctors'
import ManagePatients from './pages/admin/ManagePatients'
import ManageAppointments from './pages/admin/ManageAppointments'
import History from './pages/patient/History'
import Prescriptions from './pages/patient/Prescriptions'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/patient/dashboard" element={
        <RoleRoute allowedRoles={['patient']}><PatientDashboard /></RoleRoute>
      } />
      <Route path="/patient/profile" element={
        <RoleRoute allowedRoles={['patient']}><PatientProfile /></RoleRoute>
      } />
      <Route path="/patient/doctors" element={
        <RoleRoute allowedRoles={['patient']}><DoctorSearch /></RoleRoute>
      } />
      <Route path="/patient/book-appointment" element={
        <RoleRoute allowedRoles={['patient']}><BookAppointment /></RoleRoute>
      } />
      <Route path="/patient/appointments" element={
        <RoleRoute allowedRoles={['patient']}><AppointmentList /></RoleRoute>
      } />
      <Route path="/patient/records" element={
        <RoleRoute allowedRoles={['patient']}><MedicalRecords /></RoleRoute>
      } />
      <Route path="/patient/records/:id" element={
        <RoleRoute allowedRoles={['patient']}><RecordDetail /></RoleRoute>
      } />
      <Route path="/patient/history" element={
  <RoleRoute allowedRoles={['patient']}><History /></RoleRoute>
} />
<Route path="/patient/prescriptions" element={
  <RoleRoute allowedRoles={['patient']}><Prescriptions /></RoleRoute>
} />

      <Route path="/doctor/dashboard" element={
        <RoleRoute allowedRoles={['doctor']}><DoctorDashboard /></RoleRoute>
      } />
      <Route path="/doctor/patients" element={
        <RoleRoute allowedRoles={['doctor']}><DoctorPatientList /></RoleRoute>
      } />
      <Route path="/doctor/patients/:id" element={
        <RoleRoute allowedRoles={['doctor']}><DoctorPatientDetail /></RoleRoute>
      } />
      <Route path="/doctor/prescribe/:patientId" element={
        <RoleRoute allowedRoles={['doctor']}><WritePrescription /></RoleRoute>
      } />
      <Route path="/doctor/schedule" element={
        <RoleRoute allowedRoles={['doctor']}><AppointmentSchedule /></RoleRoute>
      } />
      <Route path="/doctor/profile" element={
        <RoleRoute allowedRoles={['doctor']}><DoctorProfile /></RoleRoute>
      } />
      <Route path="/doctor/prescribe/:patientId" element={
  <RoleRoute allowedRoles={['doctor']}><WritePrescription /></RoleRoute>
} />

      <Route path="/admin/dashboard" element={
        <RoleRoute allowedRoles={['admin']}><AdminDashboard /></RoleRoute>
      } />
      <Route path="/admin/doctors" element={
        <RoleRoute allowedRoles={['admin']}><ManageDoctors /></RoleRoute>
      } />
      <Route path="/admin/patients" element={
        <RoleRoute allowedRoles={['admin']}><ManagePatients /></RoleRoute>
      } />
      <Route path="/admin/appointments" element={
        <RoleRoute allowedRoles={['admin']}><ManageAppointments /></RoleRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App