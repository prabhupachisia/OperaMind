export default function MetricCard({ title, value, subtitle, accent }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/20 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
      <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">{title}</p>
      <p className={`mt-4 text-3xl font-semibold ${accent}`}>{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{subtitle}</p>
    </div>
  )
}
