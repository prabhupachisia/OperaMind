import { CalendarClock, GitBranch } from 'lucide-react'
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
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">History</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Ingested documents and saved graphs</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">Review uploaded files, generated graph counts, and direct graph workspace links.</p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading history...</div>
        ) : error ? (
          <div className="m-5 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>
        ) : documents.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No ingested documents found yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Document</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Uploaded</th>
                  <th className="px-5 py-3">Chunks</th>
                  <th className="px-5 py-3">Graph</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {documents.map((doc) => (
                  <tr key={doc.document_id} className="hover:bg-slate-50">
                    <td className="max-w-[360px] px-5 py-4">
                      <p className="truncate font-semibold text-slate-950">{doc.original_filename || doc.filename}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{doc.document_type || 'Document'}</td>
                    <td className="px-5 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <CalendarClock size={15} />
                        {new Date(doc.uploaded_at).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-950">{doc.chunk_count || 0}</td>
                    <td className="px-5 py-4 text-slate-600">{doc.graph_nodes || 0} nodes · {doc.graph_edges || 0} edges</td>
                    <td className="px-5 py-4">
                      <Link to={`/graph?document_id=${encodeURIComponent(doc.document_id)}`} className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-950 px-3 text-xs font-semibold text-white hover:bg-slate-800">
                        <GitBranch size={15} />
                        View graph
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
