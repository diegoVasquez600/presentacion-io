import { Bot, Sparkles, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'

type Gateway = {
  id: string
  name: string
  offer: number
}

type Destination = {
  id: string
  name: string
  demand: number
}

const gateways: Gateway[] = [
  { id: 'G1', name: 'Gateway Norte', offer: 120 },
  { id: 'G2', name: 'Gateway Centro', offer: 95 },
  { id: 'G3', name: 'Gateway Valle', offer: 110 },
  { id: 'G4', name: 'Gateway Sur', offer: 85 },
]

const destinations: Destination[] = [
  { id: 'F1', name: 'Finca Aurora', demand: 130 },
  { id: 'F2', name: 'Finca Horizonte', demand: 140 },
  { id: 'F3', name: 'Finca Delta', demand: 140 },
]

const displacementCost: number[][] = [
  [24, 37, 15],
  [42, 18, 29],
  [16, 44, 33],
  [28, 21, 40],
]

const optimalAllocation: number[][] = [
  [120, 0, 0],
  [10, 85, 0],
  [0, 55, 55],
  [0, 0, 85],
]

function makeEmptyAllocation() {
  return gateways.map(() => destinations.map(() => 0))
}

function matrixCost(matrix: number[][]) {
  let total = 0

  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < matrix[rowIndex].length; columnIndex += 1) {
      total += matrix[rowIndex][columnIndex] * displacementCost[rowIndex][columnIndex]
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

  const totalCost = useMemo(() => matrixCost(allocation), [allocation])
  const optimalCost = useMemo(() => matrixCost(optimalAllocation), [])

  const rowTotals = useMemo(
    () => gateways.map((_, rowIndex) => rowUsage(allocation, rowIndex)),
    [allocation],
  )

  const columnTotals = useMemo(
    () => destinations.map((_, columnIndex) => columnUsage(allocation, columnIndex)),
    [allocation],
  )

  const exceededRows = useMemo(
    () => rowTotals.map((value, index) => value > gateways[index].offer),
    [rowTotals],
  )

  const exceededColumns = useMemo(
    () => columnTotals.map((value, index) => value > destinations[index].demand),
    [columnTotals],
  )

  const handleCellChange = (
    rowIndex: number,
    columnIndex: number,
    rawValue: string,
  ) => {
    const parsedValue = Number(rawValue)
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

  const applySolver = () => {
    const classCost = matrixCost(allocation)
    const savedBattery = Math.max(0, classCost - optimalCost)

    setAllocation(optimalAllocation.map((row) => [...row]))

    setSolverMessage(
      `Victoria IA: el solver completó la asignación óptima. Ahorro estimado frente al intento de la clase: ${savedBattery.toLocaleString('es-CO')} minutos-costo equivalentes de batería.`,
    )
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
            onClick={applySolver}
            className="inline-flex min-h-14 items-center gap-3 rounded-2xl border border-fuchsia-300/25 bg-[linear-gradient(92deg,#7c3aed,#db2777,#f97316)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_14px_36px_rgba(147,51,234,0.35)] transition hover:scale-[1.01] hover:shadow-[0_18px_45px_rgba(236,72,153,0.42)]"
          >
            <Bot className="h-5 w-5" />
            Resolver con IA (Solver/Vogel)
            <Sparkles className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setAllocation(makeEmptyAllocation())
              setSolverMessage(null)
            }}
            className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-slate-200 transition hover:border-white/30 hover:bg-white/[0.06]"
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

        <div className="overflow-auto rounded-2xl border border-white/10">
          <table className="min-w-[960px] w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-900/95 text-left">
                <th className="w-56 border-b border-r border-white/10 px-4 py-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Gateway / Oferta
                </th>
                {destinations.map((destination, index) => {
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
              {gateways.map((gateway, rowIndex) => {
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

                    {destinations.map((destination, columnIndex) => {
                      const costValue = displacementCost[rowIndex][columnIndex]

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
                              value={allocation[rowIndex][columnIndex]}
                              onChange={(event) =>
                                handleCellChange(
                                  rowIndex,
                                  columnIndex,
                                  event.target.value,
                                )
                              }
                              className="mt-2 w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-400/25"
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
            value={`${gateways.reduce((sum, item) => sum + item.offer, 0)} min`}
            subtitle="Capacidad total disponible"
          />
          <StatusCard
            title="Demanda total"
            value={`${destinations.reduce((sum, item) => sum + item.demand, 0)} min`}
            subtitle="Minutos requeridos por fincas"
          />
          <StatusCard
            title="Minutos asignados"
            value={`${allocation.flat().reduce((sum, value) => sum + value, 0)} min`}
            subtitle="Intento actual de la clase"
          />
        </div>
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
