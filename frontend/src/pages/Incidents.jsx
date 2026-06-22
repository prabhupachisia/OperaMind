import { Activity, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchIncidents, findSimilarIncidents } from '../services/api'

export default function Incidents() {
  const [query, setQuery] = useState('')
  const [incidents, setIncidents] = useState([])
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const data = await fetchIncidents()
        setIncidents(data.incidents || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadIncidents()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!query.trim()) {
      setError('Enter a failure or incident description to search.')
      return
    }

    setSearching(true)
    setError(null)

    try {
      const data = await findSimilarIncidents(query)
      setSimilar(data.incidents || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white">
            <Activity size={22} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Incident intelligence</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Find recurring failures and operational patterns</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">Search historical chunks for similar failures, shutdowns, leaks, faults, and maintenance events.</p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-950">
          Incident description
          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            rows={4}
            placeholder="Pump P101 seal failure after repeated leakage"
            className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
          />
        </label>
        <button
          type="submit"
          disabled={searching}
          className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search size={17} />
          {searching ? 'Searching incidents' : 'Find similar incidents'}
        </button>
      </form>

      {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm">{error}</div> : null}

      {similar.length > 0 ? (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Similarity results</p>
          <div className="mt-4 grid gap-3">
            {similar.map((item) => (
              <div key={item.chunk_id} className="rounded-md border border-slate-200 p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold text-slate-950">{item.source} {item.page ? `p.${item.page}` : ''}</p>
                  <p className="text-xs font-semibold uppercase text-slate-500">Similarity {item.score}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Detected incident candidates</p>
        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Loading incident candidates...</p>
        ) : incidents.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No incident-like records found yet.</p>
        ) : (
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {incidents.map((item) => (
              <article key={item.chunk_id} className="rounded-md border border-slate-200 p-4">
                <p className="font-semibold text-slate-950">{item.asset_tag || 'Unassigned asset'} · {item.incident_type}</p>
                <p className="mt-1 text-sm text-slate-500">{item.source} {item.page ? `p.${item.page}` : ''}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
