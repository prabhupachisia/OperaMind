import { useEffect, useState } from 'react'
import { fetchCompliance, fetchHistory } from '../services/api'

export default function Compliance() {
  const [documents, setDocuments] = useState([])
  const [selectedDocumentId, setSelectedDocumentId] = useState('')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadReport = async (documentId = '') => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchCompliance(documentId || undefined)
      setReport(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const history = await fetchHistory()
        setDocuments(history.documents || [])
      } catch {
        setDocuments([])
      }

      await loadReport()
    }

    loadInitialData()
  }, [])

  const handleDocumentChange = async (event) => {
    const documentId = event.target.value
    setSelectedDocumentId(documentId)
    await loadReport(documentId)
  }

  return (
    <div className="grid gap-8">
      <section className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Compliance Intelligence</p>
        <h2 className="mt-4 text-3xl font-semibold text-white">Find missing procedures, inspection evidence, and audit gaps</h2>
        <p className="mt-4 max-w-3xl text-slate-400 leading-7">
          Analyze uploaded procedures and records against core compliance evidence categories, with source snippets for audit review.
        </p>
      </section>

      <section className="rounded-4xl border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/10">
        <label className="block text-sm font-medium text-slate-200">
          Scope
          <select
            value={selectedDocumentId}
            onChange={handleDocumentChange}
            className="mt-3 block w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
          >
            <option value="">All uploaded documents</option>
            {documents.map((doc) => (
              <option key={doc.document_id} value={doc.document_id}>
                {doc.original_filename || doc.filename}
              </option>
            ))}
          </select>
        </label>
      </section>

      {loading ? (
        <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-8 text-slate-400">Analyzing compliance evidence...</div>
      ) : error ? (
        <div className="rounded-4xl border border-white/10 bg-rose-500/10 p-8 text-rose-200">{error}</div>
      ) : report ? (
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Readiness score</p>
            <p className="mt-4 text-5xl font-semibold text-white">{Math.round(report.score * 100)}%</p>
            <div className="mt-6 space-y-3">
              {report.checks.map((check) => (
                <div key={check.id} className="rounded-3xl bg-slate-900/80 p-4 text-sm">
                  <p className={check.passed ? 'text-emerald-300' : 'text-rose-300'}>{check.passed ? 'Pass' : 'Gap'}</p>
                  <p className="mt-1 font-semibold text-white">{check.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Gaps</p>
              <div className="mt-4 space-y-3 text-slate-300">
                {report.gaps.length === 0 ? 'No compliance gaps detected in the selected scope.' : report.gaps.map((gap) => (
                  <p key={gap.id} className="rounded-3xl bg-slate-900/80 p-4">{gap.recommendation}</p>
                ))}
              </div>
            </div>

            <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Evidence references</p>
              <div className="mt-4 space-y-3">
                {report.evidence.length === 0 ? (
                  <p className="text-slate-400">No evidence snippets found yet.</p>
                ) : report.evidence.map((item) => (
                  <div key={`${item.document_id}-${item.page}-${item.snippet}`} className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                    <p className="font-semibold text-white">{item.source} {item.page ? `p.${item.page}` : ''}</p>
                    <p className="mt-2">{item.snippet}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
