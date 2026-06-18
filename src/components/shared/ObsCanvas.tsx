import { type ReactNode } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/constants/canvas'
import { useObsScale } from '@/hooks/useObsScale'

interface ObsCanvasProps {
  children: ReactNode
  theme?: 'codes' | 'calisthenics'
  obs?: boolean
  /** Fully transparent canvas (chat overlay route). */
  transparent?: boolean
  className?: string
}

export function ObsCanvas({
  children,
  theme = 'codes',
  obs = false,
  transparent = false,
  className = '',
}: ObsCanvasProps) {
  const bg = transparent
    ? 'bg-transparent'
    : theme === 'codes'
      ? 'bg-codes-bg'
      : 'bg-cal-bg'
  const { scale } = useObsScale(obs)

  const canvas = (
    <div
      className={`relative overflow-hidden ${bg} ${className}`}
      style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
    >
      {children}
    </div>
  )

  if (!obs) {
    return <div className="inline-block overflow-auto">{canvas}</div>
  }

  return (
    <div className="obs-mode obs-fit-screen">
      <div
        className="obs-scale-root"
        style={{
          width: CANVAS_WIDTH * scale,
          height: CANVAS_HEIGHT * scale,
        }}
      >
        <div
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {canvas}
        </div>
      </div>
    </div>
  )
}

interface ObsPreviewProps {
  children: ReactNode
  label: string
}

export function ObsPreview({ children, label }: ObsPreviewProps) {
  const previewScale = 0.32
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <div className="overflow-hidden rounded-lg border border-slate-700 bg-black">
        <div
          className="origin-top-left"
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            transform: `scale(${previewScale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
