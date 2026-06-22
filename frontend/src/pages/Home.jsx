export default function Home() {
  return (
    <div className="grid gap-8">
      <section className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Problem statement</p>
          <h2 className="text-3xl font-semibold text-white">From knowledge fragmentation to a unified operations brain</h2>
          <p className="max-w-3xl text-slate-400 leading-7">
            Build an AI platform that ingests heterogeneous industrial documents, extracts equipment and operations intelligence, and makes it instantly queryable across teams and devices.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: 'Document ingestion',
            description: 'Upload PDFs, reports, drawings and records to create a single source of truth.',
          },
          {
            title: 'Knowledge graph',
            description: 'Extract entities and relationships across assets, systems and procedures.',
          },
          {
            title: 'AI copilot',
            description: 'Ask operational questions with citations, confidence and traceability.',
          },
        ].map((card) => (
          <div key={card.title} className="rounded-4xl border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/10">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">{card.title}</p>
            <p className="mt-4 text-lg font-semibold text-white">{card.title}</p>
            <p className="mt-3 text-slate-400">{card.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
          <h3 className="text-xl font-semibold text-white">Why this matters</h3>
          <ul className="mt-4 space-y-3 text-slate-400">
            <li>Reduce time spent searching for disconnected documents.</li>
            <li>Preserve retiring operational knowledge in a structured graph.</li>
            <li>Enable safer, faster, and more consistent decisions on the plant floor.</li>
          </ul>
        </div>
        <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
          <h3 className="text-xl font-semibold text-white">How to use the app</h3>
          <ol className="mt-4 space-y-3 text-slate-400 list-decimal list-inside">
            <li>Upload documents from your corpus.</li>
            <li>Generate and explore the knowledge graph.</li>
            <li>Ask the AI copilot operational queries.</li>
            <li>Review history and saved insights.</li>
          </ol>
        </div>
      </section>
    </div>
  )
}
