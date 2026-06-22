import { Database, Network, ServerCog } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

const endpoints = [
  ['Graph', import.meta.env.VITE_GRAPH_PATH || '/graph'],
  ['Upload', import.meta.env.VITE_UPLOAD_PATH || '/upload'],
  ['Chat', import.meta.env.VITE_CHAT_PATH || '/chat'],
  ['History', import.meta.env.VITE_HISTORY_PATH || '/history'],
  ['Compliance', import.meta.env.VITE_COMPLIANCE_PATH || '/compliance'],
  ['Incidents', import.meta.env.VITE_INCIDENTS_PATH || '/incidents'],
]

export default function Settings() {
  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white">
            <ServerCog size={22} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Settings</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Frontend runtime configuration</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Review the active API target and route bindings used by this Vite frontend.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-slate-500" />
            <h2 className="font-semibold text-slate-950">Backend target</h2>
          </div>
          <p className="mt-4 break-all rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700">{API_URL}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Network size={18} className="text-slate-500" />
            <h2 className="font-semibold text-slate-950">Routes</h2>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Path</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {endpoints.map(([label, path]) => (
                  <tr key={label}>
                    <td className="px-4 py-3 font-semibold text-slate-950">{label}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{path}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
