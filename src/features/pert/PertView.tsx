import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Trophy } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CustomPertNode, type PertNodeData } from './CustomPertNode'
import { pertLinks, pertTasks } from './pertData'

const nodeTypes = {
  pert: CustomPertNode,
}

const legendItems = [
  { key: 'IP', label: 'Inicio Próximo', color: 'text-cyan-200' },
  { key: 't', label: 'Tiempo o duración de la actividad', color: 'text-emerald-200' },
  { key: 'TP', label: 'Terminación Próxima', color: 'text-cyan-200' },
  { key: 'IL', label: 'Inicio Lejano', color: 'text-amber-200' },
  { key: 'H', label: 'Holgura de la actividad', color: 'text-amber-200' },
  { key: 'TL', label: 'Terminación Lejana', color: 'text-amber-200' },
  { key: 'ID', label: 'Nombre o símbolo de la tarea', color: 'text-white' },
]

export function PertView() {
  const [selectedTaskId, setSelectedTaskId] = useState('A')
  const [isCriticalRouteRevealed, setIsCriticalRouteRevealed] = useState(false)

  const criticalTaskIds = useMemo(
    () => new Set(pertTasks.filter((task) => task.H === 0).map((task) => task.id)),
    [],
  )

  const criticalEdgeIds = useMemo(
    () =>
      new Set(
        pertLinks
          .filter(
            (link) =>
              criticalTaskIds.has(link.source) && criticalTaskIds.has(link.target),
          )
          .map((link) => link.id),
      ),
    [criticalTaskIds],
  )

  const nodes = useMemo<Node<PertNodeData>[]>(
    () =>
      pertTasks.map((task) => ({
        id: task.id,
        type: 'pert',
        position: task.position,
        data: {
          id: task.id,
          t: String(task.t),
          H: String(task.H),
          IP: String(task.IP),
          TP: String(task.TP),
          IL: String(task.IL),
          TL: String(task.TL),
          isCritical: isCriticalRouteRevealed && criticalTaskIds.has(task.id),
        },
        selected: task.id === selectedTaskId,
      })),
    [criticalTaskIds, isCriticalRouteRevealed, selectedTaskId],
  )

  const edges = useMemo<Edge[]>(
    () =>
      pertLinks.map((link) => {
        const isCriticalEdge =
          isCriticalRouteRevealed && criticalEdgeIds.has(link.id)
        const edgeColor = isCriticalEdge ? '#ff3b30' : 'rgba(148, 163, 184, 0.55)'

        return {
          ...link,
          type: 'smoothstep',
          animated: isCriticalEdge,
          className: isCriticalEdge ? 'edge-critical-revealed' : 'edge-default',
          style: {
            stroke: edgeColor,
            strokeWidth: isCriticalEdge ? 4 : 2.5,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeColor,
          },
        }
      }),
    [criticalEdgeIds, isCriticalRouteRevealed],
  )

  const selectedTask =
    pertTasks.find((task) => task.id === selectedTaskId) ?? pertTasks[0]

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    setSelectedTaskId(node.id)
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_380px]">
      <div className="rounded-[26px] border border-white/10 bg-slate-950/70 p-5 md:p-6">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-400">
              PERT-CPM Interactivo
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              Diagrama de red con React Flow
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              El componente usa un nodo personalizado con la estructura clásica PERT y un modo de revelado para destacar automáticamente la ruta crítica cuando la holgura es cero.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsCriticalRouteRevealed((currentValue) => !currentValue)
            }
            className={`inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] transition md:text-base ${
              isCriticalRouteRevealed
                ? 'border-red-400/50 bg-red-500/15 text-red-100 shadow-[0_0_0_1px_rgba(248,113,113,0.16)]'
                : 'border-red-300/20 bg-red-500/10 text-red-200 hover:border-red-300/40 hover:bg-red-500/15'
            }`}
            aria-pressed={isCriticalRouteRevealed}
          >
            <Trophy className="h-5 w-5" />
            Revelar Ruta Crítica
          </button>
        </div>

        <div className="h-[720px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.14),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))]">
          <ReactFlow
            className="pert-flow"
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            fitView
            fitViewOptions={{ padding: 0.16 }}
            minZoom={0.35}
            maxZoom={1.4}
            defaultEdgeOptions={{ selectable: false }}
            nodesConnectable={false}
            elementsSelectable
            proOptions={{ hideAttribution: true }}
          >
            <Background color="rgba(148, 163, 184, 0.18)" gap={28} />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>
      </div>

      <aside className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-400">
            Nodo seleccionado
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            {selectedTask.id} · {selectedTask.name}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {selectedTask.description}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-200">
            <StatCard label="Tiempo" value={`${selectedTask.t}`} accent="emerald" />
            <StatCard
              label="Holgura"
              value={`${selectedTask.H}`}
              accent={selectedTask.H === 0 ? 'red' : 'amber'}
            />
            <StatCard label="Inicio Próximo" value={`${selectedTask.IP}`} accent="cyan" />
            <StatCard label="Terminación Próxima" value={`${selectedTask.TP}`} accent="cyan" />
            <StatCard label="Inicio Lejano" value={`${selectedTask.IL}`} accent="amber" />
            <StatCard label="Terminación Lejana" value={`${selectedTask.TL}`} accent="amber" />
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-emerald-400/15 bg-emerald-400/10 p-4 text-sm leading-7 text-emerald-50/90">
          {isCriticalRouteRevealed
            ? 'La ruta crítica está visible: nodos con H = 0 y sus conexiones aparecen en rojo brillante con animación.'
            : 'Pulsa el botón para activar la gamificación y resaltar la ruta crítica del proyecto.'}
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-400">
            Guía del nodo PERT
          </p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            {legendItems.map((item) => (
              <div
                key={item.key}
                className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
              >
                <span className={`font-semibold ${item.color}`}>{item.key}</span>
                <span className="text-slate-400"> · </span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-7 text-slate-300">
          Dataset actual: 20 tareas estáticas de ejemplo. Cuando me compartas tu JSON, solo habrá que reemplazar el arreglo en el módulo de datos y conservar el mismo renderizado.
        </div>
      </aside>
    </section>
  )
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: 'cyan' | 'emerald' | 'amber' | 'red'
}) {
  const accentClass = {
    cyan: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100',
    emerald: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
    amber: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
    red: 'border-red-400/20 bg-red-400/10 text-red-100',
  }[accent]

  return (
    <div className={`rounded-2xl border p-3 ${accentClass}`}>
      <p className="text-[11px] uppercase tracking-[0.24em] opacity-75">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  )
}