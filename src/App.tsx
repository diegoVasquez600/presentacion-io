import { useState } from 'react'
import {
  CalendarRange,
  ChartNoAxesGantt,
  CirclePlay,
  Gauge,
  Package2,
} from 'lucide-react'
import { DroneOptimizationView } from './features/drone/DroneOptimizationView'
import { GanttView } from './features/gantt/GanttView'
import { PertView } from './features/pert/PertView'
import './App.css'

type TabId = 'inicio' | 'pert' | 'gantt' | 'dron'

const tabs = [
  { id: 'inicio' as const, label: 'Inicio', icon: CirclePlay },
  { id: 'pert' as const, label: 'PERT-CPM (Juego)', icon: CalendarRange },
  { id: 'gantt' as const, label: 'Cronograma Gantt', icon: ChartNoAxesGantt },
  { id: 'dron' as const, label: 'Optimización Dron (Transporte)', icon: Gauge },
]

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('pert')

  const renderView = () => {
    switch (activeTab) {
      case 'inicio':
        return <HomeView />
      case 'pert':
        return <PertView />
      case 'gantt':
        return <GanttView />
      case 'dron':
        return <DroneOptimizationView />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-transparent px-4 py-4 text-slate-100 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 shadow-[0_24px_80px_rgba(3,7,18,0.55)] backdrop-blur xl:min-h-[calc(100vh-3rem)]">
        <aside className="flex w-full shrink-0 flex-col justify-between border-b border-white/10 bg-slate-950/90 p-5 md:w-80 md:border-b-0 md:border-r md:p-6">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
                <Package2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.36em] text-slate-400">
                  Presentacion IO
                </p>
                <h1 className="text-xl font-semibold text-white">
                  Simulador de proyecto
                </h1>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = tab.id === activeTab

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                      isActive
                        ? 'border-emerald-400/40 bg-emerald-400/12 text-white shadow-[0_0_0_1px_rgba(74,222,128,0.15)]'
                        : 'border-white/5 bg-white/0 text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div>
                      <span className="block font-medium">{tab.label}</span>
                      <span className="block text-xs text-slate-400">
                        {tab.id === 'inicio' && 'Portada y narrativa general'}
                        {tab.id === 'pert' && 'Red, nodos, ruta crítica y juego'}
                        {tab.id === 'gantt' && 'Línea de tiempo y seguimiento'}
                        {tab.id === 'dron' && 'Logística, costos y restricciones'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/8 p-4 text-sm text-slate-300">
            <div className="mb-2 flex items-center gap-2 text-cyan-200">
              <CalendarRange className="h-4 w-4" />
              Modo presentación
            </div>
            <p className="leading-6 text-slate-300/90">
              El módulo PERT-CPM ya usa React Flow y queda listo para reemplazar el dataset estático por tu JSON real.
            </p>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="min-h-full bg-gradient-to-br from-slate-950/30 via-slate-900/40 to-emerald-950/20 p-5 md:p-8">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  )
}

function HomeView() {
  return (
    <section className="flex min-h-full flex-col justify-between gap-8 rounded-[26px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="max-w-3xl">
        <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-emerald-200">
          Trabajo universitario
        </span>
        <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-6xl">
          Plataforma visual para explicar planeación, cronograma y optimización.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
          La estructura principal ya está lista para construir cada parte de la presentación como una experiencia interactiva separada. El foco ahora está en profundizar el flujo PERT-CPM y luego conectar tus otros módulos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <HighlightCard
          title="Narrativa clara"
          description="Cada pestaña representa una parte del trabajo y mantiene un contexto visual consistente."
        />
        <HighlightCard
          title="PERT gamificado"
          description="El grafo ahora está listo para revelar la ruta crítica y para recibir tu JSON real de tareas."
        />
        <HighlightCard
          title="Base extensible"
          description="Cronograma Gantt y optimización dron quedan listos para llenarse por etapas sin rehacer el layout."
        />
      </div>
    </section>
  )
}

function HighlightCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <article className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
    </article>
  )
}

export default App
