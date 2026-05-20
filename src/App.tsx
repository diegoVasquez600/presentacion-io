import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CalendarRange,
  ChartNoAxesGantt,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
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
import { pertNodesAll } from './features/pert/pertData'
import presentationVideo from './assets/presentation_io.mp4'
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

type ConclusionSection = 'inicio' | 'pert' | 'gantt' | 'transporte'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('inicio')
  const [creditsCollapsed, setCreditsCollapsed] = useState(true)
  const [openConclusion, setOpenConclusion] = useState<null | ConclusionSection>(null)

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
    <div className="min-h-[100dvh] bg-transparent px-2 py-2 text-slate-100 md:px-5 md:py-5">
      <div className="mx-auto flex min-h-[calc(100dvh-1rem)] max-w-[1800px] flex-col overflow-hidden rounded-[22px] border border-white/10 bg-slate-950/70 shadow-[0_24px_80px_rgba(3,7,18,0.55)] backdrop-blur md:h-[calc(100dvh-2.5rem)] md:min-h-0 md:flex-row md:rounded-[28px]">
        <aside className="flex w-full shrink-0 flex-col justify-between border-b border-white/10 bg-slate-950/90 p-4 md:w-80 md:border-b-0 md:border-r md:p-6">
          <div>
            <div className="mb-4 flex items-center gap-3 md:mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-300 ring-1 ring-inset ring-emerald-400/20 md:h-12 md:w-12">
                <Package2 className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400 md:text-xs md:tracking-[0.36em]">
                  Sitio Web Interactivo
                </p>
                <h1 className="text-lg font-semibold text-white md:text-xl">
                  Plataforma del proyecto
                </h1>
              </div>
            </div>

            <nav className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = tab.id === activeTab

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition md:px-4 md:py-3 ${
                      isActive
                        ? 'border-emerald-400/40 bg-emerald-400/12 text-white shadow-[0_0_0_1px_rgba(74,222,128,0.15)]'
                        : 'border-white/5 bg-white/0 text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    <div>
                      <span className="block text-sm font-medium md:text-base">{tab.label}</span>
                      <span className="hidden text-xs text-slate-400 md:block">
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

          <div className="mt-4 hidden flex-col gap-1.5 md:mt-8 md:flex">
            <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-slate-500">Conclusiones</p>
            {([
              { id: 'inicio', label: 'Inicio · Ecosistema IoT', border: 'border-cyan-400/20', bg: 'bg-cyan-400/8', text: 'text-cyan-200/90' },
              { id: 'pert', label: 'PERT-CPM · Ruta crítica', border: 'border-violet-400/20', bg: 'bg-violet-400/8', text: 'text-violet-200/90' },
              { id: 'gantt', label: 'Gantt · Cronograma', border: 'border-emerald-400/20', bg: 'bg-emerald-400/8', text: 'text-emerald-200/90' },
              { id: 'transporte', label: 'Transporte · VAM', border: 'border-amber-400/20', bg: 'bg-amber-400/8', text: 'text-amber-200/90' },
            ] as const).map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setOpenConclusion(section.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border ${section.border} ${section.bg} px-3 py-2 text-left text-xs font-medium transition hover:brightness-125`}
              >
                <span className={section.text}>{section.label}</span>
                <ChevronRight className="h-3 w-3 shrink-0 text-slate-500" />
              </button>
            ))}
          </div>
        </aside>

        <main className="flex flex-1 flex-col overflow-hidden">
          <header className="border-b border-white/10 bg-slate-950/90 px-3 py-3 md:px-6 md:py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] text-cyan-200/80 md:text-xs md:tracking-[0.32em]">
                  Sustentación final · Investigación de Operaciones
                </p>
                <h1 className="mt-1.5 text-lg font-semibold text-white md:mt-2 md:text-2xl">
                  Plataforma de Planeación, Cronograma y Optimización Energética
                </h1>
              </div>

              <button
                type="button"
                onClick={() => setCreditsCollapsed((currentValue) => !currentValue)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/[0.06] md:px-4 md:text-sm"
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

          <div className="app-scroll flex-1 overflow-auto bg-gradient-to-br from-slate-950/30 via-slate-900/40 to-emerald-950/20 p-3 md:p-6">
            <div className="h-full">{renderView()}</div>
          </div>
        </main>
      </div>
      {openConclusion ? (
        <ConclusionModal section={openConclusion} onClose={() => setOpenConclusion(null)} />
      ) : null}
    </div>
  )
}

function HomeView() {
  const [selectedBlockTitle, setSelectedBlockTitle] = useState<string | null>(null)
  const [isPertMatrixOpen, setIsPertMatrixOpen] = useState(false)
  const [isSectionsRoadmapOpen, setIsSectionsRoadmapOpen] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const selectedBlock =
    ecosystemBlocks.find((block) => block.title === selectedBlockTitle) ?? null
  const pertActivities = pertNodesAll.filter(
    (node) => node.id !== 'Inicio' && node.id !== 'Fin',
  )

  return (
    <section className="flex min-h-0 flex-col gap-6 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 md:min-h-[85vh] md:rounded-[26px] md:p-6">
      <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <article className="h-full rounded-[22px] border border-cyan-300/15 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),rgba(15,23,42,0.4))] p-5 md:p-6">
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            Plataforma Abierta de Datos Agrícolas e IoT.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 md:text-base">
            El objetivo central es diseñar, fabricar y desplegar un ecosistema tecnológico completamente open source (hardware y software), descentralizado y orientado al sector rural. Integra una red LoRaWAN, un UAS multiespectral, administración con Odoo ERP y un motor de inteligencia artificial para predicción climática e interpolación de datos.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPertMatrixOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/15"
            >
              Ver matriz PERT-CPM
            </button>
            <button
              type="button"
              onClick={() => setIsSectionsRoadmapOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100 transition hover:border-emerald-200/50 hover:bg-emerald-300/15"
            >
              Ver secciones 2, 3 y 4
            </button>
            <button
              type="button"
              onClick={() => setIsVideoOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-300/30 bg-violet-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-100 transition hover:border-violet-200/50 hover:bg-violet-300/15"
            >
              <CirclePlay className="h-3.5 w-3.5" />
              Ver video
            </button>
            <span className="text-xs text-cyan-100/80">
              {pertActivities.length} actividades definidas para 1.1, 1.2 y 1.3
            </span>
          </div>
        </article>

        <article className="h-full rounded-[22px] border border-white/10 bg-slate-950/70 p-5 md:p-6">
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

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {ecosystemBlocks.map((block) => {
          const Icon = block.icon

          return (
            <button
              key={block.title}
              type="button"
              onClick={() => setSelectedBlockTitle(block.title)}
              className={`group flex min-h-[240px] flex-col rounded-[22px] border border-white/10 bg-gradient-to-br ${block.tone} p-4 text-left transition hover:-translate-y-0.5 hover:border-white/20 md:min-h-[260px] md:p-5`}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-white md:mb-5 md:h-11 md:w-11">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold leading-tight text-white md:text-[1.9rem]">
                {block.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-200/90 md:text-[1.03rem]">
                {block.subtitle}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {block.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className={`rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-slate-100/90 md:text-[11px] md:tracking-[0.18em] ${index === 2 ? 'hidden md:inline-flex' : 'inline-flex'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-auto pt-4 text-[11px] uppercase tracking-[0.2em] text-cyan-100/80">
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

      {isPertMatrixOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setIsPertMatrixOpen(false)}
        >
          <article
            className="max-h-[88vh] w-full max-w-6xl overflow-auto rounded-3xl border border-white/15 bg-slate-950 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.7)]"
            role="dialog"
            aria-modal="true"
            aria-label="Matriz de actividades PERT-CPM"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/80">
                  Proyecto PERT-CPM · Área de formación
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white md:text-2xl">
                  Estructura de desglose, precedencias y relaciones
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPertMatrixOpen(false)}
                className="rounded-xl border border-white/15 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/30"
              >
                Cerrar
              </button>
            </div>

            <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-xs leading-6 text-cyan-100">
              <p>1.1 Definición del proyecto y EDT con mínimo 20 actividades.</p>
              <p>1.2 Desarrollo de relaciones entre actividades.</p>
              <p>1.3 Decisión de precedencias y secuencias entre actividades.</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="min-w-[1100px] w-full text-left text-xs md:text-sm">
                <thead className="bg-slate-900/90 text-slate-200">
                  <tr>
                    <th className="px-3 py-2 font-semibold">ID</th>
                    <th className="px-3 py-2 font-semibold">Actividad</th>
                    <th className="px-3 py-2 font-semibold">Predecesoras</th>
                    <th className="px-3 py-2 font-semibold">Sucesoras</th>
                    <th className="px-3 py-2 font-semibold">Duración (días)</th>
                    <th className="px-3 py-2 font-semibold">Costo (COP)</th>
                    <th className="px-3 py-2 font-semibold">Recurso</th>
                  </tr>
                </thead>
                <tbody>
                  {pertActivities.map((activity) => (
                    <tr
                      key={activity.id}
                      className="border-t border-white/10 text-slate-200 odd:bg-white/[0.02]"
                    >
                      <td className="px-3 py-2 font-semibold text-cyan-100">{activity.id}</td>
                      <td className="px-3 py-2 leading-6">{activity.actividad}</td>
                      <td className="px-3 py-2">
                        {activity.predecesoras.length > 0
                          ? activity.predecesoras.join(', ')
                          : 'Ninguna'}
                      </td>
                      <td className="px-3 py-2">
                        {activity.sucesoras.length > 0
                          ? activity.sucesoras.join(', ')
                          : 'Ninguna'}
                      </td>
                      <td className="px-3 py-2">{activity.duracionDias}</td>
                      <td className="px-3 py-2">
                        {new Intl.NumberFormat('es-CO').format(activity.costoCOP)}
                      </td>
                      <td className="px-3 py-2">{activity.recurso}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      ) : null}

      {isSectionsRoadmapOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setIsSectionsRoadmapOpen(false)}
        >
          <article
            className="max-h-[88vh] w-full max-w-6xl overflow-auto rounded-3xl border border-white/15 bg-slate-950 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.7)] md:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Hoja de ruta de secciones 2, 3 y 4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-emerald-200/80">
                  Hoja de ruta de sustentación
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white md:text-2xl">
                  Continuidad de secciones del documento maestro
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSectionsRoadmapOpen(false)}
                className="rounded-xl border border-white/15 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/30"
              >
                Cerrar
              </button>
            </div>

            <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-slate-300">
              Resumen para sustentación: esta hoja concentra los entregables críticos del documento maestro y su estado de implementación actual.
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <article className="flex h-full flex-col rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/90">Sección 2</p>
                <h4 className="mt-2 text-lg font-semibold text-white">Juego PERT-CPM</h4>
                <ul className="mt-3 space-y-1.5 text-sm leading-6 text-slate-200">
                  <li>Red completa con nodos Inicio y Fin.</li>
                  <li>Selección de caminos con resaltado contextual.</li>
                  <li>Sistema de puntaje y revelado de ruta crítica.</li>
                </ul>
                <p className="mt-auto pt-3 text-xs uppercase tracking-[0.2em] text-cyan-100/80">Estado: Implementado</p>
              </article>

              <article className="flex h-full flex-col rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-violet-200/90">Sección 3</p>
                <h4 className="mt-2 text-lg font-semibold text-white">Cronograma Gantt</h4>
                <ul className="mt-3 space-y-1.5 text-sm leading-6 text-slate-200">
                  <li>Línea de tiempo con tareas, costo y recurso.</li>
                  <li>Slider de día actual para tareas activas.</li>
                  <li>Tooltips con detalle técnico y predecesoras.</li>
                </ul>
                <p className="mt-auto pt-3 text-xs uppercase tracking-[0.2em] text-violet-100/80">Estado: Implementado</p>
              </article>

              <article className="flex h-full flex-col rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-amber-200/90">Sección 4</p>
                <h4 className="mt-2 text-lg font-semibold text-white">Modelo de Transporte</h4>
                <ul className="mt-3 space-y-1.5 text-sm leading-6 text-slate-200">
                  <li>Matriz 4x3 con validación reactiva oferta/demanda.</li>
                  <li>2.1 Modelo algebraico: función objetivo y restricciones.</li>
                  <li>2.2 Resolución mediante método de aproximación de Vogel (VAM).</li>
                  <li>2.3 Conclusiones técnicas de la actividad y comparación de métodos.</li>
                </ul>
                <p className="mt-auto pt-3 text-xs uppercase tracking-[0.2em] text-amber-100/80">Estado: Implementado</p>
              </article>
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm leading-7 text-emerald-50">
              Este panel permite sustentar rápidamente el avance por secciones del documento maestro, con cobertura explícita de los puntos solicitados por la actividad (incluyendo modelo algebraico, VAM y conclusiones).
            </div>
          </article>
        </div>
      ) : null}

        {isVideoOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
            role="presentation"
            onClick={() => setIsVideoOpen(false)}
          >
            <article
              className="w-full max-w-5xl rounded-3xl border border-white/15 bg-slate-950 p-4 shadow-[0_30px_80px_rgba(2,6,23,0.8)] md:p-5"
              role="dialog"
              aria-modal="true"
              aria-label="Video de presentación"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-violet-300">Presentación del proyecto</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">Plataforma IoT Agrícola</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVideoOpen(false)}
                  className="rounded-xl border border-white/15 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/30"
                >
                  Cerrar
                </button>
              </div>
              <div className="overflow-hidden rounded-2xl bg-black">
                <video
                  src={presentationVideo}
                  controls
                  autoPlay
                  className="aspect-video w-full"
                />
              </div>
            </article>
          </div>
        ) : null}
    </section>
  )
}

