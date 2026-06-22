export default function Upload() {
  return (
    <div className="grid gap-8">
      <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Document ingestion</p>
          <h2 className="text-3xl font-semibold text-white">Upload and classify heterogeneous industrial documents</h2>
          <p className="text-slate-400 leading-7">
            Ingest PDFs, reports, drawings, inspection logs and work orders into a unified knowledge pipeline. The system automatically extracts tags, equipment references, dates, and regulatory context.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/10">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Upload workflow</p>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-400">
            <li>Choose documents from plant repositories or local files.</li>
            <li>Assign document type and asset metadata.</li>
            <li>Let the ingestion pipeline parse and normalize the content.</li>
          </ol>
        </div>
        <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/10">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Supported content</p>
          <ul className="mt-4 space-y-3 text-slate-400">
            <li>• Engineering drawings (PDF, scanned image)</li>
            <li>• Maintenance logs and inspection reports</li>
            <li>• Operating procedures and safety manuals</li>
            <li>• Spreadsheets, email extracts, and project files</li>
          </ul>
        </div>
      </div>

      <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-8 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-white">Document ingestion status</p>
            <p className="text-slate-400">Future integration point for upload progress, status, and smart metadata extraction.</p>
          </div>
          <button className="inline-flex items-center justify-center rounded-3xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            Upload documents
          </button>
        </div>
      </div>
    </div>
  )
}
