import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { path: '/', label: 'Home' },
  { path: '/graph', label: 'Knowledge Graph' },
  { path: '/upload', label: 'Upload Docs' },
  { path: '/chat', label: 'Expert Copilot' },
  { path: '/compliance', label: 'Compliance' },
  { path: '/incidents', label: 'Incidents' },
  { path: '/history', label: 'History' },
  { path: '/settings', label: 'Settings' },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="rounded-4xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.42em] text-cyan-300/70">OperaMind</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Industrial Knowledge Intelligence</h2>
            </div>
            <p className="text-sm leading-6 text-slate-400">
              A unified AI platform for industrial documents, asset graphs, and operations intelligence.
            </p>
          </div>

          <nav className="mt-10 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `block rounded-3xl border border-white/10 px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-cyan-500/10 text-cyan-300 shadow-sm shadow-cyan-500/10' : 'text-slate-300 hover:border-cyan-400/20 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-10 rounded-3xl border border-cyan-500/10 bg-cyan-500/5 p-4 text-sm text-cyan-100">
            <p className="font-semibold text-cyan-200">Vision</p>
            <p className="mt-2 text-slate-300">Turn fragmented plant knowledge into a searchable, explainable, actionable industrial brain.</p>
          </div>
        </aside>

        <main className="space-y-6">
          <div className="rounded-4xl border border-white/10 bg-slate-950/85 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Unified Operations Brain</p>
                <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Industrial intelligence across documents, graphs and conversations.</h1>
              </div>
              <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                Use the sidebar to navigate through ingestion, graph exploration, and AI copilot workflows.
              </div>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  )
}
