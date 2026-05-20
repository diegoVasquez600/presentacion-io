import { BookOpen, CheckCircle2, Sigma, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import { InlineMath, BlockMath } from 'react-katex'
import {
  transportCostMatrix,
  transportDestinations,
  transportSolverOptimalCost,
  transportSources,
} from '../pert/pertData'
import 'katex/dist/katex.min.css'

function makeEmptyAllocation() {
  return transportSources.map(() => transportDestinations.map(() => 0))
}

const costMinimumAllocation = [
  [120, 0, 0],
  [0, 120, 30],
  [0, 0, 100],
  [10, 50, 20],
]

const vogelAllocation = [
  [120, 0, 0],
  [0, 150, 0],
  [0, 0, 100],
  [10, 20, 50],
]

function matrixCost(matrix: number[][]) {
  let total = 0

  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < matrix[rowIndex].length; columnIndex += 1) {
      total += matrix[rowIndex][columnIndex] * transportCostMatrix[rowIndex][columnIndex]
    }
  }

  return total
}

function rowUsage(matrix: number[][], rowIndex: number) {
  return matrix[rowIndex].reduce((sum, value) => sum + value, 0)
}

function columnUsage(matrix: number[][], columnIndex: number) {
  return matrix.reduce((sum, row) => sum + row[columnIndex], 0)
}

