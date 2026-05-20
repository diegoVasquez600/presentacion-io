import { useState } from 'react'
import {
  BrainCircuit,
  CalendarRange,
  ChevronDown,
  ChevronUp,
  ChartNoAxesGantt,
  CloudSun,
  CirclePlay,
  Gauge,
  Helicopter,
  Package2,
  RadioTower,
  Server,
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

const teamCredits = [
  {
    name: 'Diego Alejandro Rios Vasquez',
    area: 'Ingeniería de Software',
    country: 'Colombia',
  },
  {
    name: 'Geraldine Asprilla Martinez',
    area: 'Ingeniería de Software',
    country: 'Colombia',
  },
  {
    name: 'Elkin Rafael Zapa Perez',
    area: 'Profesor de Investigación de Operaciones',
    country: 'Colombia',
  },
]

const ecosystemBlocks = [
  {
    title: 'Nodos Terrestres LoRaWAN',
    subtitle: 'Monitoreo de suelo y clima tipo SIATA',
    icon: RadioTower,
    tone: 'from-cyan-500/20 to-sky-500/5',
    tags: ['Sensores ambientales', 'Telemetría comunitaria', 'Cobertura rural'],
    detail:
      'La red de nodos LoRaWAN permite una contribución abierta por parte de campesinos y productores, inyectando datos de suelo y clima al portal de libre acceso con cobertura extensa y bajo consumo energético.',
    impact:
      'Fortalece la democratización del dato agrícola y habilita monitoreo continuo en territorios rurales.',
  },
  {
    title: 'Vehículo Aéreo no Tripulado (UAS)',
    subtitle: 'UAS open-source para captura multiespectral',
    icon: Helicopter,
    tone: 'from-violet-500/20 to-fuchsia-500/5',
    tags: ['Vuelo autónomo', 'Mapeo de cultivos', 'Imágenes de alta resolución'],
    detail:
      'El UAS de arquitectura open-source facilita la captura de imágenes multiespectrales para evaluar salud del cultivo, variabilidad espacial y eventos de riesgo, integrando monitoreo aéreo dentro del flujo productivo.',
    impact:
      'Aumenta la capacidad de inspección técnica y mejora la detección temprana en campo.',
  },
  {
    title: 'Núcleo de Gestión Descentralizado',
    subtitle: 'Instancia Odoo ERP autoalojada en VPS',
    icon: Server,
    tone: 'from-emerald-500/20 to-lime-500/5',
    tags: ['Seguridad local', 'Backoffice técnico', 'Operación trazable'],
    detail:
      'La administración de recursos se soporta en un servidor VPS con Odoo ERP para gestionar producción, logística y trazabilidad operativa dentro de una arquitectura descentralizada.',
    impact:
      'Optimiza coordinación operativa y control de recursos durante el despliegue piloto.',
  },
  {
    title: 'Capa de Inteligencia Artificial',
    subtitle: 'Interpolación estadística y analítica predictiva',
    icon: BrainCircuit,
    tone: 'from-amber-500/20 to-orange-500/5',
    tags: ['Predicción climática', 'Detección temprana', 'Apoyo a decisiones'],
    detail:
      'El motor de IA integra datos de nodos y del UAS para predicción climática e interpolación estadística, publicando resultados en una interfaz web abierta orientada al productor agrícola.',
    impact:
      'Convierte datos distribuidos en información accionable para decisiones agronómicas.',
  },
]

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('inicio')
  const [creditsCollapsed, setCreditsCollapsed] = useState(true)

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
    <div className="min-h-screen bg-transparent px-3 py-3 text-slate-100 md:px-5 md:py-5">
      <div className="mx-auto flex h-[calc(100vh-1.5rem)] max-w-[1800px] overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 shadow-[0_24px_80px_rgba(3,7,18,0.55)] backdrop-blur md:h-[calc(100vh-2.5rem)]">
        <aside className="flex w-full shrink-0 flex-col justify-between border-b border-white/10 bg-slate-950/90 p-5 md:w-80 md:border-b-0 md:border-r md:p-6">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
                <Package2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.36em] text-slate-400">
                  Sitio Web Interactivo
                </p>
                <h1 className="text-xl font-semibold text-white">
                  Plataforma del proyecto
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

        <main className="flex flex-1 flex-col overflow-hidden">
          <header className="border-b border-white/10 bg-slate-950/90 px-4 py-4 md:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/80">
                  Sustentación final · Investigación de Operaciones
                </p>
                <h1 className="mt-2 text-xl font-semibold text-white md:text-2xl">
                  Plataforma de Planeación, Cronograma y Optimización Energética
                </h1>
              </div>

              <button
                type="button"
                onClick={() => setCreditsCollapsed((currentValue) => !currentValue)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/[0.06]"
              >
                Créditos del equipo
                {creditsCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>
            </div>

            {!creditsCollapsed ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {teamCredits.map((member) => (
                  <article
                    key={`${member.name}-${member.area}`}
                    className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-white">{member.name}</p>
                    <p className="mt-2 text-xs text-slate-300">{member.area}</p>
                    <p className="mt-1 text-xs text-slate-400">{member.country}</p>
                  </article>
                ))}
              </div>
            ) : null}
          </header>

          <div className="app-scroll flex-1 overflow-auto bg-gradient-to-br from-slate-950/30 via-slate-900/40 to-emerald-950/20 p-4 md:p-6">
            <div className="h-full">{renderView()}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

function HomeView() {
  const [selectedBlockTitle, setSelectedBlockTitle] = useState<string | null>(null)

  const selectedBlock =
    ecosystemBlocks.find((block) => block.title === selectedBlockTitle) ?? null

  return (
    <section className="flex h-full min-h-[85vh] flex-col gap-6 rounded-[26px] border border-white/10 bg-white/[0.03] p-5 md:p-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <article className="rounded-[22px] border border-cyan-300/15 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),rgba(15,23,42,0.4))] p-5 md:p-6">
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            Plataforma Abierta de Datos Agrícolas e IoT.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 md:text-base">
            El objetivo central es diseñar, fabricar y desplegar un ecosistema tecnológico completamente open source (hardware y software), descentralizado y orientado al sector rural. Integra una red LoRaWAN, un UAS multiespectral, administración con Odoo ERP y un motor de inteligencia artificial para predicción climática e interpolación de datos.
          </p>
        </article>

        <article className="rounded-[22px] border border-white/10 bg-slate-950/70 p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2 text-emerald-200">
            <CloudSun className="h-5 w-5" />
            Resumen operativo
          </div>
          <div className="space-y-3 text-sm">
            <HighlightPill label="Datos de campo" value="Sincronización activa" />
            <HighlightPill label="Cobertura LoRa" value="4 Gateways operativos" />
            <HighlightPill label="Procesamiento IA" value="Modelo listo para inferencia" />
            <HighlightPill label="Panel ERP" value="Instancia segura en VPS" />
          </div>
        </article>
      </div>

      <div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ecosystemBlocks.map((block) => {
          const Icon = block.icon

          return (
            <button
              key={block.title}
              type="button"
              onClick={() => setSelectedBlockTitle(block.title)}
              className={`group flex h-full min-h-[280px] flex-col rounded-[22px] border border-white/10 bg-gradient-to-br ${block.tone} p-5 text-left transition hover:-translate-y-0.5 hover:border-white/20`}
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">{block.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-200/90">
                {block.subtitle}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {block.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-100/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-4 text-[11px] uppercase tracking-[0.2em] text-cyan-100/80">
                Clic para ampliar
              </span>
            </button>
          )
        })}
      </div>

      {selectedBlock ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setSelectedBlockTitle(null)}
        >
          <article
            className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-3xl border border-white/15 bg-slate-950 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.7)]"
            role="dialog"
            aria-modal="true"
            aria-label={`Detalle ${selectedBlock.title}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/80">
                Detalle técnico
              </p>
              <button
                type="button"
                onClick={() => setSelectedBlockTitle(null)}
                className="rounded-xl border border-white/15 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/30"
              >
                Cerrar
              </button>
            </div>

            <h3 className="text-2xl font-semibold text-white">{selectedBlock.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{selectedBlock.subtitle}</p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Descripción</p>
              <p className="mt-3 text-sm leading-7 text-slate-200">{selectedBlock.detail}</p>
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/90">Impacto</p>
              <p className="mt-3 text-sm leading-7 text-emerald-50">{selectedBlock.impact}</p>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  )
}

function HighlightPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  )
}

export default App
