import { Bot, Search, Send } from 'lucide-react'
import { useState } from 'react'
import { sendChatQuery } from '../services/api'

const QUICK_PROMPTS = [
  'Show recent maintenance anomalies',
  'Find documents mentioning P101',
  'List compliance gaps in safety procedures',
  'Summarize the latest inspection report',
]

export default function Chat() {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!query.trim()) {
      setError('Enter a question to continue.')
      return
    }

    setLoading(true)
    setError(null)
    setAnswer('')
    setSources([])

    try {
      const response = await sendChatQuery(query)
      setAnswer(response.answer || 'No answer returned from the knowledge base.')
      setSources(response.sources || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white">
            <Bot size={22} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Expert copilot</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Ask operational questions across the corpus</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Query maintenance records, procedures, inspections, incidents, and compliance evidence using the backend retrieval service.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <label className="text-sm font-semibold text-slate-950" htmlFor="copilot-query">Question</label>
          <textarea
            id="copilot-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            rows={7}
            placeholder="What corrective actions were recorded for the last P101 inspection?"
            className="mt-3 block w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={17} />
            {loading ? 'Analyzing corpus' : 'Ask OperaMind'}
          </button>
          {error ? <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}
        </form>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-950">Quick prompts</h2>
          </div>
          <div className="mt-4 grid gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setQuery(prompt)}
                className="rounded-md border border-slate-200 bg-white px-3 py-3 text-left text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </aside>
      </section>

      {answer ? (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Answer</p>
          <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-800">{answer}</div>
          {sources.length > 0 ? (
            <div className="mt-5 border-t border-slate-200 pt-4">
              <p className="text-sm font-semibold text-slate-950">Sources</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sources.map((source) => (
                  <span key={source} className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">{source}</span>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
