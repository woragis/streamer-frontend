import { formatCountdown, formatStreamTime } from '@/hooks/useTimers'
import { useStreamStore } from '@/hooks/useStreamStore'
import { DifficultyBadge, Panel, ProgressBar, WidgetTitle } from '@/components/shared/ui'

export function CountdownDisplay({
  seconds,
  label,
  showProgress = false,
  totalSeconds,
}: {
  seconds: number
  label: string
  showProgress?: boolean
  totalSeconds?: number
}) {
  const pct =
    showProgress && totalSeconds && totalSeconds > 0
      ? ((totalSeconds - seconds) / totalSeconds) * 100
      : 0

  return (
    <div className="text-center">
      <p className="mb-2 text-xs font-bold tracking-[0.2em] text-codes-muted uppercase">{label}</p>
      <p className="font-mono text-6xl font-bold text-white">{formatCountdown(seconds)}</p>
      {showProgress && (
        <div className="mx-auto mt-4 w-64">
          <ProgressBar current={pct} target={100} />
        </div>
      )}
    </div>
  )
}

export function ProgressCard({
  title,
  current,
  target,
  subtitle,
  theme = 'codes',
}: {
  title: string
  current: number
  target: number
  subtitle?: string
  theme?: 'codes' | 'calisthenics'
}) {
  return (
    <Panel theme={theme} className="p-4">
      <WidgetTitle theme={theme}>{title}</WidgetTitle>
      <p className="text-2xl font-bold text-white">
        {current} <span className="text-lg text-codes-muted">/ {target}</span>
      </p>
      {subtitle && <p className="mt-1 text-xs text-codes-muted">{subtitle}</p>}
      <div className="mt-3">
        <ProgressBar current={current} target={target} accent={theme} />
      </div>
    </Panel>
  )
}

export function StreamTimeCard({ theme = 'codes' }: { theme?: 'codes' | 'calisthenics' }) {
  const seconds = useStreamStore((s) => s.streamTimeSeconds)
  return (
    <Panel theme={theme} className="p-4">
      <WidgetTitle theme={theme}>Stream Time</WidgetTitle>
      <p className="font-mono text-3xl font-bold text-white">{formatStreamTime(seconds)}</p>
    </Panel>
  )
}

export function CurrentProblemCard({ theme = 'codes' }: { theme?: 'codes' | 'calisthenics' }) {
  const problem = useStreamStore((s) => s.currentProblem)
  return (
    <Panel theme={theme} className="p-4">
      <WidgetTitle theme={theme}>Current Problem</WidgetTitle>
      <p className="text-sm leading-snug font-semibold text-white">
        {problem.id}. {problem.title}
      </p>
      <div className="mt-2">
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>
    </Panel>
  )
}

export function WeekGoalCard({ theme = 'codes' }: { theme?: 'codes' | 'calisthenics' }) {
  const weekGoal = useStreamStore((s) => s.weekGoal)
  return (
    <Panel theme={theme} className="p-4">
      <WidgetTitle theme={theme}>Week Goal</WidgetTitle>
      <p className="text-2xl font-bold text-white">
        {weekGoal.current} <span className="text-lg text-codes-muted">/ {weekGoal.target}</span>
      </p>
      <p className="mt-1 text-xs text-codes-muted">Problems</p>
      <div className="mt-3">
        <ProgressBar current={weekGoal.current} target={weekGoal.target} accent={theme} />
      </div>
    </Panel>
  )
}

export function WeekGoalGauge() {
  const weekGoal = useStreamStore((s) => s.weekGoal)
  const pct = weekGoal.target > 0 ? (weekGoal.current / weekGoal.target) * 100 : 0
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (pct / 100) * circumference

  return (
    <Panel className="flex flex-col items-center p-4">
      <WidgetTitle>Week Goal</WidgetTitle>
      <div className="relative flex h-24 w-24 items-center justify-center">
        <svg className="-rotate-90" width="96" height="96">
          <circle cx="48" cy="48" r="36" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="48"
            cy="48"
            r="36"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-lg font-bold text-white">
            {weekGoal.current}/{weekGoal.target}
          </p>
        </div>
      </div>
      <p className="mt-1 text-[10px] text-codes-muted">Problems This Week</p>
    </Panel>
  )
}