export function DroneOptimizationView() {
  const [allocation, setAllocation] = useState<number[][]>(() => makeEmptyAllocation())
  const [solverMessage, setSolverMessage] = useState<string | null>(null)
  const [activeMethod, setActiveMethod] = useState<'manual' | 'min-cost' | 'vam'>('manual')

  const totalCost = useMemo(() => matrixCost(allocation), [allocation])
  const optimalCost = useMemo(() => transportSolverOptimalCost, [])

  const rowTotals = useMemo(
    () => transportSources.map((_, rowIndex) => rowUsage(allocation, rowIndex)),
    [allocation],
  )

  const columnTotals = useMemo(
    () =>
      transportDestinations.map((_, columnIndex) =>
        columnUsage(allocation, columnIndex),
      ),
    [allocation],
  )

  const exceededRows = useMemo(
    () => rowTotals.map((value, index) => value > transportSources[index].offer),
    [rowTotals],
  )

  const exceededColumns = useMemo(
    () =>
      columnTotals.map(
        (value, index) => value > transportDestinations[index].demand,
      ),
    [columnTotals],
  )

  const handleCellChange = (
    rowIndex: number,
    columnIndex: number,
    rawValue: string,
  ) => {
    const digitsOnly = rawValue.replace(/\D+/g, '')
    const normalizedDigits = digitsOnly.replace(/^0+(?=\d)/, '')
    const parsedValue = normalizedDigits === '' ? 0 : Number(normalizedDigits)
    const safeValue = Number.isNaN(parsedValue)
      ? 0
      : Math.max(0, Math.floor(parsedValue))

    setAllocation((currentAllocation) =>
      currentAllocation.map((row, rIndex) =>
        row.map((cellValue, cIndex) => {
          if (rIndex === rowIndex && cIndex === columnIndex) {
            return safeValue
          }

          return cellValue
        }),
      ),
    )

    setSolverMessage(null)
  }



  const applyCostMinimum = () => {
    setAllocation(costMinimumAllocation.map((row) => [...row]))
    setActiveMethod('min-cost')
    setSolverMessage('Método de Costo Mínimo cargado. Costo total: 6510 minutos-costo.')
  }

  const applyVogel = () => {
    setAllocation(vogelAllocation.map((row) => [...row]))
    setActiveMethod('vam')
    setSolverMessage('Método de Aproximación de Vogel (VAM) cargado. Costo total: 5970 minutos-costo (más óptimo que Costo Mínimo).')
  }

  return (
    <section className="rounded-[26px] border border-white/10 bg-slate-950/65 p-5 md:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-400">
            Optimización Dron (Transporte)
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            Minijuego de asignación de batería con matriz de transporte
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300 md:text-base">
            La clase asigna minutos de batería desde los gateways hacia las fincas. El objetivo es cumplir oferta y demanda con el menor costo total de desplazamiento.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <MetricCard label="Costo Total" value={formatCost(totalCost)} tone="cyan" />
          <MetricCard label="Costo Óptimo IA" value={formatCost(optimalCost)} tone="emerald" />
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-4 md:p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={applyCostMinimum}
            className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] transition md:text-xs ${
              activeMethod === 'min-cost'
                ? 'border-cyan-300/50 bg-cyan-500/16 text-cyan-100'
                : 'border-white/15 bg-white/[0.03] text-slate-200 hover:border-white/30 hover:bg-white/[0.06]'
            }`}
          >
            <Sigma className="h-4 w-4" />
            Método Costo Mínimo
          </button>

          <button
            type="button"
            onClick={applyVogel}
            className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] transition md:text-xs ${
              activeMethod === 'vam'
                ? 'border-amber-300/50 bg-amber-500/16 text-amber-100'
                : 'border-white/15 bg-white/[0.03] text-slate-200 hover:border-white/30 hover:bg-white/[0.06]'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Aproximación de Vogel
          </button>

          <button
            type="button"
            onClick={() => {
              setAllocation(makeEmptyAllocation())
              setSolverMessage(null)
              setActiveMethod('manual')
            }}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-slate-200 transition hover:border-white/30 hover:bg-white/[0.06]"
          >
            Reiniciar intento
          </button>
        </div>

        {solverMessage ? (
          <div className="mb-4 rounded-2xl border border-emerald-300/30 bg-emerald-400/12 p-4 text-sm leading-7 text-emerald-100">
            <div className="mb-1 flex items-center gap-2 text-emerald-200">
              <Zap className="h-4 w-4" />
              Resultado del solver
            </div>
            {solverMessage}
          </div>
        ) : null}

        <div className="transport-scroll overflow-auto rounded-2xl border border-white/10">
          <table className="min-w-[960px] w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-900/95 text-left">
                <th className="w-56 border-b border-r border-white/10 px-4 py-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Gateway / Oferta
                </th>
                {transportDestinations.map((destination, index) => {
                  const isExceeded = exceededColumns[index]

                  return (
                    <th
                      key={destination.id}
                      className={`w-52 border-b border-r border-white/10 px-4 py-3 ${
                        isExceeded ? 'bg-red-500/15' : ''
                      }`}
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {destination.id}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {destination.name}
                      </p>
                      <p className="mt-2 text-xs text-cyan-200">
                        Demanda: {destination.demand} min
                      </p>
                      <p className="text-xs text-slate-300">
                        Asignado: {columnTotals[index]} min
                      </p>
                    </th>
                  )
                })}
                <th className="w-48 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Estado fila
                </th>
              </tr>
            </thead>

            <tbody>
              {transportSources.map((gateway, rowIndex) => {
                const isRowExceeded = exceededRows[rowIndex]
                const rowAssigned = rowTotals[rowIndex]

                return (
                  <tr key={gateway.id} className="bg-slate-950/80">
                    <td
                      className={`border-b border-r border-white/10 px-4 py-3 align-top ${
                        isRowExceeded ? 'bg-red-500/10' : ''
                      }`}
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        {gateway.id}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">{gateway.name}</p>
                      <p className="mt-2 text-xs text-emerald-200">
                        Oferta: {gateway.offer} min
                      </p>
                      <p className="text-xs text-slate-300">
                        Asignado: {rowAssigned} min
                      </p>
                    </td>

                    {transportDestinations.map((destination, columnIndex) => {
                      const costValue = transportCostMatrix[rowIndex][columnIndex]

                      return (
                        <td
                          key={`${gateway.id}-${destination.id}`}
                          className="border-b border-r border-white/10 p-3"
                        >
                          <div className="relative rounded-xl border border-white/10 bg-white/[0.03] p-3">
                            <span className="absolute right-2 top-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                              c={costValue}
                            </span>
                            <label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                              Minutos
                            </label>
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={String(allocation[rowIndex][columnIndex])}
                              onChange={(event) =>
                                handleCellChange(
                                  rowIndex,
                                  columnIndex,
                                  event.target.value,
                                )
                              }
                              className="transport-number-input mt-2 w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-400/25"
                            />
                          </div>
                        </td>
                      )
                    })}

                    <td className="border-b border-white/10 px-4 py-3 text-xs">
                      {isRowExceeded ? (
                        <span className="rounded-full bg-red-500/20 px-3 py-1 font-semibold uppercase tracking-[0.18em] text-red-100">
                          Exceso
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 font-semibold uppercase tracking-[0.18em] text-emerald-100">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <StatusCard
            title="Oferta total"
            value={`${transportSources.reduce((sum, item) => sum + item.offer, 0)} min`}
            subtitle="Capacidad total disponible"
          />
          <StatusCard
            title="Demanda total"
            value={`${transportDestinations.reduce((sum, item) => sum + item.demand, 0)} min`}
            subtitle="Minutos requeridos por fincas"
          />
          <StatusCard
            title="Minutos asignados"
            value={`${allocation.flat().reduce((sum, value) => sum + value, 0)} min`}
            subtitle="Intento actual de la clase"
          />
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <article className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/90">
              Punto 2 · Modelo algebraico de transporte
            </p>
            <div className="mt-3 space-y-3 text-sm leading-7 text-slate-100">
              <p>
                <strong>Función objetivo:</strong> minimizar el costo total de asignación
                entre gateways y fincas.
              </p>
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/70 p-4">
                <BlockMath math={"\\text{Minimizar} \\quad Z = \\sum_i \\sum_j c_{ij} \\cdot x_{ij}"} />
              </div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Sujeto a restricciones:</p>
              <div className="space-y-2 rounded-xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-6">
                <div className="overflow-x-auto">
                  <BlockMath math={"\\sum_j x_{ij} \\leq \\text{oferta}_i \\quad \\forall i"} />
                </div>
                <div className="overflow-x-auto">
                  <BlockMath math={"\\sum_i x_{ij} = \\text{demanda}_j \\quad \\forall j"} />
                </div>
                <div className="overflow-x-auto">
                  <BlockMath math={"x_{ij} \\geq 0"} />
                </div>
              </div>
              <p>
                Donde <InlineMath math={"x_{ij}"} /> representa minutos enviados desde el Gateway <InlineMath math={"i"} /> hacia la
                Finca <InlineMath math={"j"} />, y <InlineMath math={"c_{ij}"} /> es el costo unitario de transporte.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200/90">
              Método de Aproximación de Vogel (2.2)
            </p>
            <div className="mt-3 space-y-2 text-sm leading-7 text-slate-100">
              <p>
                VAM calcula penalizaciones por fila y columna para priorizar las celdas con
                mayor impacto en costo antes de asignar.
              </p>
              <p>
                En esta vista puedes cargar una solución VAM con el botón
                <strong> Aproximación de Vogel</strong> y compararla contra Costo Mínimo y Solver.
              </p>
              <p>
                <strong>Costo actual del plan cargado:</strong>{' '}
                {formatCost(matrixCost(activeMethod === 'vam' ? vogelAllocation : allocation))}
              </p>
            </div>
          </article>
        </div>

        <article className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/90">
            2.3 Conclusiones de la actividad
          </p>
          <div className="mt-3 grid gap-2 text-sm leading-7 text-emerald-50 md:grid-cols-3">
            <p className="rounded-xl border border-emerald-300/20 bg-emerald-950/35 p-3">
              <CheckCircle2 className="mb-2 h-4 w-4 text-emerald-300" />
              El modelado algebraico permite justificar técnica y cuantitativamente cada
              decisión de asignación energética desde gateways hacia fincas.
            </p>
            <p className="rounded-xl border border-emerald-300/20 bg-emerald-950/35 p-3">
              <CheckCircle2 className="mb-2 h-4 w-4 text-emerald-300" />
              La Aproximación de Vogel (VAM) es más óptima que Costo Mínimo:
              VAM = 5970 vs Costo Mínimo = 6510. Diferencia: 540 unidades de ahorro.
            </p>
            <p className="rounded-xl border border-emerald-300/20 bg-emerald-950/35 p-3">
              <CheckCircle2 className="mb-2 h-4 w-4 text-emerald-300" />
              Comparar métodos heurísticos mejora la comprensión de soluciones
              factibles vs óptimas en problemas de transporte balanceados.
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'cyan' | 'emerald'
}) {
  const toneClass =
    tone === 'cyan'
      ? 'border-cyan-300/25 bg-cyan-400/12 text-cyan-100'
      : 'border-emerald-300/25 bg-emerald-400/12 text-emerald-100'

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <p className="text-[11px] uppercase tracking-[0.2em] opacity-80">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  )
}

function StatusCard({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string
  subtitle: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </div>
  )
}

function formatCost(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}
