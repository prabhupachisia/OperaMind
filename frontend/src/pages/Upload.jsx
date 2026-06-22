import { useState } from 'react'
import { uploadDocument } from '../services/api'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [documentType, setDocumentType] = useState('engineering')
  const [status, setStatus] = useState('Ready to ingest industrial documents.')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!file) {
      setError('Please select a file before uploading.')
      return
    }

    setLoading(true)
    setError(null)
    setStatus('Uploading and processing document...')

    try {
      const response = await uploadDocument(file, documentType)
      setResult(response)
      setStatus('Document ingested successfully. Graph and embeddings saved.')
    } catch (err) {
      setError(err.message)
      setStatus('Upload failed. Please try again.')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8">
      <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Document ingestion</p>
          <h2 className="text-3xl font-semibold text-white">Upload and classify heterogeneous industrial documents</h2>
          <p className="text-slate-400 leading-7">
            Ingest PDFs, reports, drawings, inspection logs and work orders into a unified knowledge pipeline. The system extracts asset facts, creates a knowledge graph, and stores embeddings for fast retrieval.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/10">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Upload details</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block text-sm font-medium text-slate-200">
              Select document
              <input
                type="file"
                accept=".pdf"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                className="mt-3 block w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
              />
            </label>

            <label className="block text-sm font-medium text-slate-200">
              Document type
              <input
                type="text"
                value={documentType}
                onChange={(event) => setDocumentType(event.target.value)}
                placeholder="e.g. inspection report"
                className="mt-3 block w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Ingesting document...' : 'Upload and ingest'}
            </button>
          </form>
        </div>

        <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/10">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Ingestion status</p>
          <p className="mt-4 text-slate-400">{status}</p>

          {error ? (
            <div className="mt-5 rounded-3xl bg-rose-500/10 border border-rose-400/15 p-4 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          {result ? (
            <div className="mt-5 space-y-3 rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-slate-200">
              <p className="text-sm font-semibold text-white">Upload summary</p>
              <p>File: {result.original_filename}</p>
              <p>Document type: {result.document_type}</p>
              <p>Chunks: {result.chunk_count}</p>
              <p>Graph nodes: {result.graph_nodes}</p>
              <p>Graph edges: {result.graph_edges}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
