import { Activity, ArrowRight, Bot, FileText, GitBranch, ShieldCheck, Upload } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchHistory } from '../services/api'

const workstreams = [
  {
    title: 'Ingest records',
    description: 'Upload PDFs and operational files into the extraction, chunking, OCR, and graph pipeline.',
    path: '/upload',
    icon: Upload,
  },
  {
    title: 'Explore graph',
    description: 'Inspect equipment, incidents, procedures, OEMs, locations, and operational relationships.',
    path: '/graph',
    icon: GitBranch,
  },
  {
    title: 'Ask copilot',
    description: 'Query the knowledge base using source-backed retrieval across uploaded documents.',
    path: '/chat',
    icon: Bot,
  },
  {
    title: 'Audit readiness',
    description: 'Review compliance evidence, missing procedures, inspection gaps, and supporting snippets.',
    path: '/compliance',
    icon: ShieldCheck,
  },
]

export default function Home() {
  const [documents, setDocuments] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const history = await fetchHistory()
        setDocuments(history.documents || [])
      } catch (err) {
        setError(err.message)
      }
    }

    load()
  }, [])

  const metrics = useMemo(
    () => ({
      documents: documents.length,
      chunks: documents.reduce((sum, doc) => sum + Number(doc.chunk_count || 0), 0),
      nodes: documents.reduce((sum, doc) => sum + Number(doc.graph_nodes || 0), 0),
      edges: documents.reduce((sum, doc) => sum + Number(doc.graph_edges || 0), 0),
    }),
    [documents],
  )

  const latest = documents.slice(0, 4)

  return (
    <div className="grid gap-6">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Operations command center</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Industrial knowledge, graph intelligence, and document retrieval in one console.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
            OperaMind converts maintenance records, inspections, procedures, incidents, and compliance evidence into an operational knowledge base your teams can search, inspect, and act on.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/upload" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Start ingestion
              <ArrowRight size={17} />
            </Link>
            <Link to="/graph" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
              Open graph
              <GitBranch size={17} />
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Current corpus</p>
              <h2 className="mt-2 text-2xl font-semibold">Knowledge base status</h2>
            </div>
            <Activity className="text-emerald-300" size={26} />
          </div>
          {error ? <p className="mt-5 rounded-md border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">{error}</p> : null}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              ['Documents', metrics.documents],
              ['Chunks', metrics.chunks],
              ['Graph nodes', metrics.nodes],
              ['Graph edges', metrics.edges],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold">{value}</p>
                <p className="mt-1 text-xs font-medium uppercase text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {workstreams.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.title} to={item.path} className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700 group-hover:bg-slate-950 group-hover:text-white">
                <Icon size={20} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </Link>
          )
        })}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recent ingestion</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">Latest uploaded records</h2>
          </div>
          <Link to="/history" className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50">
            View history
            <ArrowRight size={16} />
          </Link>
        </div>
        {latest.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No uploaded documents yet. Use ingestion to build the knowledge base.</div>
        ) : (
          <div className="divide-y divide-slate-200">
            {latest.map((doc) => (
              <div key={doc.document_id} className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-950">{doc.original_filename || doc.filename}</p>
                  <p className="mt-1 text-sm text-slate-500">{doc.document_type || 'Document'} · {new Date(doc.uploaded_at).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase text-slate-600">
                  <span className="rounded-md bg-slate-100 px-2.5 py-1">{doc.chunk_count || 0} chunks</span>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1">{doc.graph_nodes || 0} nodes</span>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1">{doc.graph_edges || 0} edges</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
