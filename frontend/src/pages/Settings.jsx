export default function Settings() {
  return (
    <div className="grid gap-8">
      <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Settings</p>
          <h2 className="text-3xl font-semibold text-white">Platform configuration and environment settings</h2>
          <p className="text-slate-400 leading-7">
            Configure ingestion preferences, AI behavior, and data refresh policies for your industrial knowledge platform.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/10">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">AI settings</p>
          <dl className="mt-4 space-y-4 text-slate-400">
            <div>
              <dt className="font-medium text-white">Query confidence threshold</dt>
              <dd className="mt-1">Set how conservative the copilot should be when surfacing answers.</dd>
            </div>
            <div>
              <dt className="font-medium text-white">Citation preference</dt>
              <dd className="mt-1">Choose whether to show citations inline, as footnotes, or both.</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/10">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">System settings</p>
          <dl className="mt-4 space-y-4 text-slate-400">
            <div>
              <dt className="font-medium text-white">Document refresh</dt>
              <dd className="mt-1">Control how often the knowledge graph is updated from new uploads.</dd>
            </div>
            <div>
              <dt className="font-medium text-white">User access</dt>
              <dd className="mt-1">Manage operator, engineer, and auditor access policies.</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
