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
  const [confidence, setConfidence] = useState(null)
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
    setConfidence(null)

    try {
      const response = await sendChatQuery(query)
      setAnswer(response.answer || 'No answer returned from the knowledge base.')
      setSources(response.sources || [])
      setConfidence(response.confidence ?? 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickPrompt = (prompt) => {
    setQuery(prompt)
  }

  return (
    <div className="grid gap-8">
      <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Expert Copilot</p>
          <h2 className="text-3xl font-semibold text-white">Ask operational questions across your knowledge corpus</h2>
          <p className="text-slate-400 leading-7">
            Use AI-guided conversation to get answers from maintenance records, procedures, compliance documents and equipment history with source citations.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-4xl border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/10">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Ask a question</p>
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          rows={5}
          placeholder="Example: What corrective actions were recorded for the last P101 inspection?"
          className="mt-4 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4 text-sm text-slate-200 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
        />
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-3xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Analyzing corpus...' : 'Ask OperaMind'}
          </button>
          <span className="text-sm text-slate-400">
            Confidence: {confidence !== null ? `${confidence}` : '-'}
          </span>
        </div>

        {error ? (
          <div className="mt-5 rounded-3xl bg-rose-500/10 border border-rose-400/15 p-4 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {answer ? (
          <div className="mt-5 space-y-4 rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-slate-200">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Answer</p>
              <p className="mt-3 text-slate-100">{answer}</p>
            </div>
            {sources.length > 0 ? (
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Sources</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-400">
                  {sources.map((source) => (
                    <li key={source}>{source}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </form>

      <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-8 shadow-2xl shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Quick prompts</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleQuickPrompt(prompt)}
              className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-slate-900"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
