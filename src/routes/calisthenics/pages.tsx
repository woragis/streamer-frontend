import { ObsCanvas } from '@/components/shared/ObsCanvas'
import { CalContentZone } from '@/components/calisthenics/CalContentZone'
import {
  CalisthenicsContentShell,
  CalisthenicsFooter,
  CalisthenicsLayoutGrid,
  CalisthenicsShell,
  CalisthenicsWorkoutSidebar,
  CalStatRow,
} from '@/components/calisthenics/CalisthenicsLayoutShell'
import { CAL_SIDEBAR_RIGHT_W } from '@/constants/cal-layout'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/constants/canvas'
import { useAppState } from '@/hooks/useAppStore'
import { useObsMode } from '@/hooks/useObsMode'
import {
  useBranding,
  useWorkoutStats,
  useSession,
  useTotalReps,
  useBrbTimer,
  useRestTimer,
} from '@/hooks/useOverlayData'
import { brandingHandle } from '@/lib/branding'
import { IconKick, IconHeart, IconUser, IconDollar } from '@/components/codes/Icons'

export function CalisthenicsMainPage() {
  const obs = useObsMode()
  const stats = useWorkoutStats()
  const rest = useRestTimer()
  const branding = useBranding()
  const contentLayout = useAppState().calisthenics.contentLayout
  const urgentRest = rest.running && rest.seconds <= 10 && rest.seconds > 0

  return (
    <ObsCanvas theme="calisthenics" obs={obs}>
      <CalisthenicsShell
        footer={
          <CalisthenicsFooter
            motto={branding.calisthenicsMotto}
            todayGoal={stats.todayGoal}
            next={stats.next}
          />
        }
      >
        <CalisthenicsContentShell>
          <CalisthenicsLayoutGrid columns={`1fr ${CAL_SIDEBAR_RIGHT_W}px`}>
            <CalContentZone layout={contentLayout} />
            <CalisthenicsWorkoutSidebar urgentRest={urgentRest}>
              <CalStatRow label="Workout" value={stats.workoutType} size="lg" />
              <CalStatRow
                label="Current Exercise"
                value={stats.active?.name ?? '—'}
                size="lg"
                underline
              />
              <CalStatRow
                label="Set"
                value={
                  stats.active ? (
                    <>
                      <span className="text-[36px]">{stats.active.completedSets + 1}</span>
                      <span className="text-[20px] text-cal-muted"> / {stats.active.sets}</span>
                    </>
                  ) : (
                    '—'
                  )
                }
              />
              <CalStatRow
                label="Reps"
                value={
                  stats.active ? (
                    <>
                      <span className="text-[36px]">{stats.active.repsInCurrentSet}</span>
                      <span className="text-[20px] text-cal-muted"> / {stats.active.repTarget}</span>
                    </>
                  ) : (
                    '—'
                  )
                }
              />
              <CalStatRow
                label="Rest Time"
                value={stats.rest.formatted}
                size="hero"
                highlight={urgentRest}
              />
              <CalStatRow label="Stream" value={stats.stream.formatted} />
              <CalStatRow label="Total Reps" value={String(stats.totalReps)} />
            </CalisthenicsWorkoutSidebar>
          </CalisthenicsLayoutGrid>
        </CalisthenicsContentShell>
      </CalisthenicsShell>
    </ObsCanvas>
  )
}

