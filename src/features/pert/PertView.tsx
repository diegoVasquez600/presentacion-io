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
import { Eye, Flame, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CustomPertNode, type PertNodeData } from './CustomPertNode'
import { pertLinksAll, pertNodesAll, pertRouteCritical } from './pertData'

const nodeTypes = { pert: CustomPertNode }

const HINT_KEY = 'pert-hints-v1'
const VISITED_KEY = 'pert-visited-v1'

function loadHints(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(HINT_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string[]>) : {}
  } catch {
    return {}
  }
}

function loadVisited(): string[] {
  try {
    const raw = localStorage.getItem(VISITED_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function PertView() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isCriticalRouteRevealed, setIsCriticalRouteRevealed] = useState(false)
  const [revealedHints, setRevealedHints] = useState<Record<string, string[]>>(loadHints)
  const [visitedNodes, setVisitedNodes] = useState<string[]>(loadVisited)

  useEffect(() => {
    localStorage.setItem(HINT_KEY, JSON.stringify(revealedHints))
  }, [revealedHints])

  useEffect(() => {
    localStorage.setItem(VISITED_KEY, JSON.stringify(visitedNodes))
  }, [visitedNodes])

  function revealHint(field: string) {
    if (!selectedTaskId) {
      return
    }

    setRevealedHints((prev) => ({
      ...prev,
      [selectedTaskId]: [...new Set([...(prev[selectedTaskId] ?? []), field])],
    }))
  }

  function resetProgress() {
    setRevealedHints({})
    setVisitedNodes([])
    setIsCriticalRouteRevealed(false)
    setSelectedTaskId(null)
    localStorage.removeItem(HINT_KEY)
    localStorage.removeItem(VISITED_KEY)
  }

  function isFieldShown(field: string): boolean {
    return isCriticalRouteRevealed || (revealedHints[selectedTaskId] ?? []).includes(field)
  }

  const criticalTaskIds = useMemo(() => new Set(pertRouteCritical), [])
  const totalPlayableNodes = pertNodesAll.filter((n) => n.id !== 'Inicio' && n.id !== 'Fin').length

  const explorationFocusIds = useMemo(
    () => new Set<string>([...(selectedTaskId ? [selectedTaskId] : []), ...visitedNodes]),
    [selectedTaskId, visitedNodes],
  )

  const exploredGraph = useMemo(() => {
    const connectedNodeIds = new Set<string>(explorationFocusIds)
    const connectedEdgeIds = new Set<string>()

    for (const edge of pertLinksAll) {
      if (explorationFocusIds.has(edge.source) || explorationFocusIds.has(edge.target)) {
        connectedNodeIds.add(edge.source)
        connectedNodeIds.add(edge.target)
        connectedEdgeIds.add(edge.id)
      }
    }

    return { connectedNodeIds, connectedEdgeIds }
  }, [explorationFocusIds])

  const criticalEdgeIds = useMemo(() => {
    const ids = new Set<string>()
    for (let index = 0; index < pertRouteCritical.length - 1; index += 1) {
      ids.add(`${pertRouteCritical[index]}-${pertRouteCritical[index + 1]}`)
    }
    return ids
  }, [])

  const nodes = useMemo<Node<PertNodeData>[]>(
    () =>
      pertNodesAll.map((task) => {
        const nodeHints = revealedHints[task.id] ?? []
        return {
          id: task.id,
          type: 'pert',
          position: task.position,
          data: {
            id: task.id,
            t: String(task.duracionDias),
            H: String(task.H),
            IP: String(task.IP),
            TP: String(task.TP),
            IL: String(task.IL),
            TL: String(task.TL),
            isCritical: isCriticalRouteRevealed && criticalTaskIds.has(task.id),
            showH: isCriticalRouteRevealed || nodeHints.includes('H'),
            showIL: isCriticalRouteRevealed || nodeHints.includes('IL'),
            showTL: isCriticalRouteRevealed || nodeHints.includes('TL'),
            isPathFocused: exploredGraph.connectedNodeIds.has(task.id),
            isDimmed: !exploredGraph.connectedNodeIds.has(task.id),
          },
          selected: task.id === selectedTaskId,
        }
      }),
    [
      criticalTaskIds,
      exploredGraph.connectedNodeIds,
      isCriticalRouteRevealed,
      selectedTaskId,
      revealedHints,
    ],
  )

  const edges = useMemo<Edge[]>(
    () =>
      pertLinksAll.map((link) => {
        const isConnected = exploredGraph.connectedEdgeIds.has(link.id)
        const isCriticalEdge = isCriticalRouteRevealed && criticalEdgeIds.has(link.id)
        const edgeColor = isCriticalEdge
          ? '#dc2626'
          : isConnected
            ? '#38bdf8'
            : 'rgba(148, 163, 184, 0.35)'

        return {
          ...link,
          type: 'smoothstep',
          animated: isCriticalEdge,
          className: isCriticalEdge
            ? 'edge-critical-revealed'
            : isConnected
              ? 'edge-path-focus'
              : 'edge-dimmed',
          style: {
            stroke: edgeColor,
            strokeWidth: isCriticalEdge ? 4.2 : isConnected ? 3.2 : 1.8,
          },
          markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor },
        }
      }),
    [criticalEdgeIds, exploredGraph.connectedEdgeIds, isCriticalRouteRevealed],
  )

  const selectedNode = selectedTaskId
    ? pertNodesAll.find((task) => task.id === selectedTaskId) ?? null
    : null
  const selectedNodeTitle = selectedNode
    ? selectedNode.actividad.split(':')[0] ?? selectedNode.actividad
    : 'Ninguno'
  const directPredecessors = selectedNode ? selectedNode.predecesoras : []
  const directSuccessors = selectedNode
    ? pertLinksAll.filter((edge) => edge.source === selectedTaskId).map((edge) => edge.target)
    : []

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    setSelectedTaskId(node.id)
    if (node.id !== 'Inicio' && node.id !== 'Fin') {
      setVisitedNodes((prev) => (prev.includes(node.id) ? prev : [...prev, node.id]))
    }
  }

  const visitedCount = visitedNodes.length
  const progressPct = Math.round((visitedCount / totalPlayableNodes) * 100)

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,2.35fr)_330px]">
      {/* ── Main flow panel ── */}
      <div className="rounded-[26px] border border-white/10 bg-slate-950/70 p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-400">
              Sección 2 · Juego PERT-CPM
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
              El laberinto de la ruta crítica
            </h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300 md:text-base">
              Haz clic en un nodo para analizar sus conexiones. Usa las{' '}
              <span className="font-semibold text-amber-300">pistas</span> del panel para
              revelar H, IL y TL de forma individual por nodo.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCriticalRouteRevealed((v) => !v)}
            className={`inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-2xl border px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] transition md:text-base ${
              isCriticalRouteRevealed
                ? 'border-red-400/50 bg-red-500/15 text-red-100 shadow-[0_0_0_1px_rgba(248,113,113,0.16)]'
                : 'border-red-300/20 bg-red-500/10 text-red-200 hover:border-red-300/40 hover:bg-red-500/15'
            }`}
            aria-pressed={isCriticalRouteRevealed}
          >
            <Flame className="h-5 w-5" />
            {isCriticalRouteRevealed ? 'Ocultar ruta crítica' : 'Revelar holguras y ruta crítica'}
          </button>
        </div>

        <div className="h-[78vh] min-h-[640px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.14),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))]">
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

      {/* ── Sidebar ── */}
      <aside className="flex flex-col gap-4 rounded-[26px] border border-white/10 bg-white/[0.04] p-5 md:p-6">

        {/* Selected node card */}
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.34em] text-slate-400">Nodo seleccionado</p>
            {selectedNode?.esCritica && isCriticalRouteRevealed && (
              <span className="shrink-0 rounded-full border border-red-400/40 bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-300">
                Ruta crítica
              </span>
            )}
          </div>
          <h3 className="mt-2 text-xl font-semibold text-white">
            {selectedNode ? `${selectedNode.id} · ${selectedNodeTitle}` : 'Sin selección'}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
            {selectedNode
              ? selectedNode.actividad
              : 'Haz clic en un nodo para comenzar a explorar la red y calcular la ruta crítica.'}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <StatCard label="Tiempo (t)" value={selectedNode?.duracionDias ?? null} accent="emerald" />
            <StatCard label="Inicio próximo" value={selectedNode?.IP ?? null} accent="cyan" />
            <StatCard label="Term. próxima" value={selectedNode?.TP ?? null} accent="cyan" />
            <HintCard
              label="Holgura (H)"
              value={selectedNode?.H ?? null}
              shown={isFieldShown('H')}
              isCriticalZero={selectedNode?.H === 0}
              disabled={!selectedNode}
              onReveal={() => revealHint('H')}
            />
            <HintCard
              label="Inicio lejano"
              value={selectedNode?.IL ?? null}
              shown={isFieldShown('IL')}
              disabled={!selectedNode}
              onReveal={() => revealHint('IL')}
            />
            <HintCard
              label="Term. lejana"
              value={selectedNode?.TL ?? null}
              shown={isFieldShown('TL')}
              disabled={!selectedNode}
              onReveal={() => revealHint('TL')}
            />
          </div>
        </div>

        {/* Node map reference */}
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.34em] text-slate-400">
            Referencia visual del nodo
          </p>
          <NodeMap />
        </div>

        {/* Connections */}
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Conexiones directas</p>
          <p className="mt-2">
            <span className="font-semibold text-cyan-200">Pred:</span>{' '}
            {directPredecessors.length > 0 ? directPredecessors.join(', ') : 'Ninguna'}
          </p>
          <p>
            <span className="font-semibold text-cyan-200">Suc:</span>{' '}
            {directSuccessors.length > 0 ? directSuccessors.join(', ') : 'Ninguna'}
          </p>
          <p>
            <span className="font-semibold text-cyan-200">Ventana:</span>{' '}
            {selectedNode ? `día ${selectedNode.IP} → día ${selectedNode.TP}` : '—'}
          </p>
        </div>

        {/* Hint mode info */}
        <div className="rounded-3xl border border-emerald-400/15 bg-emerald-400/8 p-4 text-xs leading-5 text-emerald-100/80">
          {isCriticalRouteRevealed
            ? 'Todos los valores visibles. Aristas críticas en rojo animado.'
            : 'H, IL y TL ocultos. Presiona "Ver pista" en cada celda para revelar ese valor en este nodo.'}
        </div>

        {/* Progress + reset */}
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Progreso</p>
              <p className="mt-1 text-sm text-slate-300">
                <span className="font-bold text-white">{visitedCount}</span>
                <span className="text-slate-400"> / {totalPlayableNodes} nodos ({progressPct}%)</span>
              </p>
            </div>
            <button
              type="button"
              onClick={resetProgress}
              title="Reiniciar progreso y pistas"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-700/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </aside>
    </section>
  )
}

