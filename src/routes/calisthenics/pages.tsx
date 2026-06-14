import { ObsCanvas } from '@/components/shared/ObsCanvas'
import { CalisthenicsHeader } from '@/components/shared/StreamHeader'
import { useObsMode } from '@/hooks/useObsMode'
import { useCountdown, useStreamTimer, formatRestTime } from '@/hooks/useTimers'
import { useStreamStore } from '@/hooks/useStreamStore'
import { ProgressBar } from '@/components/shared/ui'

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

  return (
    <ObsCanvas theme="calisthenics" obs={obs}>
      <CalisthenicsHeader />
      <div className="relative h-[calc(1080px-60px-80px)]">
        {/* Transparent center for webcam / video */}
        <div className="absolute inset-8 right-[320px] bottom-[100px] rounded-sm border border-cal-accent/20" />

        {/* Right sidebar stats */}
        <aside className="absolute top-0 right-0 flex h-full w-[300px] flex-col border-l-2 border-cal-accent/40 bg-cal-panel/80">
          <StatBlock label="Workout" value={workoutType} large />
          <StatBlock label="Current Exercise" value={currentExercise} large accent />
          <StatBlock
            label="Set"
            value={`${currentSet.current} / ${currentSet.total}`}
          />
          <StatBlock
            label="Reps"
            value={`${currentReps.current} / ${currentReps.target}`}
          />
          <div className="border-t border-cal-border px-6 py-6">
            <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">
              Rest Time
            </p>
            <p className="font-mono text-5xl font-bold text-cal-accent">
              {formatRestTime(restTimer)}
            </p>
          </div>
          <StatBlock label="Total Reps" value={String(totalReps)} />
        </aside>
      </div>

      {/* Bottom bar */}
      <footer className="grid h-[80px] grid-cols-3 border-t-2 border-cal-accent/30">
        <div className="flex items-center justify-center border-r border-cal-border px-6">
          <p className="font-script text-3xl text-white">&ldquo;{motto}&rdquo;</p>
        </div>
        <div className="flex flex-col justify-center border-r border-cal-border px-8">
          <p className="text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">
            Today&apos;s Goal
          </p>
          <p className="mb-2 text-sm font-bold text-white uppercase">{todayGoalLabel}</p>
          <div className="flex items-center gap-3">
            <ProgressBar
              current={todayGoalProgress}
              target={100}
              accent="calisthenics"
            />
            <span className="font-mono text-sm font-bold text-cal-accent">
              {todayGoalProgress}%
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center px-8">
          <p className="text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">
            Up Next
          </p>
          <p className="text-xl font-black text-white uppercase">{upNextExercise}</p>
          <p className="text-xs text-cal-muted">{upNextSets} SETS</p>
        </div>
      </footer>
    </ObsCanvas>
  )
}

function StatBlock({
  label,
  value,
  large = false,
  accent = false,
}: {
  label: string
  value: string
  large?: boolean
  accent?: boolean
}) {
  return (
    <div className="border-b border-cal-border px-6 py-5">
      <p className="mb-1 text-[10px] font-bold tracking-[0.2em] text-cal-muted uppercase">
        {label}
      </p>
      <p
        className={`font-black tracking-wide text-white uppercase ${
          large ? 'text-2xl' : 'text-xl'
        } ${accent ? 'border-b-4 border-cal-accent pb-1' : ''}`}
      >
        {value}
      </p>
    </div>
  )
}
