import type { ReactNode } from 'react'
import {
  CODES_CHAT_H,
  CODES_CONTENT_GAP,
  CODES_CONTENT_PAD,
  CODES_SIDEBAR_RIGHT_W,
  CODES_WEBCAM_H,
  CODES_WIDGET_GAP,
} from '@/constants/codes-layout'
import { ObsHole } from '@/components/shared/ObsHole'
import { useObsMode } from '@/hooks/useObsMode'

const pad = `${CODES_CONTENT_PAD}px`
const gap = `${CODES_CONTENT_GAP}px`

type ShellProps = {
  children: ReactNode
  className?: string
}

/** Standard content wrapper below header / above footer. */
export function CodesContentShell({ children, className = '' }: ShellProps) {
  return (
    <div
      className={`h-full min-h-0 ${className}`}
      style={{ padding: pad }}
    >
      {children}
    </div>
  )
}

type GridProps = {
  children: ReactNode
  columns: string
  className?: string
}

export function CodesLayoutGrid({ children, columns, className = '' }: GridProps) {
  return (
    <div
      className={`grid h-full min-h-0 ${className}`}
      style={{
        gridTemplateColumns: columns,
        gap,
      }}
    >
      {children}
    </div>
  )
}

type SidebarProps = {
  children?: ReactNode
  showWebcam?: boolean
  showChat?: boolean
  obs?: boolean
  className?: string
}

/** Right sidebar — 340px, widgets scroll, webcam + chat pinned to bottom. */
export function CodesRightSidebar({
  children,
  showWebcam = true,
  showChat = true,
  obs,
  className = '',
}: SidebarProps) {
  const isObs = obs ?? useObsMode()

  return (
    <aside
      className={`flex min-h-0 flex-col overflow-hidden ${className}`}
      style={{ width: CODES_SIDEBAR_RIGHT_W, gap: CODES_WIDGET_GAP }}
    >
      {children && (
        <div
          className="min-h-0 flex-1 space-y-2.5 overflow-y-auto overlay-scroll"
          style={{ gap: CODES_WIDGET_GAP }}
        >
          {children}
        </div>
      )}
      {showWebcam && (
        <ObsWebcamSlot obs={isObs} className={!children ? 'mt-auto' : undefined} />
      )}
      {showChat && <ObsChatSlot obs={isObs} />}
    </aside>
  )
}

export function ObsWebcamSlot({ obs, className = '' }: { obs?: boolean; className?: string }) {
  return (
    <ObsHole
      label="Webcam"
      obs={obs}
      className={`shrink-0 overflow-hidden rounded-lg ${className}`}
      style={{ width: '100%', height: CODES_WEBCAM_H }}
    />
  )
}

export function ObsChatSlot({ obs, className = '' }: { obs?: boolean; className?: string }) {
  return (
    <ObsHole
      label="Live Chat"
      obs={obs}
      className={`shrink-0 overflow-hidden rounded-lg ${className}`}
      style={{ width: '100%', height: CODES_CHAT_H }}
    />
  )
}

/** Full-bleed background slot for future cloud video (Starting Soon / End). */
export function CodesBackgroundVideoSlot({ obs, label = 'Background Video' }: { obs?: boolean; label?: string }) {
  return (
    <ObsHole
      label={label}
      obs={obs}
      className="absolute inset-0 z-0 rounded-none"
    />
  )
}

type OverlayProps = {
  children: ReactNode
  backgroundSlot?: ReactNode
}

/** Stacked layout: background hole + opaque overlay content on top. */
export function CodesLayeredContent({ children, backgroundSlot }: OverlayProps) {
  const obs = useObsMode()
  return (
    <div className="relative h-full min-h-0">
      {backgroundSlot ?? <CodesBackgroundVideoSlot obs={obs} />}
      <div className="relative z-10 h-full min-h-0">{children}</div>
    </div>
  )
}

export function CodesLeftSidebar({
  width,
  children,
  className = '',
}: {
  width: number
  children: ReactNode
  className?: string
}) {
  return (
    <aside
      className={`min-h-0 space-y-2.5 overflow-y-auto overlay-scroll ${className}`}
      style={{ width, gap: CODES_WIDGET_GAP }}
    >
      {children}
    </aside>
  )
}

export function CodesScreenHole({
  label,
  obs,
  className = '',
}: {
  label: string
  obs?: boolean
  className?: string
}) {
  return (
    <ObsHole
      label={label}
      obs={obs}
      className={`min-h-0 overflow-hidden rounded-xl ${className}`}
    />
  )
}
