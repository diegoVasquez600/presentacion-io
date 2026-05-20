import masterData from '../../data/masterData.json'

type MasterNode = {
  id: string
  actividad: string
  predecesoras: string[]
  sucesoras: string[]
  duracionDias: number
  costoCOP: number
  recurso: string
  IP: number
  TP: number
  IL: number
  TL: number
  H: number
  esCritica: boolean
  position: {
    x: number
    y: number
  }
}

type MasterEdge = {
  from: string
  to: string
}

type TransportNode = {
  id: string
  nombre: string
  oferta?: number
  demanda?: number
}

type MasterData = {
  pertCpm: {
    rutaCritica: string[]
    nodos: MasterNode[]
    aristas: MasterEdge[]
  }
  transporte: {
    fuentes: Array<TransportNode & { oferta: number }>
    destinos: Array<TransportNode & { demanda: number }>
    costos: Record<string, Record<string, number>>
    soluciones: {
      solverSimplex: {
        asignacion: Record<string, Record<string, number>>
        costoTotal: number
      }
    }
  }
}

const data = masterData as MasterData

export type PertTask = {
  id: string
  name: string
  description: string
  resource: string
  cost: number
  t: number
  H: number
  IP: number
  TP: number
  IL: number
  TL: number
  predecesoras: string[]
  esCritica: boolean
  position: {
    x: number
    y: number
  }
}

export type PertLink = {
  id: string
  source: string
  target: string
}

export type TransportSource = {
  id: string
  name: string
  offer: number
}

export type TransportDestination = {
  id: string
  name: string
  demand: number
}

export const pertRouteCritical = data.pertCpm.rutaCritica

export const pertNodesAll = data.pertCpm.nodos

export const pertTasks: PertTask[] = data.pertCpm.nodos
  .filter((node) => node.id !== 'Inicio' && node.id !== 'Fin')
  .map((node) => ({
    id: node.id,
    name: node.actividad.split(':')[0] ?? node.actividad,
    description: node.actividad,
    resource: node.recurso,
    cost: node.costoCOP,
    t: node.duracionDias,
    H: node.H,
    IP: node.IP,
    TP: node.TP,
    IL: node.IL,
    TL: node.TL,
    predecesoras: node.predecesoras,
    esCritica: node.esCritica,
    position: node.position,
  }))

export const pertLinks: PertLink[] = data.pertCpm.aristas
  .filter((edge) => edge.from !== 'Inicio' && edge.to !== 'Fin')
  .map((edge) => ({
    id: `${edge.from}-${edge.to}`,
    source: edge.from,
    target: edge.to,
  }))

export const pertLinksAll: PertLink[] = data.pertCpm.aristas.map((edge) => ({
  id: `${edge.from}-${edge.to}`,
  source: edge.from,
  target: edge.to,
}))

export const transportSources: TransportSource[] = data.transporte.fuentes.map(
  (source) => ({
    id: source.id,
    name: source.nombre,
    offer: source.oferta,
  }),
)

export const transportDestinations: TransportDestination[] =
  data.transporte.destinos.map((destination) => ({
    id: destination.id,
    name: destination.nombre,
    demand: destination.demanda,
  }))

export const transportCostMatrix: number[][] = transportSources.map((source) =>
  transportDestinations.map(
    (destination) => data.transporte.costos[source.id][destination.id] ?? 0,
  ),
)

export const transportSolverAllocation: number[][] = transportSources.map(
  (source) =>
    transportDestinations.map(
      (destination) =>
        data.transporte.soluciones.solverSimplex.asignacion[source.id][
          destination.id
        ] ?? 0,
    ),
)

export const transportSolverOptimalCost =
  data.transporte.soluciones.solverSimplex.costoTotal