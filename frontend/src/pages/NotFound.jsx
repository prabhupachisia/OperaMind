import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Page not found</h1>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">The requested route is not available in the OperaMind console.</p>
      <Link to="/" className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800">
        <ArrowLeft size={17} />
        Back to home
      </Link>
    </section>
  )
}
