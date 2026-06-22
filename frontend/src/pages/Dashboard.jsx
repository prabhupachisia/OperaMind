import { AlertCircle, Database, FileText, GitBranch, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import GraphControls from '../components/GraphControls'
import GraphPanel from '../components/GraphPanel'
import { extractGraph, fetchGraph, fetchHistory } from '../services/api'

const DEFAULT_TEXT = import.meta.env.VITE_DEFAULT_DOCUMENT || ''

const DETAIL_GROUPS = [
  ['Incidents', 'connected_incidents'],
  ['Work orders', 'connected_work_orders'],
  ['Compliance', 'compliance'],
  ['OEM', 'oem'],
  ['Procedures', 'procedures'],
  ['Inspections', 'inspections'],
  ['Locations', 'locations'],
]

export default function Dashboard() {
  const [documentText, setDocumentText] = useState(DEFAULT_TEXT)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [documents, setDocuments] = useState([])
  const [selectedDocumentId, setSelectedDocumentId] = useState('')
  const [nodeDetails, setNodeDetails] = useState({})
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('Ready')
  const [error, setError] = useState(null)

  const [searchParams] = useSearchParams()

  const selectedNode = selectedNodeId ? nodeDetails[selectedNodeId] : null
  const selectedDocument = documents.find((doc) => String(doc.document_id) === String(selectedDocumentId))

  const metrics = useMemo(
    () => [
      ['Nodes', nodes.length, GitBranch],
      ['Edges', edges.length, Database],
      ['Saved documents', documents.length, FileText],
    ],
    [nodes.length, edges.length, documents.length],
  )

  const loadGraph = useCallback(async (documentId) => {
    setLoading(true)
    setError(null)
    setStatus(documentId ? 'Loading saved graph' : 'Generating graph')

    try {
      const data = documentId ? await fetchGraph(documentId) : await extractGraph(documentText)
      setNodes(data.nodes || [])
      setEdges(data.edges || [])
      setNodeDetails(data.node_details || {})
      setSelectedNodeId(null)
      setSelectedDocumentId(documentId || '')
      setStatus(documentId ? 'Saved graph loaded' : 'Generated from document text')
    } catch (err) {
      setError(err.message)
      setNodes([])
      setEdges([])
      setNodeDetails({})
      setSelectedNodeId(null)
      setStatus('Graph unavailable')
    } finally {
      setLoading(false)
    }
  }, [documentText])

  useEffect(() => {
    const selectedId = searchParams.get('document_id')
    let active = true

    const loadHistory = async () => {
      try {
        const history = await fetchHistory()
        if (active) {
          setDocuments(history.documents || [])
        }
      } catch {
        if (active) {
          setDocuments([])
        }
      }
    }

    loadHistory()

    if (selectedId) {
      loadGraph(selectedId)
    }

    return () => {
      active = false
    }
  }, [loadGraph, searchParams])

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Knowledge graph</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Industrial entity graph workspace
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Generate or load persisted graphs and inspect operational relationships across equipment, incidents, work orders, procedures, compliance, and locations.
          </p>
        </div>
        <div className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />}
          {status}
        </div>
      </section>

      {error ? (
        <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        {metrics.map(([label, value, Icon]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <Icon size={18} className="text-slate-500" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <GraphPanel nodes={nodes} edges={edges} onNodeSelect={setSelectedNodeId} />

        <div className="grid content-start gap-5">
          <GraphControls
            documentText={documentText}
            onTextChange={setDocumentText}
            onExtract={() => loadGraph()}
            loading={loading}
          />

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Saved graphs</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">Load from history</h2>
            <div className="mt-4 max-h-[280px] space-y-2 overflow-auto pr-1">
              {documents.length === 0 ? (
                <p className="text-sm leading-6 text-slate-500">No ingested documents found.</p>
              ) : (
                documents.map((doc) => (
                  <button
                    key={doc.document_id}
                    type="button"
                    onClick={() => loadGraph(doc.document_id)}
                    className={`block w-full rounded-md border px-3 py-3 text-left transition ${
                      String(selectedDocumentId) === String(doc.document_id)
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block truncate text-sm font-semibold">{doc.original_filename || doc.filename}</span>
                    <span className="mt-1 block text-xs opacity-70">{doc.document_type || 'Document'}</span>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selection</p>
            {selectedDocument ? (
              <p className="mt-2 text-sm text-slate-600">Document: <span className="font-semibold text-slate-950">{selectedDocument.original_filename || selectedDocument.filename}</span></p>
            ) : null}
            {selectedNode ? (
              <div className="mt-4 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">{selectedNode.label}</h2>
                  <p className="text-sm text-slate-500">{selectedNode.type} · {selectedNode.relationships?.length || 0} relationships</p>
                </div>
                {DETAIL_GROUPS.map(([label, key]) => (
                  <div key={key}>
                    <p className="text-sm font-semibold text-slate-950">{label}</p>
                    {selectedNode[key]?.length ? (
                      <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        {selectedNode[key].map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm text-slate-400">None found</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-slate-500">Click a node in the graph to inspect connected operational intelligence.</p>
            )}
          </section>
        </div>
      </section>
    </div>
  )
}
