import { useStreamStore } from '@/hooks/useStreamStore'
import { Panel, WidgetTitle } from '@/components/shared/ui'

export function ChecklistWidget({
  title = "Today's Plan",
  theme = 'codes',
}: {
  title?: string
  theme?: 'codes' | 'calisthenics'
}) {
  const items = useStreamStore((s) => s.todayPlan)
  const accent = theme === 'codes' ? 'text-codes-accent' : 'text-cal-accent'

  return (
    <Panel theme={theme} className="p-4">
      <WidgetTitle theme={theme}>{title}</WidgetTitle>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 text-sm text-codes-text">
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                item.done
                  ? `${accent} border-current bg-current/20`
                  : 'border-slate-600'
              }`}
            >
              {item.done && <span className="text-[8px] text-white">✓</span>}
            </span>
            <span className={item.done ? 'text-codes-muted line-through' : ''}>{item.label}</span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export function RecentProblemsList({
  title = 'Recent Problems',
  compact = false,
}: {
  title?: string
  compact?: boolean
}) {
  const problems = useStreamStore((s) => s.recentProblems)

  return (
    <Panel className={`p-4 ${compact ? 'h-full' : ''}`}>
      <WidgetTitle>{title}</WidgetTitle>
      <ul className="space-y-2">
        {problems.map((p) => (
          <li key={p.id} className="flex items-center gap-2 text-sm">
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                p.done ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-600'
              }`}
            >
              {p.done ? '✓' : ''}
            </span>
            <span className={p.done ? 'text-codes-text' : 'text-codes-muted'}>
              {p.id}. {p.title}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export function StatsWidget() {
  const progressToday = useStreamStore((s) => s.progressToday)
  const weekGoal = useStreamStore((s) => s.weekGoal)
  const streak = useStreamStore((s) => s.streak)

  return (
    <Panel className="p-4">
      <WidgetTitle>Stats</WidgetTitle>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-codes-muted">Problems Solved Today</span>
          <span className="font-semibold text-white">
            {progressToday.current} / {progressToday.target}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-codes-muted">This Week</span>
          <span className="font-semibold text-white">
            {weekGoal.current} / {weekGoal.target}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-codes-muted">Current Streak</span>
          <span className="font-semibold text-white">{streak} days</span>
        </div>
      </div>
    </Panel>
  )
}

export function ScheduleWidget() {
  const schedule = useStreamStore((s) => s.schedule)
  return (
    <Panel className="p-4">
      <WidgetTitle>Stream Schedule</WidgetTitle>
      <p className="text-sm font-semibold text-white">Daily Live</p>
      <p className="text-xs text-codes-muted">{schedule}</p>
    </Panel>
  )
}

export function StayConnectedWidget({ theme = 'codes' }: { theme?: 'codes' | 'calisthenics' }) {
  const discord = useStreamStore((s) => s.discord)
  const twitter = useStreamStore((s) => s.twitter)

  return (
    <Panel theme={theme} className="p-4">
      <WidgetTitle theme={theme}>Stay Connected</WidgetTitle>
      <div className="space-y-2 text-sm text-codes-text">
        <p className="flex items-center gap-2">
          <span className="text-indigo-400">💬</span> {discord}
        </p>
        <p className="flex items-center gap-2">
          <span className="text-sky-400">𝕏</span> {twitter}
        </p>
      </div>
    </Panel>
  )
}

export function NotesWidget() {
  const notes = useStreamStore((s) => s.whiteboardNotes)
  return (
    <Panel className="p-4">
      <WidgetTitle>Notes</WidgetTitle>
      <ul className="list-inside list-disc space-y-1 text-sm text-codes-text">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </Panel>
  )
}

export function LatestProblemWidget() {
  const problem = useStreamStore((s) => s.currentProblem)
  return (
    <Panel className="p-4">
      <WidgetTitle>Latest Problem</WidgetTitle>
      <p className="text-sm font-semibold text-white">
        {problem.id}. {problem.title}
      </p>
      <div className="mt-2">
        <span className="rounded border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 uppercase">
          {problem.difficulty}
        </span>
      </div>
    </Panel>
  )
}
