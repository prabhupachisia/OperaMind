import {
  Activity,
  Bot,
  FileClock,
  FileSearch,
  GitBranch,
  Home,
  Menu,
  Settings,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/graph', label: 'Graph', icon: GitBranch },
  { path: '/upload', label: 'Upload', icon: Upload },
  { path: '/chat', label: 'Copilot', icon: Bot },
  { path: '/compliance', label: 'Compliance', icon: ShieldCheck },
  { path: '/incidents', label: 'Incidents', icon: Activity },
  { path: '/history', label: 'History', icon: FileClock },
]

function Navigation({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-end">
      {navigation.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`
            }
          >
            <Icon size={17} strokeWidth={2} />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white">
              <FileSearch size={20} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-semibold tracking-tight">OperaMind</span>
              <span className="block truncate text-xs font-medium uppercase text-slate-500">Industrial intelligence</span>
            </span>
          </NavLink>

          <div className="hidden flex-1 justify-end lg:flex">
            <Navigation />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-[min(88vw,360px)] border-l border-slate-200 bg-white p-4 shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <p className="text-sm font-semibold">OperaMind</p>
                <p className="text-xs uppercase text-slate-500">Operations console</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700"
              >
                <X size={19} />
              </button>
            </div>
            <div className="mt-4">
              <Navigation onNavigate={() => setMobileOpen(false)} />
            </div>
          </aside>
        </div>
      ) : null}

      <main className="mx-auto min-h-[calc(100vh-145px)] max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-800 bg-black text-slate-300">
  <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      
      <div>
        <h3 className="text-xl font-semibold text-white">
          OperaMind
        </h3>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          AI-Powered Industrial Knowledge Intelligence Platform that transforms
          engineering documents, maintenance records, inspection reports,
          operating procedures, and compliance standards into a unified,
          searchable, and actionable knowledge ecosystem.
        </p>
      </div>

      <div className="flex flex-col items-start gap-2 text-sm lg:items-end">
        <span className="text-slate-500">
          Unified Asset & Operations Brain
        </span>

        <a
          href="https://github.com/prabhupachisia/OperaMind"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-400 transition hover:text-blue-300"
        >
          View Project Repository →
        </a>
      </div>
    </div>

    <div className="mt-6 border-t border-slate-800 pt-4 text-center text-xs text-slate-500">
      © {new Date().getFullYear()} OperaMind. Built for Industrial Knowledge
      Intelligence, Asset Management, Compliance Monitoring, and Operational
      Excellence.
    </div>
  </div>
</footer>
    </div>
  )
}
