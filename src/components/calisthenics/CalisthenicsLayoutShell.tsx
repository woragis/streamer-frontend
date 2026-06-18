import type { ReactNode } from 'react'
import { CAL_CONTENT_GAP, CAL_SIDEBAR_RIGHT_W, CAL_WIDGET_GAP } from '@/constants/cal-layout'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/constants/canvas'
import { ObsChatSlot } from '@/components/codes/CodesLayoutShell'

export function CalisthenicsShell({
  children,
  footer,
  status = 'LIVE',
}: {
  children: ReactNode
  footer: ReactNode
  status?: string
}) {
  return (
    <div
      className="cal-noise flex flex-col bg-cal-bg"
      style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
    >
      <CalisthenicsHeader status={status} />
      <div className="min-h-0 flex-1">{children}</div>
      {footer}
    </div>
  )
}

function CalisthenicsHeader({ status }: { status: string }) {
  return (
    <header className="flex h-[48px] shrink-0 items-center justify-between border-b border-cal-border bg-cal-panel/90 px-6">
      <div className="font-display text-[28px] leading-none tracking-wider text-white">W</div>
      <span className="font-display text-[14px] tracking-[0.18em] text-cal-muted uppercase">
        Woragis Calisthenics
      </span>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-500 pulse-live" />
        <span className="text-[11px] font-bold tracking-wider text-white uppercase">{status}</span>
      </div>
    </header>
  )
}

export function CalisthenicsContentShell({ children }: { children: ReactNode }) {
  return <div className="h-full min-h-0 p-3">{children}</div>
}

export function CalisthenicsLayoutGrid({
  children,
  columns,
  className = '',
}: {
  children: ReactNode
  columns: string
  className?: string
}) {
  return (
    <div
      className={`grid h-full min-h-0 ${className}`}
      style={{ gridTemplateColumns: columns, gap: CAL_CONTENT_GAP }}
    >
      {children}
    </div>
  )
}

export function CalisthenicsWorkoutSidebar({
  children,
  showChat = true,
  urgentRest = false,
}: {
  children: ReactNode
  showChat?: boolean
  urgentRest?: boolean
}) {
  return (
    <aside
      className="flex min-h-0 flex-col overflow-hidden"
      style={{ width: CAL_SIDEBAR_RIGHT_W, gap: CAL_WIDGET_GAP }}
    >
      <div className="min-h-0 flex-1 space-y-0 overflow-y-auto overlay-scroll border-l border-cal-border bg-[#0a0a0acc]">
        {children}
      </div>
      {showChat && <ObsChatSlot className={urgentRest ? 'ring-2 ring-cal-accent/60' : ''} />}
    </aside>
  )
}

export function CalisthenicsFooter({
  motto,
  todayGoal,
  next,
}: {
  motto: string
  todayGoal: { label: string; progress: number }
  next?: { name: string; sets: number }
}) {
  return (
    <footer className="relative z-10 grid h-[88px] shrink-0 grid-cols-3 border-t border-cal-border bg-cal-panel/95">
      <div className="flex items-center justify-center border-r border-cal-border px-8">
        <p className="text-center font-script text-[34px] leading-tight text-white">
          <span className="text-cal-accent">&ldquo;</span>
          {motto}
          <span className="text-cal-accent">&rdquo;</span>
        </p>
      </div>
      <div className="flex flex-col justify-center border-r border-cal-border px-10">
        <p className="mb-1 text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">
          Today&apos;s Goal
        </p>
        <p className="mb-2 font-display text-[16px] tracking-wide text-white uppercase">
          {todayGoal.label}
        </p>
        <div className="flex items-center gap-3">
          <div className="h-[10px] flex-1 overflow-hidden rounded-sm bg-[#1a1a1a]">
            <div
              className="h-full bg-gradient-to-r from-[#cc5500] to-cal-accent"
              style={{ width: `${todayGoal.progress}%` }}
            />
          </div>
          <span className="font-mono text-[13px] font-bold text-cal-accent">{todayGoal.progress}%</span>
        </div>
      </div>
      <div className="flex flex-col justify-center px-10">
        <p className="mb-1 text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">Up Next</p>
        <p className="font-display text-[28px] tracking-wide text-white uppercase">
          {next?.name ?? '—'}
        </p>
        <p className="text-[11px] tracking-[0.12em] text-cal-muted uppercase">
          {next ? `${next.sets} Sets` : ''}
        </p>
      </div>
    </footer>
  )
}

export function CalStatRow({
  label,
  value,
  size = 'md',
  underline = false,
  highlight = false,
}: {
  label: string
  value: ReactNode
  size?: 'md' | 'lg' | 'hero'
  underline?: boolean
  highlight?: boolean
}) {
  return (
    <div
      className={`border-b border-cal-border px-7 py-5 ${highlight ? 'bg-cal-accent/10' : ''}`}
    >
      <p className="mb-1.5 text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">
        {label}
      </p>
      <div
        className={`font-display tracking-wide text-white uppercase ${
          size === 'hero'
            ? 'font-mono text-[56px] leading-none font-bold text-cal-accent drop-shadow-[0_0_20px_var(--color-cal-accent-glow)]'
            : size === 'lg'
              ? 'text-[28px]'
              : 'text-[24px]'
        } ${underline ? 'inline-block border-b-[3px] border-cal-accent pb-0.5' : ''}`}
      >
        {value}
      </div>
    </div>
  )
}
