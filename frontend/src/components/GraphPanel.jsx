import { useMemo } from 'react'
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'

const TYPE_COLORS = {
  Equipment: '#0891b2',
  Person: '#7c3aed',
  WorkOrder: '#2563eb',
  Incident: '#dc2626',
  NearMiss: '#ea580c',
  Compliance: '#16a34a',
  OEM: '#9333ea',
  Procedure: '#0d9488',
  Inspection: '#ca8a04',
  Location: '#475569',
  Document: '#64748b',
  Entity: '#0f172a',
}

export default function GraphPanel({ nodes, edges, onNodeSelect }) {
  const flowNodes = useMemo(
    () =>
      nodes.map((node, index) => ({
        id: node.id,
        position: {
          x: 120 + (index % 3) * 220,
          y: 40 + Math.floor(index / 3) * 160,
        },
        data: {
          label: `${node.label || node.id}\n${node.type || node.group || 'Entity'}`,
        },
        style: {
          border: '1px solid rgba(38, 214, 255, 0.35)',
          background: TYPE_COLORS[node.type || node.group] || TYPE_COLORS.Entity,
          color: '#e2e8f0',
          padding: 14,
          borderRadius: 8,
          whiteSpace: 'pre-line',
          minWidth: 150,
          textAlign: 'center',
        },
      })),
    [nodes],
  )

  return (
    <div className="min-h-[520px] rounded-lg border border-white/10 bg-slate-950/75 p-4 shadow-2xl shadow-cyan-500/10">
      <ReactFlow
        nodes={flowNodes}
        edges={edges}
        fitView
        attributionPosition="bottom-left"
        onNodeClick={(_, node) => onNodeSelect?.(node.id)}
      >
        <MiniMap
          nodeStrokeColor={(node) => (node.selected ? '#38bdf8' : '#94a3b8')}
          nodeColor={(node) => {
            const sourceNode = nodes.find((item) => item.id === node.id)
            return TYPE_COLORS[sourceNode?.type || sourceNode?.group] || TYPE_COLORS.Entity
          }}
          zoomOnScroll={false}
        />
        <Background gap={20} size={2} color="#334155" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}

