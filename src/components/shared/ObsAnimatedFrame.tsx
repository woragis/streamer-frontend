import type { FrameRect } from '@/constants/overlay-frames'

type Props = {
  rect: FrameRect
  theme: 'codes' | 'calisthenics'
  variant: 'camera' | 'chat'
  /** Pulse faster when rest timer is urgent (calisthenics). */
  urgent?: boolean
}

export function ObsAnimatedFrame({ rect, theme, variant, urgent = false }: Props) {
  if (rect.width <= 0 || rect.height <= 0) return null

  const themeClass = theme === 'calisthenics' ? 'obs-frame-cal' : 'obs-frame-codes'
  const variantClass = variant === 'chat' ? 'obs-frame-chat' : 'obs-frame-camera'

  return (
    <div
      className={`obs-frame-root ${themeClass} ${variantClass} ${urgent ? 'obs-frame-urgent' : ''}`}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      }}
    >
      {theme === 'calisthenics' ? (
        <>
          <span className="obs-frame-br obs-frame-tl" />
          <span className="obs-frame-br obs-frame-tr" />
          <span className="obs-frame-br obs-frame-bl" />
          <span className="obs-frame-br obs-frame-br-corner" />
        </>
      ) : null}
      <span className="obs-frame-ring" />
    </div>
  )
}
