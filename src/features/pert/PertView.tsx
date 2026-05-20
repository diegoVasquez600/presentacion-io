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
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  Flame,
  RotateCcw,
  Trophy,
  UserPlus,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CustomPertNode, type PertNodeData } from './CustomPertNode'
import { pertLinksAll, pertNodesAll, pertRouteCritical } from './pertData'

const nodeTypes = { pert: CustomPertNode }

const HINT_KEY = 'pert-hints-v1'
const VISITED_KEY = 'pert-visited-v1'
const GUESSES_KEY = 'pert-guesses-v1'
const SCOREBOARD_KEY = 'pert-scoreboard-v1'
const PLAYER_KEY = 'pert-player-v1'
const GUIDE_OPEN_KEY = 'pert-guide-open-v1'
const GUIDE_CONTENT_ID = 'pert-guide-content'

const nodeLegendItems = [
  { key: 'IP', label: 'Inicio proximo', color: 'text-cyan-200' },
  { key: 'TP', label: 'Terminacion proxima', color: 'text-cyan-200' },
  { key: 't', label: 'Duracion', color: 'text-emerald-200' },
  { key: 'H', label: 'Holgura', color: 'text-amber-200' },
  { key: 'IL', label: 'Inicio lejano', color: 'text-amber-200' },
  { key: 'TL', label: 'Terminacion lejana', color: 'text-amber-200' },
  { key: 'ID', label: 'ID del nodo', color: 'text-white' },
]

type ScoreEntry = {
  id: string
  playerName: string
  score: number
  hits: number
  falsePositives: number
  missed: number
  hintsUsed: number
  visitedPct: number
  submittedAt: string
}

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

