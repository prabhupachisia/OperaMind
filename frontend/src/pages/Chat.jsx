export default function Chat() {
  return (
    <div className="grid gap-8">
      <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Expert Copilot</p>
          <h2 className="text-3xl font-semibold text-white">Ask operational questions across your knowledge corpus</h2>
          <p className="text-slate-400 leading-7">
            Use AI-guided conversation to get answers from maintenance records, procedures, compliance documents and equipment history with source citations.
          </p>
        </div>
      </div>

      <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/10">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Conversation</p>
        <div className="mt-6 space-y-4 border-t border-white/5 pt-6 text-slate-300">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
            <p className="text-sm font-medium text-cyan-300">You</p>
            <p className="mt-2 text-slate-200">What caused the P101 pump failure and what corrective actions were recorded?</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
            <p className="text-sm font-medium text-emerald-300">Copilot</p>
            <p className="mt-2 text-slate-200">Pump P101 failure was linked to seal wear. The last corrective action was seal replacement and a vibration monitoring procedure update.</p>
          </div>
        </div>
      </div>

      <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-8 shadow-2xl shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Quick prompts</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            'Show recent maintenance anomalies',
            'Find documents mentioning P101',
            'List compliance gaps in safety procedures',
            'Summarize the latest inspection report',
          ].map((prompt) => (
            <button key={prompt} className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-slate-900">
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
