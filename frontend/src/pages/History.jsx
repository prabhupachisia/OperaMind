import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchHistory } from '../services/api'

export default function History() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetchHistory()
        setDocuments(response.documents || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  return (
    <div className="grid gap-8">
      <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">History</p>
          <h2 className="text-3xl font-semibold text-white">Saved graphs and document ingestion history</h2>
          <p className="text-slate-400 leading-7">
            Review uploaded files, extracted knowledge graphs, and asset intelligence snapshots over time.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-8 shadow-xl shadow-slate-950/10 text-slate-400">
          Loading history...
        </div>
      ) : error ? (
        <div className="rounded-4xl border border-white/10 bg-rose-500/10 p-8 shadow-xl shadow-slate-950/10 text-rose-200">
          {error}
        </div>
      ) : documents.length === 0 ? (
        <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-8 shadow-xl shadow-slate-950/10 text-slate-400">
          No ingested documents found yet. Upload a document to start building your knowledge base.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {documents.map((doc) => (
            <div key={doc.document_id} className="rounded-4xl border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">{doc.document_type || 'Document'}</p>
                  <h3 className="mt-4 text-xl font-semibold text-white">{doc.original_filename || doc.filename}</h3>
                  <p className="mt-3 text-slate-400">Uploaded: {new Date(doc.uploaded_at).toLocaleString()}</p>
                </div>
                <Link
                  to={`/graph?document_id=${encodeURIComponent(doc.document_id)}`}
                  className="rounded-3xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                >
                  View graph
                </Link>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-900/80 p-3 text-sm text-slate-200">
                  <p className="font-semibold">Chunks</p>
                  <p className="mt-2 text-cyan-300">{doc.chunk_count}</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-3 text-sm text-slate-200">
                  <p className="font-semibold">Graph nodes</p>
                  <p className="mt-2 text-sky-300">{doc.graph_nodes}</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-3 text-sm text-slate-200">
                  <p className="font-semibold">Graph edges</p>
                  <p className="mt-2 text-cyan-300">{doc.graph_edges}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