export function CalisthenicsBrbPage() {
  const obs = useObsMode()
  const brb = useBrbTimer()
  const stats = useWorkoutStats()
  const branding = useBranding()
  const handle = brandingHandle(branding, 'calisthenics')
  const ch = handle.replace('@', '').toUpperCase() || 'YOURCHANNEL'

  return (
    <ObsCanvas theme="calisthenics" obs={obs}>
      <div
        className="cal-noise flex flex-col bg-cal-bg"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        <header className="flex h-[56px] shrink-0 items-center justify-between border-b border-cal-border bg-cal-panel/90 px-8">
          <div className="font-display text-[32px] leading-none tracking-wider text-white">W</div>
          <SocialChip icon={<IconKick className="h-4 w-4 text-cal-accent" />} label={`KICK /${ch}`} />
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b] pulse-live" />
            <span className="font-display text-[18px] tracking-[0.15em] text-amber-300 uppercase">BRB</span>
          </div>
        </header>

        <div className="relative flex flex-1 items-center justify-center">
          <div className="absolute inset-0 m-8 border border-cal-border/40 bg-black/20" />
          <div className="relative z-10 text-center">
            <p className="mb-3 text-[11px] font-bold tracking-[0.25em] text-cal-muted uppercase">
              {stats.workoutType}
            </p>
            <h1 className="mb-4 font-display text-[80px] leading-none tracking-wide text-white uppercase">
              Be Right <span className="text-cal-accent">Back</span>
            </h1>
            <p className="mb-10 text-[12px] tracking-[0.16em] text-cal-muted uppercase">
              Hydrate · Stretch · Back soon
            </p>
            <div className="mx-auto w-[420px] rounded-2xl border border-cal-accent/40 bg-cal-panel/90 px-10 py-8">
              <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">
                I&apos;ll be back in
              </p>
              <p className="font-mono text-[72px] leading-none font-bold text-cal-accent drop-shadow-[0_0_20px_var(--color-cal-accent-glow)]">
                {brb.formatted}
              </p>
            </div>
          </div>

          <aside className="absolute top-0 right-0 h-full w-[280px] border-l border-cal-border bg-[#0a0a0acc]">
            <StatRow label="Workout" value={stats.workoutType} size="lg" />
            <StatRow label="Current" value={stats.active?.name ?? '—'} size="md" />
            <StatRow label="Stream" value={stats.stream.formatted} size="md" />
            <StatRow label="Total Reps" value={String(stats.totalReps)} size="md" />
          </aside>
        </div>
      </div>
    </ObsCanvas>
  )
}

export function CalisthenicsBreakPage() {
  const obs = useObsMode()
  const rest = useRestTimer()
  const stats = useWorkoutStats()
  const next = stats.next

  return (
    <ObsCanvas theme="calisthenics" obs={obs}>
      <div
        className="cal-noise flex flex-col bg-cal-bg"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        <header className="flex h-[56px] shrink-0 items-center justify-center border-b border-cal-border bg-cal-panel/90">
          <span className="font-display text-[16px] tracking-[0.2em] text-cal-muted uppercase">
            {stats.workoutType} · Break
          </span>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center px-16 text-center">
          <h1 className="mb-3 font-display text-[72px] leading-none tracking-wide text-white uppercase">
            Break <span className="text-cal-accent">Time</span>
          </h1>
          <p className="mb-10 text-[12px] tracking-[0.16em] text-cal-muted uppercase">
            Rest between sets · Breathe · Reset
          </p>

          <div className="mb-12 rounded-2xl border border-cal-border bg-cal-panel/80 px-14 py-8">
            <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">
              Rest Timer
            </p>
            <p className="font-mono text-[64px] leading-none font-bold text-cal-accent">
              {rest.formatted}
            </p>
          </div>

          {next && (
            <div className="rounded-xl border border-cal-border/60 bg-black/30 px-8 py-4">
              <p className="mb-1 text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">
                Up Next
              </p>
              <p className="font-display text-[28px] tracking-wide text-white uppercase">{next.name}</p>
            </div>
          )}
        </div>
      </div>
    </ObsCanvas>
  )
}

