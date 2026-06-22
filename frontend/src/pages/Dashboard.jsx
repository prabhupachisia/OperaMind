import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { extractGraph, fetchGraph, fetchHistory } from '../services/api'
import GraphControls from '../components/GraphControls'
import GraphPanel from '../components/GraphPanel'
import Header from '../components/Header'
import MetricCard from '../components/MetricCard'

const API_URL = import.meta.env.VITE_API_URL
const GRAPH_PATH = import.meta.env.VITE_GRAPH_PATH
const DEFAULT_TEXT = import.meta.env.VITE_DEFAULT_DOCUMENT

export default function Dashboard() {
  const [documentText, setDocumentText] = useState(DEFAULT_TEXT)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [documents, setDocuments] = useState([])
  const [selectedDocumentId, setSelectedDocumentId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('Ready to generate your industrial knowledge graph.')

  const [searchParams] = useSearchParams()
  const endpoint = `${API_URL}${GRAPH_PATH}`

  const summary = useMemo(
    () => ({
      nodeCount: nodes.length,
      edgeCount: edges.length,
      status,
    }),
    [nodes.length, edges.length, status],
  )

  const loadGraph = useCallback(async (documentId) => {
    setLoading(true)
    setStatus('Loading saved graph...')

    try {
      const data = documentId ? await fetchGraph(documentId) : await extractGraph(documentText)
      setNodes(data.nodes || [])
      setEdges(data.edges || [])
      setSelectedDocumentId(documentId || null)
      setStatus(documentId ? 'Loaded saved graph from ingestion history.' : 'Graph successfully generated. Review the connected entities below.')
    } catch (error) {
      setStatus(`Graph load failed: ${error.message}`)
      setNodes([])
      setEdges([])
    } finally {
      setLoading(false)
    }
  }, [documentText])

  const extractGraphHandler = async () => {
    await loadGraph()
  }

  const handleSelectDocument = useCallback(async (documentId) => {
    await loadGraph(documentId)
  }, [loadGraph])

  useEffect(() => {
    const selectedId = searchParams.get('document_id')
    let active = true

    if (selectedId) {
      const loadSelectedGraph = async () => {
        await Promise.resolve()

        if (active) {
          await handleSelectDocument(selectedId)
        }
      }

      loadSelectedGraph()
    }

    const loadHistory = async () => {
      try {
        const history = await fetchHistory()
        setDocuments(history.documents || [])
      } catch {
        setDocuments([])
      }
    }

    loadHistory()
    return () => {
      active = false
    }
  }, [handleSelectDocument, searchParams])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_30%),#020617] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-8 sm:px-10">
        <Header />

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl"
          >
            <div className="grid gap-6">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">Industrial knowledge intelligence</p>
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Build the unified asset & operations brain.</h1>
                <p className="max-w-3xl text-slate-400 sm:text-lg">
                  Paste extracted document text, generate the knowledge graph, and preview entities with relationships in a modern industrial AI dashboard.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <MetricCard title="Detected nodes" value={summary.nodeCount} subtitle="Entities extracted from the document." accent="text-cyan-300" />
                <MetricCard title="Detected edges" value={summary.edgeCount} subtitle="Relationships discovered by the model." accent="text-sky-300" />
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-slate-300 shadow-xl shadow-slate-950/10">
                <div className="flex items-center gap-3 text-cyan-300">
                  <ArrowUpRight />
                  <span className="text-sm uppercase tracking-[0.35em]">Backend connection</span>
                </div>
                <p className="mt-4 text-sm leading-7">
                  This app connects to <span className="font-semibold text-white">{endpoint}</span>. Ensure your Flask backend is running and the POST route is available before generating graphs.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GraphControls
              documentText={documentText}
              onTextChange={setDocumentText}
              onExtract={extractGraphHandler}
              loading={loading}
            />
          </motion.div>
        </section>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${nodes.length}-${edges.length}-${selectedDocumentId}`}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]"
          >
            <GraphPanel nodes={nodes} edges={edges} />

            <div className="space-y-5 rounded-4xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/10">
              <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Graph output</p>
                <p className="mt-4 text-2xl font-semibold text-white">
                  {selectedDocumentId ? 'Saved graph from history' : 'Visual JSON preview'}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-300">
                <p className="font-semibold text-white">Rendered graph is compatible with React Flow.</p>
                <ul className="mt-4 space-y-3 text-slate-400">
                  <li><strong>nodes</strong> are shown as graph vertices.</li>
                  <li><strong>edges</strong> are shown as directed relationships.</li>
                  <li>Each relation label is normalized for clean graph rendering.</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-300">
                <p className="font-semibold text-white">Saved document graphs</p>
                <p className="mt-2 text-slate-400">Select a previously ingested document to load its persisted knowledge graph.</p>
                <div className="mt-4 space-y-3">
                  {documents.length === 0 ? (
                    <p className="text-slate-500">No ingested documents found. Upload a document first.</p>
                  ) : (
                    documents.map((doc) => (
                      <button
                        key={doc.document_id}
                        type="button"
                        onClick={() => handleSelectDocument(doc.document_id)}
                        className={`block w-full rounded-3xl border px-4 py-3 text-left text-sm transition ${selectedDocumentId === String(doc.document_id) ? 'border-cyan-400 bg-cyan-400/10 text-white' : 'border-white/10 bg-slate-900/80 text-slate-200'} hover:border-cyan-300/50`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold">{doc.original_filename || doc.filename}</span>
                          <span className="text-xs uppercase tracking-[0.35em] text-slate-400">{doc.document_type || 'Document'}</span>
                        </div>
                        <p className="mt-2 text-slate-400 text-xs">Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
