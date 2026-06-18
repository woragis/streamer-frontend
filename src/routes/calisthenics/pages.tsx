import { ObsCanvas } from '@/components/shared/ObsCanvas'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/constants/canvas'
import { useObsMode } from '@/hooks/useObsMode'
import { useBranding, useWorkoutStats, useSession, useTotalReps } from '@/hooks/useOverlayData'
import { brandingHandle } from '@/lib/branding'
import type { Exercise } from '@/stores/types'
import { IconYouTube, IconKick, IconInstagram, IconHeart, IconUser, IconDollar } from '@/components/codes/Icons'

export function CalisthenicsMainPage() {
  const obs = useObsMode()
  const stats = useWorkoutStats()

  return (
    <ObsCanvas theme="calisthenics" obs={obs}>
      <CalisthenicsFrame
        workoutType={stats.workoutType}
        active={stats.active}
        next={stats.next}
        totalReps={stats.totalReps}
        restFormatted={stats.rest.formatted}
        streamFormatted={stats.stream.formatted}
        todayGoal={stats.todayGoal}
      />
    </ObsCanvas>
  )
}

function CalisthenicsFrame({
  workoutType,
  active,
  next,
  totalReps,
  restFormatted,
  streamFormatted,
  todayGoal,
}: {
  workoutType: string
  active?: Exercise
  next?: Exercise
  totalReps: number
  restFormatted: string
  streamFormatted: string
  todayGoal: { label: string; progress: number }
}) {
  const branding = useBranding()
  const { calisthenicsMotto: motto } = branding
  const handle = brandingHandle(branding, 'calisthenics')
  const ch = handle.replace('@', '').toUpperCase() || 'YOURCHANNEL'

  return (
    <div
      className="cal-noise flex flex-col bg-cal-bg"
      style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
    >
      <header className="relative z-10 flex h-[56px] shrink-0 items-center justify-between border-b border-cal-border bg-cal-panel/90 px-8">
        <div className="font-display text-[32px] leading-none tracking-wider text-white">W</div>
        <div className="flex items-center gap-10">
          <SocialChip icon={<IconYouTube className="h-4 w-4 text-cal-accent" />} label={`YOUTUBE /${ch}`} />
          <SocialChip icon={<IconKick className="h-4 w-4 text-cal-accent" />} label={`KICK /${ch}`} />
          <SocialChip icon={<IconInstagram className="h-4 w-4 text-cal-accent" />} label={`@${ch}`} />
        </div>
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] pulse-live" />
          <span className="font-display text-[18px] tracking-[0.15em] text-white">LIVE</span>
          <span className="font-mono text-[14px] text-cal-text">{streamFormatted}</span>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 right-[300px] bottom-[88px] m-3 border border-[#2a2a2a] bg-transparent">
          <span className="cal-corner-bracket cal-corner-tl" />
          <span className="cal-corner-bracket cal-corner-tr" />
          <span className="cal-corner-bracket cal-corner-bl" />
          <span className="cal-corner-bracket cal-corner-br" />
        </div>

        <aside className="absolute top-0 right-0 h-full w-[300px] border-l border-cal-border bg-[#0a0a0acc]">
          <StatRow label="Workout" value={workoutType} size="lg" />
          <StatRow label="Current Exercise" value={active?.name ?? '—'} size="lg" underline />
          <StatRow
            label="Set"
            value={
              active ? (
                <>
                  <span className="text-[36px]">{active.completedSets + 1}</span>
                  <span className="text-[20px] text-cal-muted"> / {active.sets}</span>
                </>
              ) : (
                '—'
              )
            }
          />
          <StatRow
            label="Reps"
            value={
              active ? (
                <>
                  <span className="text-[36px]">{active.repsInCurrentSet}</span>
                  <span className="text-[20px] text-cal-muted"> / {active.repTarget}</span>
                </>
              ) : (
                '—'
              )
            }
          />
          <div className="border-b border-cal-border px-7 py-6">
            <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">
              Rest Time
            </p>
            <p className="font-mono text-[56px] leading-none font-bold text-cal-accent drop-shadow-[0_0_20px_var(--color-cal-accent-glow)]">
              {restFormatted}
            </p>
          </div>
          <StatRow label="Total Reps" value={String(totalReps)} size="md" />
        </aside>
      </div>

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
            <span className="font-mono text-[13px] font-bold text-cal-accent">
              {todayGoal.progress}%
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center px-10">
          <p className="mb-1 text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">
            Up Next
          </p>
          <p className="font-display text-[28px] tracking-wide text-white uppercase">
            {next?.name ?? '—'}
          </p>
          <p className="text-[11px] tracking-[0.12em] text-cal-muted uppercase">
            {next ? `${next.sets} Sets` : ''}
          </p>
        </div>
      </footer>
    </div>
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