function loadGuesses(): string[] {
  try {
    const raw = localStorage.getItem(GUESSES_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function loadScoreboard(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(SCOREBOARD_KEY)
    return raw ? (JSON.parse(raw) as ScoreEntry[]) : []
  } catch {
    return []
  }
}

function loadCurrentPlayer(): string {
  try {
    return localStorage.getItem(PLAYER_KEY) ?? ''
  } catch {
    return ''
  }
}

function loadGuideOpen(): boolean {
  try {
    return localStorage.getItem(GUIDE_OPEN_KEY) === '1'
  } catch {
    return false
  }
}

export function PertView() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isCriticalRouteRevealed, setIsCriticalRouteRevealed] = useState(false)
  const [revealedHints, setRevealedHints] = useState<Record<string, string[]>>(loadHints)
  const [visitedNodes, setVisitedNodes] = useState<string[]>(loadVisited)
  const [criticalGuesses, setCriticalGuesses] = useState<string[]>(loadGuesses)
  const [scoreboard, setScoreboard] = useState<ScoreEntry[]>(loadScoreboard)
  const [playerNameDraft, setPlayerNameDraft] = useState(loadCurrentPlayer)
  const [currentPlayer, setCurrentPlayer] = useState(loadCurrentPlayer)
  const [lastResult, setLastResult] = useState<ScoreEntry | null>(null)
  const [isGuideOpen, setIsGuideOpen] = useState(loadGuideOpen)
  const [isSubmittingAttempt, setIsSubmittingAttempt] = useState(false)
  const submitLockRef = useRef(false)

  useEffect(() => {
    localStorage.setItem(HINT_KEY, JSON.stringify(revealedHints))
  }, [revealedHints])

  useEffect(() => {
    localStorage.setItem(VISITED_KEY, JSON.stringify(visitedNodes))
  }, [visitedNodes])

  useEffect(() => {
    localStorage.setItem(GUESSES_KEY, JSON.stringify(criticalGuesses))
  }, [criticalGuesses])

  useEffect(() => {
    localStorage.setItem(SCOREBOARD_KEY, JSON.stringify(scoreboard))
  }, [scoreboard])

  useEffect(() => {
    localStorage.setItem(PLAYER_KEY, currentPlayer)
  }, [currentPlayer])

  useEffect(() => {
    localStorage.setItem(GUIDE_OPEN_KEY, isGuideOpen ? '1' : '0')
  }, [isGuideOpen])

  function revealHint(field: string) {
    if (!selectedTaskId) {
      return
    }

    setRevealedHints((prev) => ({
      ...prev,
      [selectedTaskId]: [...new Set([...(prev[selectedTaskId] ?? []), field])],
    }))
  }

  function resetRound() {
    setRevealedHints({})
    setVisitedNodes([])
    setCriticalGuesses([])
    setIsCriticalRouteRevealed(false)
    setSelectedTaskId(null)
    setLastResult(null)
    localStorage.removeItem(HINT_KEY)
    localStorage.removeItem(VISITED_KEY)
    localStorage.removeItem(GUESSES_KEY)
  }

  function clearScoreboard() {
    setScoreboard([])
    localStorage.removeItem(SCOREBOARD_KEY)
  }

  function startPlayer() {
    const normalized = playerNameDraft.trim()
    if (!normalized) {
      return
    }
    setCurrentPlayer(normalized)
    resetRound()
  }

  function isFieldShown(field: string): boolean {
    if (!selectedTaskId) {
      return false
    }

    return isCriticalRouteRevealed || (revealedHints[selectedTaskId] ?? []).includes(field)
  }

  const criticalTaskIds = useMemo(() => new Set(pertRouteCritical), [])
  const criticalPlayableIds = useMemo(
    () => new Set(pertRouteCritical.filter((id) => id !== 'Inicio' && id !== 'Fin')),
    [],
  )
  const playableNodeIds = useMemo(
    () => new Set(pertNodesAll.filter((n) => n.id !== 'Inicio' && n.id !== 'Fin').map((n) => n.id)),
    [],
  )
  const totalPlayableNodes = playableNodeIds.size

  const hintsUsed = useMemo(
    () => Object.values(revealedHints).reduce((sum, fields) => sum + fields.length, 0),
    [revealedHints],
  )

  const guessSet = useMemo(() => new Set(criticalGuesses), [criticalGuesses])
  const hits = useMemo(
    () => [...guessSet].filter((id) => criticalPlayableIds.has(id)).length,
    [criticalPlayableIds, guessSet],
  )
  const falsePositives = useMemo(
    () => [...guessSet].filter((id) => !criticalPlayableIds.has(id)).length,
    [criticalPlayableIds, guessSet],
  )
  const missed = useMemo(
    () => [...criticalPlayableIds].filter((id) => !guessSet.has(id)).length,
    [criticalPlayableIds, guessSet],
  )

  const visitedCount = visitedNodes.length
  const progressPct = totalPlayableNodes > 0 ? Math.round((visitedCount / totalPlayableNodes) * 100) : 0

  const currentScore = Math.max(
    0,
    hits * 20 - falsePositives * 8 - missed * 5 - hintsUsed * 3 + (isCriticalRouteRevealed ? 0 : 10),
  )

  const hasExplorationFocus = selectedTaskId !== null
  const explorationFocusIds = useMemo(
    () => new Set<string>(selectedTaskId ? [selectedTaskId] : []),
    [selectedTaskId],
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

  const criticalRouteIndexByNodeId = useMemo(
    () => new Map(pertRouteCritical.map((nodeId, index) => [nodeId, index] as const)),
    [],
  )

  const markedCriticalNodeIds = useMemo(() => new Set(criticalGuesses), [criticalGuesses])

  const markedCriticalRouteIndices = useMemo(() => {
    const indices = [...markedCriticalNodeIds]
      .map((id) => criticalRouteIndexByNodeId.get(id))
      .filter((index): index is number => index !== undefined)
      .sort((a, b) => a - b)
    return indices
  }, [criticalRouteIndexByNodeId, markedCriticalNodeIds])

  const inferredCriticalNodeIds = useMemo(() => {
    const ids = new Set<string>()
    if (markedCriticalRouteIndices.length === 0) {
      return ids
    }

    for (const index of markedCriticalRouteIndices) {
      ids.add(pertRouteCritical[index])
    }

    for (let i = 0; i < markedCriticalRouteIndices.length - 1; i += 1) {
      const from = markedCriticalRouteIndices[i]
      const to = markedCriticalRouteIndices[i + 1]
      for (let index = from; index <= to; index += 1) {
        ids.add(pertRouteCritical[index])
      }
    }

    if (ids.has(pertRouteCritical[1])) {
      ids.add(pertRouteCritical[0])
    }

    if (ids.has(pertRouteCritical[pertRouteCritical.length - 2])) {
      ids.add(pertRouteCritical[pertRouteCritical.length - 1])
    }

    return ids
  }, [markedCriticalRouteIndices])

  const markedCriticalEdgeIds = useMemo(() => {
    const ids = new Set<string>()
    for (let index = 0; index < pertRouteCritical.length - 1; index += 1) {
      const source = pertRouteCritical[index]
      const target = pertRouteCritical[index + 1]
      const sourceMarked = markedCriticalNodeIds.has(source)
      const targetMarked = markedCriticalNodeIds.has(target)
      const sourceInferred = inferredCriticalNodeIds.has(source)
      const targetInferred = inferredCriticalNodeIds.has(target)

      if (
        (sourceMarked && targetMarked) ||
        (sourceInferred && targetMarked) ||
        (sourceMarked && targetInferred) ||
        (sourceInferred && targetInferred)
      ) {
        ids.add(`${source}-${target}`)
      }
    }
    return ids
  }, [inferredCriticalNodeIds, markedCriticalNodeIds])

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
            isMarkedCritical: markedCriticalNodeIds.has(task.id),
            isInferredCritical: inferredCriticalNodeIds.has(task.id) && !markedCriticalNodeIds.has(task.id),
            showH: isCriticalRouteRevealed || nodeHints.includes('H'),
            showIL: isCriticalRouteRevealed || nodeHints.includes('IL'),
            showTL: isCriticalRouteRevealed || nodeHints.includes('TL'),
            isPathFocused:
              hasExplorationFocus && exploredGraph.connectedNodeIds.has(task.id),
            isDimmed:
              hasExplorationFocus &&
              !exploredGraph.connectedNodeIds.has(task.id) &&
              !inferredCriticalNodeIds.has(task.id),
          },
          selected: task.id === selectedTaskId,
        }
      }),
    [
      criticalTaskIds,
      hasExplorationFocus,
      exploredGraph.connectedNodeIds,
      isCriticalRouteRevealed,
      inferredCriticalNodeIds,
      markedCriticalNodeIds,
      selectedTaskId,
      revealedHints,
    ],
  )

  const edges = useMemo<Edge[]>(
    () =>
      pertLinksAll.map((link) => {
        const isConnected = hasExplorationFocus && exploredGraph.connectedEdgeIds.has(link.id)
        const isCriticalEdge = isCriticalRouteRevealed && criticalEdgeIds.has(link.id)
        const isMarkedCriticalEdge = markedCriticalEdgeIds.has(link.id)
        const edgeColor = isCriticalEdge
          ? '#dc2626'
          : isMarkedCriticalEdge
            ? '#f59e0b'
          : isConnected
            ? '#38bdf8'
            : 'rgba(148, 163, 184, 0.35)'

        return {
          ...link,
          type: 'smoothstep',
          animated: isCriticalEdge || isMarkedCriticalEdge,
          className: isCriticalEdge
            ? 'edge-critical-revealed'
            : isMarkedCriticalEdge
              ? 'edge-critical-marked'
            : hasExplorationFocus
              ? isConnected
                ? 'edge-path-focus'
                : 'edge-dimmed'
              : 'edge-default',
          style: {
            stroke: edgeColor,
            strokeWidth: isCriticalEdge
              ? 4.2
              : isMarkedCriticalEdge
                ? 3.6
                : isConnected
                  ? 3.2
                  : hasExplorationFocus
                    ? 1.8
                    : 2.5,
          },
          markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor },
        }
      }),
    [
      criticalEdgeIds,
      exploredGraph.connectedEdgeIds,
      hasExplorationFocus,
      isCriticalRouteRevealed,
      markedCriticalEdgeIds,
    ],
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

  const canToggleSelectedAsCritical =
    !!selectedTaskId && playableNodeIds.has(selectedTaskId) && !!currentPlayer
  const selectedIsMarked = !!selectedTaskId && guessSet.has(selectedTaskId)

  function toggleSelectedCriticalGuess() {
    if (!selectedTaskId || !playableNodeIds.has(selectedTaskId) || !currentPlayer) {
      return
    }

    setCriticalGuesses((prev) =>
      prev.includes(selectedTaskId)
        ? prev.filter((id) => id !== selectedTaskId)
        : [...prev, selectedTaskId],
    )
  }

  function submitAttempt() {
    if (!currentPlayer || submitLockRef.current) {
      return
    }

    submitLockRef.current = true
    setIsSubmittingAttempt(true)

    const newEntry: ScoreEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      playerName: currentPlayer,
      score: currentScore,
      hits,
      falsePositives,
      missed,
      hintsUsed,
      visitedPct: progressPct,
      submittedAt: new Date().toLocaleString(),
    }

    setScoreboard((prev) =>
      [...prev, newEntry].sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score
        }
        if (a.hintsUsed !== b.hintsUsed) {
          return a.hintsUsed - b.hintsUsed
        }
        return b.hits - a.hits
      }),
    )
    setLastResult(newEntry)

    window.setTimeout(() => {
      submitLockRef.current = false
      setIsSubmittingAttempt(false)
    }, 500)
  }

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    setSelectedTaskId((prev) => (prev === node.id ? null : node.id))
    if (node.id !== 'Inicio' && node.id !== 'Fin') {
      setVisitedNodes((prev) => (prev.includes(node.id) ? prev : [...prev, node.id]))
    }
  }

  return (
    <section className="grid gap-4 xl:h-full xl:min-h-0 xl:grid-cols-[minmax(0,2.35fr)_360px] xl:overflow-hidden">
      <div className="rounded-[26px] border border-white/10 bg-slate-950/70 p-4 md:p-5 xl:flex xl:min-h-0 xl:flex-col xl:overflow-y-auto xl:pr-3 panel-scroll">
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-400">
              Sección 2 · Juego PERT-CPM
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
              El laberinto de la ruta crítica
            </h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300 md:text-base">
              Exploren el grafo, marquen nodos críticos y envíen su intento para comparar
              puntajes entre participantes.
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

        <div className="h-[72vh] min-h-[460px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.14),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] xl:h-auto xl:min-h-[520px] xl:flex-1">
          <ReactFlow
            className="pert-flow"
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            onPaneClick={() => setSelectedTaskId(null)}
            fitView
            fitViewOptions={{ padding: 0.16 }}
            minZoom={0.35}
            maxZoom={1.4}
            nodesDraggable={false}
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

      <aside className="flex flex-col gap-4 rounded-[26px] border border-white/10 bg-white/[0.04] p-5 md:p-6 xl:min-h-0 xl:overflow-y-auto xl:pr-3 panel-scroll">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
          <button
            type="button"
            onClick={() => setIsGuideOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-lg text-left outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            aria-expanded={isGuideOpen}
            aria-controls={GUIDE_CONTENT_ID}
          >
            <span className="text-xs uppercase tracking-[0.34em] text-slate-400">Guia rapida del nodo PERT</span>
            <span className="inline-flex items-center gap-2 text-[11px] text-slate-400">
              {isGuideOpen ? 'Ocultar' : 'Mostrar'}
              {isGuideOpen ? (
                <ChevronUp className="h-4 w-4 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              )}
            </span>
          </button>

          <div
            id={GUIDE_CONTENT_ID}
            aria-hidden={!isGuideOpen}
            className={`overflow-hidden transition-all duration-200 ease-out ${
              isGuideOpen ? 'mt-2 max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-sm text-slate-300">Mapa rapido de variables del nodo.</p>
            <div className="mt-2">
              <NodeMap />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {nodeLegendItems.map((item) => (
                <div
                  key={item.key}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-xs"
                >
                  <span className={`font-semibold ${item.color}`}>{item.key}</span>
                  <span className="text-slate-500"> · </span>
                  <span className="text-slate-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {!isGuideOpen && (
            <p className="mt-2 text-xs text-slate-500">
              Tip: abre esta guia solo cuando necesites recordar IP, TP, IL, TL, H y t.
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-400">Participante actual</p>
          <div className="mt-3 flex gap-2">
            <input
              value={playerNameDraft}
              onChange={(event) => setPlayerNameDraft(event.target.value)}
              placeholder="Nombre"
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50"
            />
            <button
              type="button"
              onClick={startPlayer}
              className="inline-flex items-center gap-1 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
            >
              <UserPlus className="h-4 w-4" />
              Iniciar
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {currentPlayer ? `Jugando: ${currentPlayer}` : 'Define un nombre para comenzar.'}
          </p>
        </div>

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

          <button
            type="button"
            onClick={toggleSelectedCriticalGuess}
            disabled={!canToggleSelectedAsCritical}
            className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              selectedIsMarked
                ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100'
                : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {selectedIsMarked ? 'Marcado como crítico' : 'Marcar como crítico'}
          </button>

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

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Estado del intento</p>
          <p className="mt-2 text-sm text-slate-300">
            Exploracion: <span className="font-semibold text-white">{visitedCount}</span> / {totalPlayableNodes} ({progressPct}%)
          </p>
          <p className="text-sm text-slate-300">
            Marcados como criticos: <span className="font-semibold text-white">{criticalGuesses.length}</span>
          </p>
          <p className="text-sm text-slate-300">
            Pistas usadas: <span className="font-semibold text-white">{hintsUsed}</span>
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Puntaje actual: <span className="text-lg font-bold text-emerald-300">{currentScore}</span>
          </p>
          <p className="mt-2 rounded-xl border border-emerald-400/15 bg-emerald-400/8 px-3 py-2 text-xs leading-5 text-emerald-100/80">
            {isCriticalRouteRevealed
              ? 'Todos los valores visibles. Esta accion quita el bono de +10 puntos.'
              : 'H, IL y TL ocultos. Cada pista usada descuenta 3 puntos.'}
          </p>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={submitAttempt}
              disabled={!currentPlayer || isSubmittingAttempt}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trophy className="h-4 w-4" />
              {isSubmittingAttempt ? 'Enviando...' : 'Enviar intento'}
            </button>
            <button
              type="button"
              onClick={resetRound}
              title="Reiniciar ronda"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {lastResult && (
            <p className="mt-2 text-xs text-cyan-200">
              Ultimo envio: {lastResult.playerName} obtuvo {lastResult.score} puntos.
            </p>
          )}
        </div>

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
            {selectedNode ? `dia ${selectedNode.IP} -> dia ${selectedNode.TP}` : '-'}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.34em] text-slate-400">Ranking</p>
            <button
              type="button"
              onClick={clearScoreboard}
              className="text-[11px] text-slate-400 transition hover:text-white"
            >
              Limpiar
            </button>
          </div>

          {scoreboard.length === 0 ? (
            <p className="text-xs text-slate-500">Sin intentos registrados.</p>
          ) : (
            <div className="space-y-2">
              {scoreboard.slice(0, 8).map((entry, index) => (
                <div key={entry.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                  <p className="text-xs font-semibold text-white">
                    #{index + 1} {entry.playerName} · {entry.score} pts
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Aciertos: {entry.hits} | Errores: {entry.falsePositives} | Faltantes: {entry.missed}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Pistas: {entry.hintsUsed} | Exploracion: {entry.visitedPct}% | {entry.submittedAt}
                  </p>
                </div>
              ))}
            </div>
          )}
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
  value: number | null
  accent: 'cyan' | 'emerald'
}) {
  const cls = {
    cyan: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100',
    emerald: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
  }[accent]

  return (
    <div className={`rounded-2xl border p-3 ${cls}`}>
      <p className="text-[10px] uppercase tracking-[0.22em] opacity-70">{label}</p>
      <p className="mt-1.5 text-lg font-semibold">{value ?? '—'}</p>
    </div>
  )
}

function HintCard({
  label,
  value,
  shown,
  isCriticalZero,
  disabled,
  onReveal,
}: {
  label: string
  value: number | null
  shown: boolean
  isCriticalZero?: boolean
  disabled?: boolean
  onReveal: () => void
}) {
  if (shown && value !== null) {
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
      disabled={disabled}
      className="flex flex-col gap-1 rounded-2xl border border-amber-400/12 bg-amber-500/5 p-3 text-left transition hover:border-amber-400/30 hover:bg-amber-500/12 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</span>
      <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400/70">
        <Eye className="h-3.5 w-3.5" />
        {disabled ? 'Selecciona un nodo' : 'Ver pista'}
      </span>
    </button>
  )
}

function NodeMap() {
  return (
    <div
      className="flex flex-wrap items-center gap-3 sm:flex-nowrap"
      role="img"
      aria-label="Distribucion de variables dentro del nodo PERT"
    >
      <div className="relative h-[86px] w-[86px] shrink-0 rounded-full border-2 border-slate-500/50 bg-slate-900/60">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-500/50" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-slate-500/50" />

        <span className="absolute left-1/2 top-[7px] -translate-x-1/2 text-[9px] font-bold text-emerald-300">t</span>
        <span className="absolute bottom-[7px] left-1/2 -translate-x-1/2 text-[9px] font-bold text-amber-300">H</span>
        <span className="absolute left-[11px] top-[22px] text-[9px] font-bold text-slate-300">IP</span>
        <span className="absolute right-[11px] top-[22px] text-[9px] font-bold text-slate-300">TP</span>
        <span className="absolute bottom-[21px] left-[11px] text-[9px] font-bold text-amber-300/80">IL</span>
        <span className="absolute bottom-[21px] right-[11px] text-[9px] font-bold text-amber-300/80">TL</span>

        <div className="absolute left-1/2 top-1/2 flex h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-white/15 bg-slate-950 text-[9px] font-bold text-white">
          ID
        </div>
      </div>

      <div className="text-xs leading-5 text-slate-400">
        <p><span className="font-semibold text-cyan-200">IP / TP</span> arriba</p>
        <p><span className="font-semibold text-emerald-200">t</span> centro superior</p>
        <p><span className="font-semibold text-amber-200">H</span> centro inferior</p>
        <p><span className="font-semibold text-white">ID</span> centro</p>
      </div>
    </div>
  )
}