export function CalisthenicsReactPage() {
  const obs = useObsMode()
  const { streamEvents } = useSession()
  const stats = useWorkoutStats()

  return (
    <ObsCanvas theme="calisthenics" obs={obs}>
      <div
        className="relative flex flex-col bg-transparent"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-16">
          <p className="text-[11px] font-bold tracking-[0.25em] text-cal-accent uppercase">
            Community React
          </p>

          <ReactAlertCard
            type="follower"
            icon={<IconHeart className="h-10 w-10 text-pink-400" />}
            label="New Follower"
            value={streamEvents.latestFollower || '—'}
          />

          <div className="grid w-full max-w-[1100px] grid-cols-2 gap-6">
            <ReactAlertCard
              type="subscriber"
              icon={<IconUser className="h-8 w-8 text-cal-accent" />}
              label="Latest Subscriber"
              value={streamEvents.latestSubscriber || '—'}
              compact
            />
            <ReactAlertCard
              type="donation"
              icon={<IconDollar className="h-8 w-8 text-emerald-400" />}
              label="Latest Donation"
              value={streamEvents.latestDonation || '—'}
              compact
            />
          </div>
        </div>

        <footer className="relative z-10 flex h-[72px] items-center justify-between border-t border-cal-border/50 bg-black/50 px-10 backdrop-blur-sm">
          <span className="font-display text-[14px] tracking-wider text-white uppercase">
            {stats.workoutType}
          </span>
          <span className="font-mono text-[13px] text-cal-text">{stats.stream.formatted}</span>
        </footer>
      </div>
    </ObsCanvas>
  )
}

function ReactAlertCard({
  icon,
  label,
  value,
  compact = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  compact?: boolean
  type?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-cal-accent/40 bg-black/75 text-center shadow-[0_0_40px_var(--color-cal-accent-glow)] backdrop-blur-md ${
        compact ? 'px-8 py-6' : 'px-14 py-10'
      }`}
    >
      <div className="mb-3 flex justify-center">{icon}</div>
      <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">{label}</p>
      <p className={`font-display tracking-wide text-white uppercase ${compact ? 'text-[28px]' : 'text-[48px]'}`}>
        {value}
      </p>
    </div>
  )
}

export function CalisthenicsEndScreenPage() {
  const obs = useObsMode()
  const stats = useWorkoutStats()
  const totalReps = useTotalReps()
  const branding = useBranding()
  const handle = brandingHandle(branding, 'calisthenics')

  return (
    <ObsCanvas theme="calisthenics" obs={obs}>
      <div
        className="cal-noise flex flex-col bg-cal-bg"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        <header className="flex h-[56px] shrink-0 items-center justify-center border-b border-cal-border bg-cal-panel/90">
          <span className="font-display text-[16px] tracking-[0.2em] text-cal-muted uppercase">
            Workout Complete
          </span>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center px-16 text-center">
          <h1 className="mb-4 font-display text-[64px] leading-none tracking-wide text-white uppercase">
            Great <span className="text-cal-accent">Session</span>
          </h1>
          <p className="mb-12 max-w-[600px] text-[12px] tracking-[0.16em] text-cal-muted uppercase">
            Thanks for training with me · {branding.schedule}
          </p>

          <div className="mb-12 grid w-full max-w-[800px] grid-cols-3 gap-5">
            <CalEndStat label="Workout" value={stats.workoutType} />
            <CalEndStat label="Total Reps" value={String(totalReps)} />
            <CalEndStat label="Duration" value={stats.stream.formatted} />
          </div>

          <p className="font-script text-[28px] text-white">
            Follow <span className="text-cal-accent">{handle}</span> for the next live
          </p>
        </div>
      </div>
    </ObsCanvas>
  )
}

function CalEndStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-cal-border bg-cal-panel/80 px-6 py-5">
      <p className="mb-1 text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">{label}</p>
      <p className="font-display text-[32px] tracking-wide text-white uppercase">{value}</p>
    </div>
  )
}

function SocialChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] text-cal-muted uppercase">
      {icon}
      {label}
    </span>
  )
}

function StatRow({
  label,
  value,
  size = 'md',
  underline = false,
}: {
  label: string
  value: React.ReactNode
  size?: 'md' | 'lg'
  underline?: boolean
}) {
  return (
    <div className="border-b border-cal-border px-7 py-5">
      <p className="mb-1.5 text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">
        {label}
      </p>
      <div
        className={`font-display tracking-wide text-white uppercase ${
          size === 'lg' ? 'text-[28px]' : 'text-[24px]'
        } ${underline ? 'inline-block border-b-[3px] border-cal-accent pb-0.5' : ''}`}
      >
        {value}
      </div>
    </div>
  )
}
