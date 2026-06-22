import { useMemo } from 'react'
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'

export default function GraphPanel({ nodes, edges }) {
  const flowNodes = useMemo(
    () =>
      nodes.map((node, index) => ({
        id: node.id,
        position: {
          x: 120 + (index % 3) * 220,
          y: 40 + Math.floor(index / 3) * 160,
        },
        data: { label: node.label },
        style: {
          border: '1px solid rgba(38, 214, 255, 0.35)',
          background: '#0f172a',
          color: '#e2e8f0',
          padding: 14,
          borderRadius: 20,
        },
      })),
    [nodes],
  )

  return (
    <div className="h-130 rounded-4xl border border-white/10 bg-slate-950/75 p-4 shadow-2xl shadow-cyan-500/10">
      <ReactFlow nodes={flowNodes} edges={edges} fitView attributionPosition="bottom-left">
        <MiniMap nodeStrokeColor={(node) => (node.selected ? '#38bdf8' : '#94a3b8')} nodeColor={(node) => '#0f172a'} zoomOnScroll={false} />
        <Background gap={20} size={2} color="#334155" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}

