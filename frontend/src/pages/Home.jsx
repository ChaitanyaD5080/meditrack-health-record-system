import { useNavigate } from 'react-router-dom'

function PulseDivider() {
  return (
    <svg viewBox="0 0 400 24" className="w-full h-6 text-primary/40" preserveAspectRatio="none">
      <polyline
        points="0,12 130,12 145,3 158,21 172,12 400,12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RecordCard() {
  return (
    <div className="relative">
      <div className="absolute -right-4 -top-4 w-full h-full rounded-2xl bg-primary/10 border border-primary/20 hidden sm:block" />
      <div className="relative bg-ink text-white rounded-2xl p-6 sm:p-7 w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-[11px] tracking-wider text-white/50">RECORD #PT-04821</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/30 text-white font-mono">ACTIVE</span>
        </div>
        <p className="font-display text-2xl mb-1">Aanya Verma</p>
        <p className="text-white/50 text-sm mb-6">28 yrs &middot; O+ &middot; Last visit 12 Aug</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="border border-white/10 rounded-lg p-3">
            <p className="text-white/40 text-[11px] font-mono mb-1">BP</p>
            <p className="text-sm font-medium">118/76</p>
          </div>
          <div className="border border-white/10 rounded-lg p-3">
            <p className="text-white/40 text-[11px] font-mono mb-1">HR</p>
            <p className="text-sm font-medium">72 bpm</p>
          </div>
          <div className="border border-white/10 rounded-lg p-3">
            <p className="text-white/40 text-[11px] font-mono mb-1">TEMP</p>
            <p className="text-sm font-medium">98.4°F</p>
          </div>
        </div>
        <div className="text-white/60">
          <PulseDivider />
        </div>
        <p className="text-xs text-white/40 mt-4 font-mono">Attending &middot; Dr. R. Sharma, Cardiology</p>
      </div>
    </div>
  )
}

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg font-sans">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <span className="font-display text-xl text-ink tracking-tight">
          Medi<span className="text-primary italic">Track</span>
        </span>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-medium text-ink hover:text-primary transition-colors">
            Log in
          </button>
          <button onClick={() => navigate('/register')} className="px-4 sm:px-5 py-2 text-sm font-medium bg-ink text-white rounded-full hover:bg-primary-dark transition-colors">
            Create account
          </button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-block font-mono text-xs tracking-[0.15em] text-primary uppercase mb-5 border border-primary/30 bg-primary/5 rounded-full px-3 py-1">
            Patient Health Records
          </span>
          <h1 className="font-display text-[2.6rem] sm:text-5xl leading-[1.08] text-ink mb-6">
            One chart, kept
            <br />
            in <span className="italic text-primary">good order.</span>
          </h1>
          <p className="text-body text-base sm:text-lg leading-relaxed max-w-md mb-9">
            MediTrack keeps every visit, prescription and report in one place — so patients, doctors and clinics are always reading from the same page.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={() => navigate('/register')} className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors shadow-sm">
              Get started free
            </button>
            <button onClick={() => navigate('/login')} className="px-6 py-3 border border-border text-ink rounded-full font-medium hover:border-primary hover:text-primary transition-colors">
              I already have an account
            </button>
          </div>
          <div className="flex items-center gap-6 mt-12 font-mono text-xs text-body/70">
            <span>No paperwork</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Role-based access</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Records, not folders</span>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <RecordCard />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="mb-10">
          <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase mb-2">Built for everyone in the room</p>
          <h2 className="font-display text-2xl sm:text-3xl text-ink">Three roles, one shared record.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors">
            <p className="font-display text-lg text-ink mb-2">Patients</p>
            <p className="text-sm text-body leading-relaxed">Book appointments, track prescriptions, and see every report without calling the front desk.</p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors">
            <p className="font-display text-lg text-ink mb-2">Doctors</p>
            <p className="text-sm text-body leading-relaxed">Open a patient's history in seconds and write prescriptions that land straight in their record.</p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors">
            <p className="font-display text-lg text-ink mb-2">Admins</p>
            <p className="text-sm text-body leading-relaxed">Manage doctors, patients and appointments from a single, uncluttered dashboard.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-ink">
            Medi<span className="text-primary italic">Track</span>
          </span>
          <p className="text-xs text-body/70 font-mono">&copy; 2026 MediTrack — built for learning, not production.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home