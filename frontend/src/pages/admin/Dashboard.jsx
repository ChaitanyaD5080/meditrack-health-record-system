import DashboardLayout from '../../components/common/DashboardLayout'
import { useAuth } from '../../hooks/useAuth'

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-6">
      <p className="text-xs font-mono text-body uppercase tracking-wide mb-3">{label}</p>
      <p className="font-display text-3xl text-ink mb-1">{value}</p>
      <p className="text-sm text-body">{sub}</p>
    </div>
  )
}

function AdminDashboard() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">
        Admin Dashboard
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">Welcome, {user?.name}</h1>
      <p className="text-body mb-8">Platform overview and management.</p>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <StatCard label="Total" value="0" sub="Patients" />
        <StatCard label="Total" value="0" sub="Doctors" />
        <StatCard label="Total" value="0" sub="Appointments" />
      </div>

      <div className="bg-white border border-border rounded-2xl p-6">
        <h2 className="font-display text-lg text-ink mb-4">Quick actions</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <button className="text-left px-4 py-3 border border-border rounded-lg hover:border-primary/40 transition-colors">
            <p className="text-sm font-medium text-ink">Manage doctors</p>
            <p className="text-xs text-body mt-0.5">Add or remove accounts</p>
          </button>
          <button className="text-left px-4 py-3 border border-border rounded-lg hover:border-primary/40 transition-colors">
            <p className="text-sm font-medium text-ink">Manage patients</p>
            <p className="text-xs text-body mt-0.5">View all accounts</p>
          </button>
          <button className="text-left px-4 py-3 border border-border rounded-lg hover:border-primary/40 transition-colors">
            <p className="text-sm font-medium text-ink">Appointments</p>
            <p className="text-xs text-body mt-0.5">Platform-wide view</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard