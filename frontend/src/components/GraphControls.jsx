import { Network, RefreshCw } from 'lucide-react'

export default function GraphControls({ documentText, onTextChange, onExtract, loading }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Graph input</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">Generate from document text</h2>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700">
          <Network size={20} />
        </span>
      </div>
      <textarea
        value={documentText || ''}
        onChange={(event) => onTextChange(event.target.value)}
        rows={9}
        placeholder="Paste extracted industrial document text here..."
        className="mt-4 block w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
      />
      <button
        type="button"
        onClick={onExtract}
        disabled={loading || !documentText?.trim()}
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
        {loading ? 'Generating graph' : 'Generate knowledge graph'}
      </button>
    </section>
  )
}
