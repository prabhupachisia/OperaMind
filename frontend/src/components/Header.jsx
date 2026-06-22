import { Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-950/80 px-6 py-5 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">OperaMind</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Unified Operations Brain</h1>
      </div>
      <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-300 transition hover:bg-cyan-400/10 focus:outline-none focus:ring-2 focus:ring-cyan-300/40">
        <Menu size={20} />
      </button>
    </header>
  )
}