// ── Sub-components ──────────────────────────────────────────

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent: 'cyan' | 'emerald'
}) {
  const cls = {
    cyan: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100',
    emerald: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
  }[accent]

  return (
    <div className={`rounded-2xl border p-3 ${cls}`}>
      <p className="text-[10px] uppercase tracking-[0.22em] opacity-70">{label}</p>
      <p className="mt-1.5 text-lg font-semibold">{value}</p>
    </div>
  )
}

function HintCard({
  label,
  value,
  shown,
  isCriticalZero,
  onReveal,
}: {
  label: string
  value: number
  shown: boolean
  isCriticalZero?: boolean
  onReveal: () => void
}) {
  if (shown) {
    const cls = isCriticalZero
      ? 'border-red-400/25 bg-red-500/10 text-red-200'
      : 'border-amber-400/20 bg-amber-500/8 text-amber-100'
    return (
      <div className={`rounded-2xl border p-3 ${cls}`}>
        <p className="text-[10px] uppercase tracking-[0.22em] opacity-70">{label}</p>
        <p className={`mt-1.5 text-lg font-semibold ${isCriticalZero ? 'text-red-300' : ''}`}>
          {value}
        </p>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onReveal}
      className="flex flex-col gap-1 rounded-2xl border border-amber-400/12 bg-amber-500/5 p-3 text-left transition hover:border-amber-400/30 hover:bg-amber-500/12 active:scale-[0.97]"
    >
      <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</span>
      <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400/70">
        <Eye className="h-3.5 w-3.5" />
        Ver pista
      </span>
    </button>
  )
}

