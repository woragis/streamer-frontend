import { type ReactNode } from 'react'

interface ObsCanvasProps {
  children: ReactNode
  theme?: 'codes' | 'calisthenics'
  obs?: boolean
  className?: string
}

export function ObsCanvas({
  children,
  theme = 'codes',
  obs = false,
  className = '',
}: ObsCanvasProps) {
  const bg = theme === 'codes' ? 'bg-codes-bg' : 'bg-cal-bg'

  return (
    <div className={obs ? 'obs-mode' : ''}>
      <div
        className={`relative h-[1080px] w-[1920px] overflow-hidden ${bg} ${className}`}
      >
        {children}
      </div>
    </div>
  )
}

interface ObsPreviewProps {
  children: ReactNode
  label: string
}

export function ObsPreview({ children, label }: ObsPreviewProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <div className="overflow-hidden rounded-lg border border-slate-700 bg-black">
        <div
          className="origin-top-left scale-[0.35]"
          style={{ width: 1920, height: 1080 }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
