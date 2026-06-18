import { ObsCanvas } from '@/components/shared/ObsCanvas'
import { ObsAnimatedFrame } from '@/components/shared/ObsAnimatedFrame'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/constants/canvas'
import {
  getCalCameraRect,
  getCalChatRect,
  getCodesChatRect,
  getCodesWebcamRect,
} from '@/constants/overlay-frames'
import { useRestTimer } from '@/hooks/useOverlayData'
import { useAppState } from '@/hooks/useAppStore'
import { useObsMode } from '@/hooks/useObsMode'

function FrameCanvas({
  theme,
  children,
}: {
  theme: 'codes' | 'calisthenics'
  children: React.ReactNode
}) {
  const obs = useObsMode()
  return (
    <ObsCanvas theme={theme} obs={obs} transparent>
      <div
        className="relative"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          background: obs ? 'transparent' : theme === 'calisthenics' ? '#050505' : '#06080c',
        }}
      >
        {!obs && (
          <p className="absolute top-3 left-3 z-10 text-[10px] text-slate-500">
            Moldura OBS — alinhe sobre o buraco correspondente na cena principal.
          </p>
        )}
        {children}
      </div>
    </ObsCanvas>
  )
}

export function CodesCameraFramePage() {
  const rect = getCodesWebcamRect()
  return (
    <FrameCanvas theme="codes">
      <ObsAnimatedFrame rect={rect} theme="codes" variant="camera" />
    </FrameCanvas>
  )
}

export function CodesChatFramePage() {
  const rect = getCodesChatRect()
  return (
    <FrameCanvas theme="codes">
      <ObsAnimatedFrame rect={rect} theme="codes" variant="chat" />
    </FrameCanvas>
  )
}

export function CalisthenicsCameraFramePage() {
  const layout = useAppState().calisthenics.contentLayout
  const rest = useRestTimer()
  const urgent = rest.running && rest.seconds <= 10 && rest.seconds > 0
  const rect = getCalCameraRect(layout)
  return (
    <FrameCanvas theme="calisthenics">
      <ObsAnimatedFrame rect={rect} theme="calisthenics" variant="camera" urgent={urgent} />
    </FrameCanvas>
  )
}

export function CalisthenicsChatFramePage() {
  const rect = getCalChatRect()
  return (
    <FrameCanvas theme="calisthenics">
      <ObsAnimatedFrame rect={rect} theme="calisthenics" variant="chat" />
    </FrameCanvas>
  )
}
