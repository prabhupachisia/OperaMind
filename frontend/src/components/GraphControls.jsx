export default function GraphControls({ documentText, onTextChange, onExtract, loading }) {
  return (
    <div className="grid gap-5 rounded-4xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/10">
      <div>
        <label className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Document Text</label>
        <textarea
          value={documentText}
          onChange={(event) => onTextChange(event.target.value)}
          rows={8}
          className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4 text-sm text-slate-200 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
        />
      </div>
      <button
        onClick={onExtract}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-3xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Extracting Graph...' : 'Generate Knowledge Graph'}
      </button>
    </div>
  )
}
