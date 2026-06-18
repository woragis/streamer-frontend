import { CAL_CONTENT_GAP } from '@/constants/cal-layout'
import { getCalCameraRect } from '@/constants/overlay-frames'
import { ObsHole } from '@/components/shared/ObsHole'
import { CalisthenicsReactFeed } from '@/components/calisthenics/CalisthenicsReactFeed'
import { useObsMode } from '@/hooks/useObsMode'
import type { CalContentLayout } from '@/stores/types'

type Props = {
  layout: CalContentLayout
}

export function CalContentZone({ layout }: Props) {
  const obs = useObsMode()
  const pipRect = getCalCameraRect('react-primary')

  if (layout === 'workout-only') {
    return (
      <ObsHole
        label="Camera / Workout"
        obs={obs}
        className="h-full min-h-0 overflow-hidden rounded-xl"
      />
    )
  }

  if (layout === 'split') {
    return (
      <div
        className="grid h-full min-h-0"
        style={{ gridTemplateColumns: '1fr 1fr', gap: CAL_CONTENT_GAP }}
      >
        <ObsHole label="Camera" obs={obs} className="min-h-0 overflow-hidden rounded-xl" />
        <div className="min-h-0 overflow-hidden rounded-xl">
          {obs ? <div className="h-full w-full" aria-hidden /> : <CalisthenicsReactFeed />}
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-0">
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        {obs ? <div className="h-full w-full" aria-hidden /> : <CalisthenicsReactFeed />}
      </div>
      <ObsHole
        label="Camera PiP"
        obs={obs}
        className="absolute z-10 overflow-hidden rounded-lg shadow-lg"
        style={{
          left: 16,
          bottom: 16,
          width: pipRect.width,
          height: pipRect.height,
        }}
      />
    </div>
  )
}

export function calContentLayoutLabel(layout: CalContentLayout): string {
  switch (layout) {
    case 'workout-only':
      return 'Treino — câmera full'
    case 'react-primary':
      return 'React grande + câmera PiP'
    case 'split':
      return 'Split ~50/50'
  }
}
