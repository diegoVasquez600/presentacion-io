import { useMemo, useState } from 'react'
import { Activity, Eye, Focus, ListFilter } from 'lucide-react'
import { pertLinks, pertTasks } from '../pert/pertData'

type FilterMode = 'all' | 'critical' | 'active-day'

const MAX_DAY = 46
const DAY_WIDTH = 34

export function GanttView() {
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [currentDay, setCurrentDay] = useState(18)
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null)
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null)

  const predecessorMap = useMemo(() => {
    const map = new Map<string, string[]>()

    for (const task of pertTasks) {
      map.set(task.id, [])
    }

    for (const link of pertLinks) {
      map.set(link.target, [...(map.get(link.target) ?? []), link.source])
    }

    return map
  }, [])

  const focusedChain = useMemo(() => {
    if (!focusedTaskId) {
      return new Set<string>()
    }

    const visited = new Set<string>([focusedTaskId])
    const stack = [focusedTaskId]

    while (stack.length > 0) {
      const currentId = stack.pop()

      if (!currentId) {
        continue
      }

      for (const predecessorId of predecessorMap.get(currentId) ?? []) {
        if (!visited.has(predecessorId)) {
          visited.add(predecessorId)
          stack.push(predecessorId)
        }
      }
    }

    return visited
  }, [focusedTaskId, predecessorMap])

  const filteredTasks = useMemo(() => {
    switch (filterMode) {
      case 'critical':
        return pertTasks.filter((task) => task.H === 0)
      case 'active-day':
        return pertTasks.filter(
          (task) => currentDay > task.IP && currentDay <= task.TP,
        )
      default:
        return pertTasks
    }
  }, [currentDay, filterMode])

  const tooltipTask =
    pertTasks.find((task) => task.id === hoveredTaskId) ?? null

  return (
    <section className="rounded-[26px] border border-white/10 bg-slate-950/65 p-5 md:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-400">
            Cronograma Gantt
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            Timeline interactivo para presentación en vivo
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300 md:text-base">
            El cronograma reutiliza las 20 tareas del PERT y permite explicar ruta crítica, tareas activas por día y flujo de predecesoras sin salir de la misma narrativa visual.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
          <Activity className="h-4 w-4 text-emerald-300" />
          Día actual:
          <span className="rounded-full bg-emerald-400/15 px-3 py-1 font-semibold text-emerald-200">
            {currentDay}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-4 md:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <FilterButton
              icon={ListFilter}
              label="Mostrar Todo"
              isActive={filterMode === 'all'}
              onClick={() => setFilterMode('all')}
            />
            <FilterButton
              icon={Eye}
              label="Ver solo Ruta Crítica"
              isActive={filterMode === 'critical'}
              onClick={() => setFilterMode('critical')}
            />
            <FilterButton
              icon={Focus}
              label="Ver Tareas en Ejecución"
              isActive={filterMode === 'active-day'}
              onClick={() => setFilterMode('active-day')}
            />
          </div>

          <div className="rounded-2xl border border-cyan-400/12 bg-cyan-400/8 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                  Slider interactivo
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Mueve el día actual entre 1 y 46 para resaltar exactamente qué tareas están ejecutándose en ese momento.
                </p>
              </div>
              <div className="min-w-56 flex-1 md:max-w-md">
                <input
                  type="range"
                  min={1}
                  max={MAX_DAY}
                  value={currentDay}
                  onChange={(event) => {
                    setCurrentDay(Number(event.target.value))
                    setFilterMode('active-day')
                  }}
                  className="gantt-slider w-full"
                />
                <div className="mt-2 flex justify-between text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  <span>Día 1</span>
                  <span>Día 23</span>
                  <span>Día 46</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-[22px] border border-white/10 bg-slate-950/80">
          <div className="overflow-auto">
            <div className="flex min-w-[1780px]">
              <div className="sticky left-0 z-20 w-[420px] shrink-0 border-r border-white/10 bg-slate-950/95 backdrop-blur">
                <div className="grid h-14 grid-cols-[70px_1.6fr_120px_130px] items-center border-b border-white/10 bg-slate-900/95 px-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                  <span>ID</span>
                  <span>Nombre</span>
                  <span>Costo</span>
                  <span>Recurso</span>
                </div>

                {filteredTasks.map((task) => {
                  const isFocused = focusedChain.has(task.id)
                  const isDimmed = focusedTaskId !== null && !isFocused
                  const isActiveOnDay = currentDay > task.IP && currentDay <= task.TP

                  return (
                    <button
                      key={`row-${task.id}`}
                      type="button"
                      onClick={() =>
                        setFocusedTaskId((currentValue) =>
                          currentValue === task.id ? null : task.id,
                        )
                      }
                      className={`grid h-[68px] w-full grid-cols-[70px_1.6fr_120px_130px] items-center border-b border-white/6 px-4 text-left transition ${
                        task.H === 0
                          ? 'bg-red-500/[0.07]'
                          : 'bg-slate-950/0'
                      } ${isDimmed ? 'opacity-25' : 'opacity-100'} ${
                        isFocused ? 'ring-1 ring-inset ring-cyan-400/35' : ''
                      } ${isActiveOnDay ? 'shadow-[inset_0_0_0_1px_rgba(34,197,94,0.2)]' : ''}`}
                    >
                      <span className="text-lg font-semibold text-white">{task.id}</span>
                      <span className="pr-3 text-sm leading-6 text-slate-200">{task.name}</span>
                      <span className="text-sm text-slate-300">{formatCurrency(task.cost)}</span>
                      <span className="text-xs leading-5 text-slate-400">{task.resource}</span>
                    </button>
                  )
                })}
              </div>

              <div className="relative flex-1" style={{ width: MAX_DAY * DAY_WIDTH + 40 }}>
                <div className="sticky top-0 z-10 flex h-14 border-b border-white/10 bg-slate-900/95 backdrop-blur">
                  {Array.from({ length: MAX_DAY }, (_, index) => index + 1).map((day) => (
                    <div
                      key={day}
                      className={`flex shrink-0 items-center justify-center border-r border-white/6 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                        day === currentDay ? 'bg-emerald-400/15 text-emerald-200' : 'text-slate-500'
                      }`}
                      style={{ width: DAY_WIDTH }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <div
                    className="pointer-events-none absolute inset-y-0 z-0 border-r-2 border-emerald-300/55"
                    style={{ left: currentDay * DAY_WIDTH }}
                  />

                  {filteredTasks.map((task) => {
                    const predecessors = predecessorMap.get(task.id) ?? []
                    const isFocused = focusedChain.has(task.id)
                    const isDimmed = focusedTaskId !== null && !isFocused
                    const isActiveOnDay = currentDay > task.IP && currentDay <= task.TP
                    const barWidth = Math.max((task.TP - task.IP) * DAY_WIDTH, 18)
                    const barLeft = task.IP * DAY_WIDTH

                    return (
                      <div
                        key={`timeline-${task.id}`}
                        className={`relative h-[68px] border-b border-white/6 ${
                          isDimmed ? 'opacity-15' : 'opacity-100'
                        }`}
                        onMouseEnter={() => setHoveredTaskId(task.id)}
                        onMouseLeave={() => setHoveredTaskId((currentValue) => (currentValue === task.id ? null : currentValue))}
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:34px_100%]" />

                        <button
                          type="button"
                          onClick={() =>
                            setFocusedTaskId((currentValue) =>
                              currentValue === task.id ? null : task.id,
                            )
                          }
                          className={`gantt-bar absolute top-1/2 flex h-10 -translate-y-1/2 items-center rounded-2xl px-4 text-left shadow-[0_8px_24px_rgba(2,6,23,0.35)] transition ${
                            task.H === 0
                              ? 'bg-[linear-gradient(90deg,#ef4444,#ff3b30)] text-white'
                              : 'bg-[linear-gradient(90deg,#2563eb,#38bdf8)] text-white'
                          } ${isFocused ? 'ring-2 ring-white/60' : ''} ${
                            isActiveOnDay ? 'scale-[1.02] shadow-[0_0_0_2px_rgba(34,197,94,0.28),0_12px_30px_rgba(34,197,94,0.24)]' : ''
                          }`}
                          style={{ left: barLeft + 4, width: barWidth - 8 }}
                        >
                          <span className="truncate text-sm font-semibold tracking-[0.04em]">
                            {task.id} · {task.name}
                          </span>
                        </button>

                        <div className="pointer-events-none absolute left-2 top-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          IP {task.IP}
                        </div>
                        <div className="pointer-events-none absolute right-2 top-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          TP {task.TP}
                        </div>
                        <div className="pointer-events-none absolute bottom-2 left-3 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                          Predecesoras: {predecessors.length > 0 ? predecessors.join(', ') : 'Ninguna'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {tooltipTask ? (
            <div className="pointer-events-none absolute right-5 top-5 z-30 w-80 rounded-3xl border border-white/10 bg-slate-950/95 p-4 shadow-[0_22px_60px_rgba(2,6,23,0.55)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Tooltip de tarea
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {tooltipTask.id} · {tooltipTask.name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {tooltipTask.description}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <TooltipMetric label="Duración exacta" value={`${tooltipTask.t} días`} />
                <TooltipMetric label="Holgura" value={`${tooltipTask.H} días`} />
                <TooltipMetric
                  label="Predecesoras"
                  value={(predecessorMap.get(tooltipTask.id) ?? []).join(', ') || 'Ninguna'}
                />
                <TooltipMetric label="Recurso" value={tooltipTask.resource} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function FilterButton({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: typeof Activity
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
        isActive
          ? 'border-emerald-400/35 bg-emerald-400/12 text-white'
          : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function TooltipMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-100">{value}</p>
    </div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}