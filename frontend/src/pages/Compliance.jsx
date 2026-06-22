import { ClipboardCheck, ShieldAlert, ShieldCheck } from 'lucide-react'
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
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white">
            <ShieldCheck size={22} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Compliance intelligence</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Evidence readiness and audit gaps</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">Analyze uploaded records for procedure, inspection, maintenance, and safety evidence coverage.</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-950">
          Scope
          <select
            value={selectedDocumentId}
            onChange={handleDocumentChange}
            className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
          >
            <option value="">All uploaded documents</option>
            {documents.map((doc) => (
              <option key={doc.document_id} value={doc.document_id}>{doc.original_filename || doc.filename}</option>
            ))}
          </select>
        </label>
      </section>

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">Analyzing compliance evidence...</div>
      ) : error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800 shadow-sm">{error}</div>
      ) : report ? (
        <section className="grid gap-5 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Readiness</p>
            <p className="mt-3 text-5xl font-semibold text-slate-950">{Math.round((report.score || 0) * 100)}%</p>
            <div className="mt-5 space-y-2">
              {(report.checks || []).map((check) => (
                <div key={check.id} className="flex items-start gap-3 rounded-md border border-slate-200 p-3">
                  {check.passed ? <ShieldCheck size={18} className="mt-0.5 text-emerald-600" /> : <ShieldAlert size={18} className="mt-0.5 text-rose-600" />}
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{check.label}</p>
                    <p className="text-xs font-medium uppercase text-slate-500">{check.passed ? 'Pass' : 'Gap'}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="grid gap-5">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-slate-500" />
                <h2 className="font-semibold text-slate-950">Gaps and recommendations</h2>
              </div>
              <div className="mt-4 grid gap-3">
                {(report.gaps || []).length === 0 ? (
                  <p className="text-sm text-slate-500">No compliance gaps detected in the selected scope.</p>
                ) : (
                  report.gaps.map((gap) => (
                    <p key={gap.id} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">{gap.recommendation}</p>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <ClipboardCheck size={18} className="text-slate-500" />
                <h2 className="font-semibold text-slate-950">Evidence references</h2>
              </div>
              <div className="mt-4 grid gap-3">
                {(report.evidence || []).length === 0 ? (
                  <p className="text-sm text-slate-500">No evidence snippets found yet.</p>
                ) : (
                  report.evidence.map((item) => (
                    <div key={`${item.document_id}-${item.page}-${item.snippet}`} className="rounded-md border border-slate-200 p-4">
                      <p className="font-semibold text-slate-950">{item.source} {item.page ? `p.${item.page}` : ''}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.snippet}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </section>
      ) : null}
    </div>
  )
}
