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
    <div className="grid gap-8">
      <section className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Incident Similarity Engine</p>
        <h2 className="mt-4 text-3xl font-semibold text-white">Find repeated failures and recurring operational patterns</h2>
        <p className="mt-4 max-w-3xl text-slate-400 leading-7">
          Search historical chunks for similar failures, shutdowns, leaks, faults, and maintenance incidents.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="rounded-4xl border border-white/10 bg-slate-950/75 p-6">
        <label className="block text-sm font-medium text-slate-200">
          Incident description
          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            rows={4}
            placeholder="Example: Pump P101 seal failure after repeated leakage"
            className="mt-3 block w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
          />
        </label>
        <button
          type="submit"
          disabled={searching}
          className="mt-4 rounded-3xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {searching ? 'Searching incidents...' : 'Find similar incidents'}
        </button>
      </form>

      {error ? (
        <div className="rounded-4xl border border-white/10 bg-rose-500/10 p-6 text-rose-200">{error}</div>
      ) : null}

      {similar.length > 0 ? (
        <section className="rounded-4xl border border-white/10 bg-slate-950/75 p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Similarity results</p>
          <div className="mt-4 grid gap-4">
            {similar.map((item) => (
              <div key={item.chunk_id} className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">{item.source} {item.page ? `p.${item.page}` : ''}</p>
                <p className="mt-2 text-cyan-300">Score: {item.score}</p>
                <p className="mt-2">{item.summary}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-4xl border border-white/10 bg-slate-950/75 p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Detected incident candidates</p>
        {loading ? (
          <p className="mt-4 text-slate-400">Loading incident candidates...</p>
        ) : incidents.length === 0 ? (
          <p className="mt-4 text-slate-400">No incident-like records found yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {incidents.map((item) => (
              <div key={item.chunk_id} className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">{item.asset_tag || 'Unassigned asset'} - {item.incident_type}</p>
                <p className="mt-2 text-slate-400">{item.source} {item.page ? `p.${item.page}` : ''}</p>
                <p className="mt-2">{item.summary}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
