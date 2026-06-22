import { GitBranch } from 'lucide-react'
import { useMemo } from 'react'
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'

const TYPE_COLORS = {
  Equipment: '#0f766e',
  Person: '#7c3aed',
  WorkOrder: '#1d4ed8',
  Incident: '#be123c',
  NearMiss: '#c2410c',
  Compliance: '#15803d',
  OEM: '#6d28d9',
  Procedure: '#0369a1',
  Inspection: '#a16207',
  Location: '#475569',
  Document: '#334155',
  Entity: '#111827',
}

function normalizeEdges(edges) {
  return edges.map((edge, index) => ({
    id: edge.id || `${edge.source}-${edge.target}-${index}`,
    source: edge.source,
    target: edge.target,
    label: edge.label || edge.relation || edge.type || '',
    animated: false,
    style: { stroke: '#64748b', strokeWidth: 1.6 },
    labelStyle: { fill: '#334155', fontWeight: 600, fontSize: 11 },
    labelBgStyle: { fill: '#ffffff', fillOpacity: 0.86 },
  }))
}

export default function GraphPanel({ nodes, edges, onNodeSelect }) {
  const flowNodes = useMemo(
    () =>
      nodes.map((node, index) => ({
        id: String(node.id),
        position: {
          x: 80 + (index % 5) * 240,
          y: 60 + Math.floor(index / 5) * 170,
        },
        data: {
          label: `${node.label || node.id}\n${node.type || node.group || 'Entity'}`,
        },
        style: {
          border: '1px solid rgba(15, 23, 42, 0.16)',
          background: TYPE_COLORS[node.type || node.group] || TYPE_COLORS.Entity,
          color: '#f8fafc',
          padding: 12,
          borderRadius: 8,
          whiteSpace: 'pre-line',
          minWidth: 150,
          maxWidth: 190,
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 700,
          boxShadow: '0 16px 30px rgba(15, 23, 42, 0.18)',
        },
      })),
    [nodes],
  )

  const flowEdges = useMemo(() => normalizeEdges(edges), [edges])

  return (
    <section className="relative h-[720px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {flowNodes.length === 0 ? (
        <div className="flex h-full items-center justify-center p-8 text-center">
          <div className="max-w-md">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-700">
              <GitBranch size={22} />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-slate-950">No graph loaded</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Generate a graph from document text or load a saved graph from ingestion history.
            </p>
          </div>
        </div>
      ) : (
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          fitView
          minZoom={0.2}
          attributionPosition="bottom-left"
          onNodeClick={(_, node) => onNodeSelect?.(node.id)}
        >
          <MiniMap
            pannable
            zoomable
            nodeStrokeColor={(node) => (node.selected ? '#0f172a' : '#94a3b8')}
            nodeColor={(node) => {
              const sourceNode = nodes.find((item) => String(item.id) === node.id)
              return TYPE_COLORS[sourceNode?.type || sourceNode?.group] || TYPE_COLORS.Entity
            }}
          />
          <Background gap={22} size={1.2} color="#dbe3ea" />
          <Controls />
        </ReactFlow>
      )}
    </section>
  )
}
