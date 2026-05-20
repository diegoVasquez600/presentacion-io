import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'

export type PertNodeData = {
  id: string
  t: string
  H: string
  IP: string
  TP: string
  IL: string
  TL: string
  isCritical: boolean
}

const hiddenHandleStyle = {
  width: 10,
  height: 10,
  opacity: 0,
  border: 0,
  background: 'transparent',
}

export function CustomPertNode({
  data,
  selected,
}: NodeProps<Node<PertNodeData, 'pert'>>) {
  return (
    <>
      <Handle type="target" position={Position.Left} style={hiddenHandleStyle} />

      <div
        className={`pert-node-shell ${selected ? 'is-selected' : ''} ${
          data.isCritical ? 'is-critical' : ''
        }`}
      >
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-400/80" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-slate-400/80" />

        <span className="absolute left-1/2 top-3 -translate-x-1/2 text-sm font-semibold text-emerald-200">
          {data.t}
        </span>
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-sm font-semibold text-amber-200">
          {data.H}
        </span>
        <span className="absolute left-[24%] top-[27%] -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-slate-200">
          {data.IP}
        </span>
        <span className="absolute left-[76%] top-[27%] -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-slate-200">
          {data.TP}
        </span>
        <span className="absolute left-[24%] top-[73%] -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-slate-200">
          {data.IL}
        </span>
        <span className="absolute left-[76%] top-[73%] -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-slate-200">
          {data.TL}
        </span>

        <div className="absolute left-1/2 top-1/2 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-white/10 bg-slate-950 text-xl font-bold text-white shadow-[0_10px_30px_rgba(2,6,23,0.55)]">
          {data.id}
        </div>
      </div>

      <Handle type="source" position={Position.Right} style={hiddenHandleStyle} />
    </>
  )
}