/** Mini diagram showing where each variable lives inside a PERT node circle */
function NodeMap() {
  return (
    <div className="flex items-center gap-5">
      <div className="relative h-[90px] w-[90px] shrink-0 rounded-full border-2 border-slate-500/50 bg-slate-900/60">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-500/50" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-slate-500/50" />
        <span className="absolute left-1/2 top-[7px] -translate-x-1/2 text-[9px] font-bold text-emerald-300">t</span>
        <span className="absolute bottom-[7px] left-1/2 -translate-x-1/2 text-[9px] font-bold text-amber-300">H</span>
        <span className="absolute left-[12px] top-[24px] text-[9px] font-bold text-slate-300">IP</span>
        <span className="absolute right-[12px] top-[24px] text-[9px] font-bold text-slate-300">TP</span>
        <span className="absolute bottom-[23px] left-[12px] text-[9px] font-bold text-amber-300/70">IL</span>
        <span className="absolute bottom-[23px] right-[12px] text-[9px] font-bold text-amber-300/70">TL</span>
        <div className="absolute left-1/2 top-1/2 flex h-[28px] w-[28px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-white/15 bg-slate-950 text-[9px] font-bold text-white">
          ID
        </div>
      </div>
      <div className="space-y-[5px] text-[10px] leading-4">
        <NodeMapRow k="IP" label="Inicio Próximo" color="text-slate-300" />
        <NodeMapRow k="TP" label="Term. Próxima" color="text-slate-300" />
        <NodeMapRow k="t" label="Duración" color="text-emerald-300" />
        <NodeMapRow k="H" label="Holgura" color="text-amber-300" />
        <NodeMapRow k="IL" label="Inicio Lejano" color="text-amber-300/70" />
        <NodeMapRow k="TL" label="Term. Lejana" color="text-amber-300/70" />
      </div>
    </div>
  )
}

function NodeMapRow({ k, label, color }: { k: string; label: string; color: string }) {
  return (
    <div>
      <span className={`font-bold ${color}`}>{k}</span>{' '}
      <span className="text-slate-500">{label}</span>
    </div>
  )
}
