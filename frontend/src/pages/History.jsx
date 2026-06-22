export default function History() {
  return (
    <div className="grid gap-8">
      <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">History</p>
          <h2 className="text-3xl font-semibold text-white">Saved graphs, uploads and AI sessions</h2>
          <p className="text-slate-400 leading-7">
            Review document ingestion history, knowledge graph snapshots, and past copilot conversations in one place.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/10">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Recent uploads</p>
          <ul className="mt-4 space-y-3 text-slate-400">
            <li>• Pump P101 failure report</li>
            <li>• Unit A safety procedure</li>
            <li>• Inspection log Q2</li>
          </ul>
        </div>
        <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/10">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Saved graphs</p>
          <ul className="mt-4 space-y-3 text-slate-400">
            <li>• Pump asset relationship graph</li>
            <li>• Compliance trace graph</li>
            <li>• Maintenance RCA graph</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
