import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-10 shadow-2xl shadow-slate-950/20 text-center">
      <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Page not found</p>
      <h2 className="mt-4 text-4xl font-semibold text-white">404 — Route missing</h2>
      <p className="mt-4 text-slate-400">The page you were looking for doesn’t exist yet. Use the sidebar to continue exploring the platform.</p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-3xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        Back to home
      </Link>
    </div>
  )
}