function ConclusionModal({
  section,
  onClose,
}: {
  section: ConclusionSection
  onClose: () => void
}) {
  const meta: Record<ConclusionSection, { title: string; accent: string; accentBg: string; accentBorder: string }> = {
    inicio: {
      title: 'Ecosistema IoT · Visión general del proyecto',
      accent: 'text-cyan-300',
      accentBg: 'bg-cyan-400/10',
      accentBorder: 'border-cyan-400/25',
    },
    pert: {
      title: 'PERT-CPM · Red de precedencias y ruta crítica',
      accent: 'text-violet-300',
      accentBg: 'bg-violet-400/10',
      accentBorder: 'border-violet-400/25',
    },
    gantt: {
      title: 'Gantt · Cronograma de 46 días',
      accent: 'text-emerald-300',
      accentBg: 'bg-emerald-400/10',
      accentBorder: 'border-emerald-400/25',
    },
    transporte: {
      title: 'Transporte · Optimización con Vogel (VAM)',
      accent: 'text-amber-300',
      accentBg: 'bg-amber-400/10',
      accentBorder: 'border-amber-400/25',
    },
  }

  const { title, accent, accentBg, accentBorder } = meta[section]

  const criticalNodes = ['Inicio', 'A', 'D', 'E', 'F', 'H', 'J', 'R', 'S', 'T', 'Fin']
  const criticalDurationMap: Record<string, string> = {
    A: '3d', D: '6d', E: '10d', F: '7d', H: '4d', J: '4d', R: '4d', S: '5d', T: '3d',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <article
        className="max-h-[88vh] w-full max-w-3xl overflow-auto rounded-3xl border border-white/15 bg-slate-950 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.7)] md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className={`text-xs uppercase tracking-[0.32em] ${accent}`}>Conclusiones del módulo</p>
            <h3 className="mt-2 text-xl font-semibold text-white md:text-2xl">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl border border-white/15 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/30"
          >
            Cerrar
          </button>
        </div>

        {section === 'inicio' && (
          <div className="space-y-3">
            {[
              'El proyecto integra 4 subsistemas open source: red LoRaWAN, UAS multiespectral, ERP Odoo autoalojado e IA predictiva. Su arquitectura descentralizada garantiza soberanía del dato en zonas rurales.',
              '20 actividades modeladas en la EDT con 46 días de duración total y un presupuesto de $11,350,000 COP. La actividad E (Adquisición de hardware, $3,500,000) concentra el 30.8 % del costo total del proyecto.',
              'La ruta crítica es única: A → D → E → F → H → J → R → S → T (9 actividades, H = 0 en todos sus nodos). Las actividades C (H = 1 día) y G (H = 2 días) forman rutas cuasi-críticas que requieren supervisión prioritaria.',
            ].map((text, index) => (
              <div key={index} className={`flex gap-3 rounded-2xl border ${accentBorder} ${accentBg} p-4`}>
                <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${accent}`} />
                <p className="text-sm leading-7 text-slate-100">{text}</p>
              </div>
            ))}
          </div>
        )}

        {section === 'pert' && (
          <div className="space-y-3">
            <div className={`rounded-2xl border ${accentBorder} ${accentBg} p-4`}>
              <p className={`mb-3 text-xs uppercase tracking-[0.24em] ${accent}`}>
                Ruta crítica · H = 0 en todos sus nodos · 46 días
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {criticalNodes.map((node, index) => [
                  <span
                    key={`node-${node}`}
                    className="rounded-lg border border-violet-400/40 bg-violet-500/20 px-2.5 py-1 text-xs font-semibold text-violet-100"
                  >
                    {node}
                  </span>,
                  index < criticalNodes.length - 1 ? (
                    <ArrowRight key={`arrow-${index}`} className="h-3 w-3 shrink-0 text-slate-500" />
                  ) : null,
                ])}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400">
                {Object.entries(criticalDurationMap).map(([id, dur]) => (
                  <span key={id}>
                    <span className="text-slate-200">{id}</span>: {dur}
                  </span>
                ))}
              </div>
            </div>
            {[
              { Icon: CheckCircle2, color: accent, text: 'La ruta crítica es única. Todos los demás caminos tienen H > 0, confirmando que no existen rutas críticas alternativas en esta red.' },
              { Icon: AlertTriangle, color: 'text-amber-300', text: 'Ruta cuasi-crítica 1 · vía C (H = 1 día): A → C → E → … Un retraso de 1 día en C (Diseño esquemático PCB) convierte este camino en ruta crítica.' },
              { Icon: AlertTriangle, color: 'text-amber-300', text: 'Ruta cuasi-crítica 2 · vía G (H = 2 días): E → G → H → … Un retraso de 2 días en G (Fabricación de PCBs) compromete el nodo H y el cierre del camino principal.' },
              { Icon: CheckCircle2, color: accent, text: 'La actividad E (Adquisición e importación de hardware, $3,500,000 COP) es la de mayor costo y mayor duración (10 días) del camino crítico. Es el punto de mayor riesgo financiero y temporal del proyecto.' },
            ].map(({ Icon, color, text }, index) => (
              <div key={index} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
                <p className="text-sm leading-7 text-slate-100">{text}</p>
              </div>
            ))}
          </div>
        )}

        {section === 'gantt' && (
          <div className="space-y-3">
            <div className={`rounded-2xl border ${accentBorder} ${accentBg} p-4`}>
              <p className={`mb-3 text-xs uppercase tracking-[0.24em] ${accent}`}>
                Actividades críticas (H = 0) visibles en rojo
              </p>
              <div className="flex flex-wrap gap-2">
                {['A', 'D', 'E', 'F', 'H', 'J', 'R', 'S', 'T'].map((id) => (
                  <span
                    key={id}
                    className="rounded-lg border border-red-400/40 bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-200"
                  >
                    {id}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-400">Filtra con «Ver solo Ruta Crítica» para destacarlas en el Gantt</p>
            </div>
            {[
              { Icon: CheckCircle2, color: accent, text: 'Entre los días 3 y 26 hasta 5 actividades corren en paralelo (B, C, D, N y G). Este paralelismo reduce la duración efectiva sin comprometer la ruta crítica.' },
              { Icon: CheckCircle2, color: accent, text: 'El nodo de mayor convergencia es S (días 38–43): las ramas R, Q y P confluyen aquí. Un atraso en cualquiera de estas tres impacta directamente la fecha de cierre del proyecto.' },
              { Icon: AlertTriangle, color: 'text-amber-300', text: 'C (H = 1 día) y G (H = 2 días) tienen holgura mínima. Un cambio de alcance o retraso de proveedor dentro de ese margen convierte estas rutas en críticas y compromete el cierre.' },
              { Icon: CheckCircle2, color: accent, text: 'La actividad E (días 9–19, $3,500,000 COP) define el cuello de botella del proyecto: mayor duración, mayor costo y predecesora directa de toda la rama de fabricación (F, G, H).' },
            ].map(({ Icon, color, text }, index) => (
              <div key={index} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
                <p className="text-sm leading-7 text-slate-100">{text}</p>
              </div>
            ))}
          </div>
        )}

        {section === 'transporte' && (
          <div className="space-y-3">
            <div className={`rounded-2xl border ${accentBorder} ${accentBg} p-4`}>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Costo Mínimo</p>
                  <p className="mt-1 text-2xl font-semibold text-amber-100">6.510</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Vogel (VAM)</p>
                  <p className="mt-1 text-2xl font-semibold text-amber-100">5.970</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Ahorro VAM</p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-300">−540 (8.3 %)</p>
                </div>
              </div>
            </div>
            {[
              { Icon: CheckCircle2, color: accent, text: 'VAM supera a Costo Mínimo en 540 unidades (8.3 %). Vogel penaliza el costo de no elegir la ruta más barata en cada iteración, tomando mejores decisiones iniciales de asignación.' },
              { Icon: CheckCircle2, color: accent, text: 'VAM encontró la solución óptima global: su resultado (5,970) coincide exactamente con el Solver Simplex, confirmando la alta eficacia del método para este problema balanceado.' },
              { Icon: CheckCircle2, color: accent, text: 'El problema está balanceado (oferta = demanda = 450 min), lo que permite aplicar métodos directos sin variables artificiales ni penalizaciones externas.' },
              { Icon: CheckCircle2, color: accent, text: 'Las rutas más eficientes son G1→F1 (c=10) y G2→F2 (c=15). G3 se asigna completamente a F3 (c=12), maximizando el uso de los recursos de menor costo unitario disponibles en la red.' },
            ].map(({ Icon, color, text }, index) => (
              <div key={index} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
                <p className="text-sm leading-7 text-slate-100">{text}</p>
              </div>
            ))}
          </div>
        )}
      </article>
    </div>
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
