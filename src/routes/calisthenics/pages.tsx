import { ObsCanvas } from '@/components/shared/ObsCanvas'
import { useObsMode } from '@/hooks/useObsMode'
import { useCountdown, useStreamTimer, formatRestTime, formatStreamTime } from '@/hooks/useTimers'
import { useStreamStore } from '@/hooks/useStreamStore'
import { IconYouTube, IconKick, IconInstagram } from '@/components/codes/Icons'

export function CalisthenicsMainPage() {
  const obs = useObsMode()
  useStreamTimer()
  useCountdown('restTimerSeconds', 'restTimerRunning')

  const workoutType = useStreamStore((s) => s.workoutType)
  const currentExercise = useStreamStore((s) => s.currentExercise)
  const currentSet = useStreamStore((s) => s.currentSet)
  const currentReps = useStreamStore((s) => s.currentReps)
  const restTimer = useStreamStore((s) => s.restTimerSeconds)
  const totalReps = useStreamStore((s) => s.totalReps)
  const todayGoalProgress = useStreamStore((s) => s.todayGoalProgress)
  const todayGoalLabel = useStreamStore((s) => s.todayGoalLabel)
  const upNextExercise = useStreamStore((s) => s.upNextExercise)
  const upNextSets = useStreamStore((s) => s.upNextSets)
  const motto = useStreamStore((s) => s.calisthenicsMotto)
  const streamTime = useStreamStore((s) => s.streamTimeSeconds)
  const handle = useStreamStore((s) => s.handle)
  const channel = handle.replace('@', '').toUpperCase() || 'YOURCHANNEL'

  return (
    <ObsCanvas theme="calisthenics" obs={obs}>
      <div className="cal-noise flex h-[1080px] w-[1920px] flex-col bg-cal-bg">
        {/* Top bar */}
        <header className="relative z-10 flex h-[56px] shrink-0 items-center justify-between border-b border-cal-border bg-cal-panel/90 px-8">
          <div className="font-display text-[32px] leading-none tracking-wider text-white">W</div>
          <div className="flex items-center gap-10">
            <SocialChip icon={<IconYouTube className="h-4 w-4 text-cal-accent" />} label={`YOUTUBE /${channel}`} />
            <SocialChip icon={<IconKick className="h-4 w-4 text-cal-accent" />} label={`KICK /${channel}`} />
            <SocialChip icon={<IconInstagram className="h-4 w-4 text-cal-accent" />} label={`@${channel}`} />
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] pulse-live" />
            <span className="font-display text-[18px] tracking-[0.15em] text-white">LIVE</span>
            <span className="font-mono text-[14px] text-cal-text">{formatStreamTime(streamTime)}</span>
          </div>
        </header>

        {/* Main area */}
        <div className="relative min-h-0 flex-1">
          {/* Video viewport with corner brackets */}
          <div className="absolute inset-0 right-[300px] bottom-[88px] m-3 border border-[#2a2a2a] bg-transparent">
            <span className="cal-corner-bracket cal-corner-tl" />
            <span className="cal-corner-bracket cal-corner-tr" />
            <span className="cal-corner-bracket cal-corner-bl" />
            <span className="cal-corner-bracket cal-corner-br" />
          </div>

          {/* Right stats panel */}
          <aside className="absolute top-0 right-0 h-full w-[300px] border-l border-cal-border bg-[#0a0a0acc]">
            <StatRow label="Workout" value={workoutType} size="lg" />
            <StatRow label="Current Exercise" value={currentExercise} size="lg" underline />
            <StatRow
              label="Set"
              value={
                <>
                  <span className="text-[36px]">{currentSet.current}</span>
                  <span className="text-[20px] text-cal-muted"> / {currentSet.total}</span>
                </>
              }
            />
            <StatRow
              label="Reps"
              value={
                <>
                  <span className="text-[36px]">{currentReps.current}</span>
                  <span className="text-[20px] text-cal-muted"> / {currentReps.target}</span>
                </>
              }
            />
            <div className="border-b border-cal-border px-7 py-6">
              <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">
                Rest Time
              </p>
              <p className="font-mono text-[56px] leading-none font-bold text-cal-accent drop-shadow-[0_0_20px_var(--color-cal-accent-glow)]">
                {formatRestTime(restTimer)}
              </p>
            </div>
            <StatRow label="Total Reps" value={String(totalReps)} size="md" />
          </aside>
        </div>

        {/* Bottom bar */}
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
              {todayGoalLabel}
            </p>
            <div className="flex items-center gap-3">
              <div className="h-[10px] flex-1 overflow-hidden rounded-sm bg-[#1a1a1a]">
                <div
                  className="h-full bg-gradient-to-r from-[#cc5500] to-cal-accent"
                  style={{ width: `${todayGoalProgress}%` }}
                />
              </div>
              <span className="font-mono text-[13px] font-bold text-cal-accent">
                {todayGoalProgress}%
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center px-10">
            <p className="mb-1 text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">
              Up Next
            </p>
            <p className="font-display text-[28px] tracking-wide text-white uppercase">
              {upNextExercise}
            </p>
            <p className="text-[11px] tracking-[0.12em] text-cal-muted uppercase">
              {upNextSets} Sets
            </p>
          </div>
        </footer>
      </div>
    </ObsCanvas>
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
