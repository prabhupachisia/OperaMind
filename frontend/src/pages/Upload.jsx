import { CheckCircle2, FileUp, GitBranch, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { uploadDocument } from '../services/api'

const documentTypes = ['engineering', 'inspection', 'maintenance', 'procedure', 'incident', 'compliance', 'operations']

export default function Upload() {
  const [file, setFile] = useState(null)
  const [documentType, setDocumentType] = useState('engineering')
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
    setResult(null)

    try {
      const response = await uploadDocument(file, documentType)
      setResult(response)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Document ingestion</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Upload industrial records into the knowledge pipeline</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Send files to the backend for text extraction, OCR fallback, chunking, graph generation, and retrieval indexing.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700">
              <FileUp size={20} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-950">Upload details</h2>
              <p className="text-sm text-slate-500">PDF, image, text, CSV, and JSON files are accepted.</p>
            </div>
          </div>

          <label className="mt-5 block text-sm font-semibold text-slate-950">
            File
            <input
              type="file"
              accept=".pdf,.txt,.csv,.json,.png,.jpg,.jpeg,.tif,.tiff,.bmp"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
            />
          </label>

          <label className="mt-5 block text-sm font-semibold text-slate-950">
            Document type
            <select
              value={documentType}
              onChange={(event) => setDocumentType(event.target.value)}
              className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
            >
              {documentTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UploadCloud size={18} />
            {loading ? 'Processing document' : 'Upload and ingest'}
          </button>

          {error ? <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}
        </form>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={20} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-950">Ingestion result</h2>
              <p className="text-sm text-slate-500">{result ? 'Document processed by the backend.' : 'Result details appear after upload.'}</p>
            </div>
          </div>

          {result ? (
            <div className="mt-5">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{result.original_filename}</p>
                <p className="mt-1 text-sm text-slate-500">{result.document_type}</p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  ['Chunks', result.chunk_count],
                  ['Nodes', result.graph_nodes],
                  ['Edges', result.graph_edges],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-slate-200 p-3">
                    <p className="text-xl font-semibold text-slate-950">{value || 0}</p>
                    <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
              {result.graph_error ? <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{result.graph_error}</p> : null}
              {result.document_id ? (
                <Link to={`/graph?document_id=${encodeURIComponent(result.document_id)}`} className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                  <GitBranch size={17} />
                  Open generated graph
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="mt-5 rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              Upload a document to see chunk counts, graph entities, graph relationships, and processing warnings.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
