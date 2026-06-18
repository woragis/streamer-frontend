import type { CSSProperties, ReactNode } from 'react'
import { useObsMode } from '@/hooks/useObsMode'

type Props = {
  label: string
  className?: string
  style?: CSSProperties
  obs?: boolean
  /** Shown in preview mode inside the hole (e.g. mock content). Hidden in OBS. */
  children?: ReactNode
}

export function ObsHole({ label, className = '', style, obs, children }: Props) {
  const isObs = obs ?? useObsMode()

  if (isObs) {
    return (
      <div
        className={`obs-hole obs-hole-transparent ${className}`}
        style={style}
        aria-hidden
      />
    )
  }

  return (
    <div className={`obs-hole obs-hole-preview ${className}`} style={style}>
      <span className="obs-hole-label">{label}</span>
      {children}
    </div>
  )
}
