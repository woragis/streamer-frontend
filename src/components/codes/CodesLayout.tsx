import type { ReactNode } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/constants/canvas'
import {
  useBranding,
  useCodesCopy,
  useCodesGoals,
  useCurrentProblem,
  useLoadingProgress,
  useProgressToday,
  useRecentProblems,
  useSession,
  useStreamTimerDisplay,
  useTodayPlan,
  useWeekGoal,
} from '@/hooks/useOverlayData'
import { formatCountdown } from '@/hooks/useTimers'
import type { Difficulty } from '@/stores/types'
import { brandingHandle } from '@/lib/branding'
import {
  IconYouTube,
  IconKick,
  IconTwitter,
  IconDiscord,
  IconCode,
  IconClock,
  IconTarget,
  IconCalendar,
  IconCheck,
  IconHeart,
  IconDollar,
  IconUser,
} from '@/components/codes/Icons'

/* ─── Layout shell ─── */

export function CodesShell({
  children,
  footer,
  status,
  statusDot,
}: {
  children: ReactNode
  footer: ReactNode
  status?: string
  statusDot?: 'live' | 'soon'
}) {
  return (
    <div
      className="flex flex-col bg-codes-bg"
      style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
    >
      <CodesHeader status={status} statusDot={statusDot} />
      <div className="min-h-0 flex-1">{children}</div>
      {footer}
    </div>
  )
}

export function CodesHeader({
  status = 'LIVE',
  statusDot = 'live',
}: {
  status?: string
  statusDot?: 'live' | 'soon'
}) {
  const branding = useBranding()
  const { brandTitle } = branding
  const handle = brandingHandle(branding, 'codes')

  return (
    <header className="flex h-[48px] shrink-0 items-center justify-between border-b border-codes-border bg-codes-bg px-6">
      <div className="flex items-center gap-2.5">
        <span className="text-[13px] font-extrabold tracking-[0.18em] text-white uppercase">
          {brandTitle}
        </span>
        <span
          className={`h-[7px] w-[7px] rounded-full ${
            statusDot === 'live'
              ? 'bg-red-500 shadow-[0_0_8px_#ef4444] pulse-live'
              : 'bg-codes-accent shadow-[0_0_8px_#3b82f6]'
          }`}
        />
        <span className="text-[11px] font-bold tracking-[0.12em] text-codes-accent uppercase">
          {status}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1a2030] text-slate-400">
          <IconYouTube className="h-3.5 w-3.5" />
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1a2030] text-slate-400">
          <IconKick className="h-3.5 w-3.5" />
        </span>
        <span className="text-[12px] font-medium text-codes-muted">{handle}</span>
      </div>
    </header>
  )
}

/* ─── Widget primitives ─── */

export function Widget({
  title,
  icon,
  children,
  accent = false,
  className = '',
}: {
  title: string
  icon?: ReactNode
  children: ReactNode
  accent?: boolean
  className?: string
}) {
  return (
    <div className={`${accent ? 'codes-widget-accent' : 'codes-widget'} p-3.5 ${className}`}>
      <div className="mb-2.5 flex items-center gap-2">
        {icon && <span className="text-codes-accent">{icon}</span>}
        <span className="text-[10px] font-bold tracking-[0.14em] text-codes-accent uppercase">
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

export function ProgressTrack({
  current,
  target,
  className = '',
}: {
  current: number
  target: number
  className?: string
}) {
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0
  return (
    <div className={`h-[6px] overflow-hidden rounded-full bg-[#1e293b] ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-codes-accent-dim to-codes-accent-bright transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function DifficultyTag({ difficulty }: { difficulty: Difficulty }) {
  const styles: Record<Difficulty, string> = {
    easy: 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400',
    medium: 'border-amber-500/50 bg-amber-500/15 text-amber-400',
    hard: 'border-red-500/50 bg-red-500/15 text-red-400',
  }
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase border ${styles[difficulty]}`}
    >
      {difficulty}
    </span>
  )
}

export function Checklist({ items }: { items: { id: string; label: string; done: boolean }[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-2.5">
          <span
            className={`flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full border ${
              item.done
                ? 'border-codes-accent bg-codes-accent/20 text-codes-accent'
                : 'border-slate-600 bg-transparent'
            }`}
          >
            {item.done && <IconCheck className="h-2.5 w-2.5" />}
          </span>
          <span
            className={`text-[12px] ${item.done ? 'text-codes-muted line-through' : 'text-codes-text'}`}
          >
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function ProblemList({
  problems,
  compact = false,
}: {
  problems: { id: number; title: string; done: boolean }[]
  compact?: boolean
}) {
  return (
    <ul className={`space-y-${compact ? '1' : '2'}`}>
      {problems.map((p) => (
        <li key={p.id} className="flex items-center gap-2">
          <span
            className={`flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full border text-[8px] ${
              p.done
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                : 'border-slate-500 text-transparent'
            }`}
          >
            {p.done && '✓'}
          </span>
          <span className={`${compact ? 'text-[11px]' : 'text-[12px]'} text-codes-text truncate`}>
            {p.id}. {p.title}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function WeekGoalRing() {
  const weekGoal = useWeekGoal()
  const pct = weekGoal.target > 0 ? (weekGoal.current / weekGoal.target) * 100 : 0
  const r = 38
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[88px] w-[88px] shrink-0">
        <svg className="-rotate-90" width="88" height="88" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="#1e293b" strokeWidth="7" />
          <circle
            cx="44"
            cy="44"
            r={r}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="7"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[15px] font-bold text-white">
            {weekGoal.current}/{weekGoal.target}
          </span>
        </div>
      </div>
      <p className="text-[11px] leading-snug text-codes-muted">
        Problems
        <br />
        This Week
      </p>
    </div>
  )
}

export function LiveCam({ className = '' }: { className?: string }) {
  return (
    <div className={`live-cam-frame relative overflow-hidden rounded-lg ${className}`}>
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded bg-black/70 px-2 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 pulse-live" />
        <span className="text-[9px] font-bold tracking-[0.12em] text-white uppercase">Live Cam</span>
      </div>
    </div>
  )
}

export function CountdownBox({
  label,
  seconds,
  showBar,
  totalSeconds,
}: {
  label: string
  seconds: number
  showBar?: boolean
  totalSeconds?: number
}) {
  const pct =
    showBar && totalSeconds && totalSeconds > 0
      ? ((totalSeconds - seconds) / totalSeconds) * 100
      : 0

  return (
    <div className="text-center">
      <p className="mb-3 text-[11px] font-bold tracking-[0.16em] text-codes-accent uppercase">
        {label}
      </p>
      <p className="font-mono text-[72px] leading-none font-bold tracking-wider text-white">
        {formatCountdown(seconds)}
      </p>
      {showBar && (
        <div className="mx-auto mt-4 w-[220px]">
          <ProgressTrack current={pct} target={100} />
        </div>
      )}
    </div>
  )
}

export function CodeWatermark({ className = '' }: { className?: string }) {
  return (
    <pre
      className={`font-mono text-[11px] leading-[1.7] text-slate-700/80 select-none ${className}`}
    >
      {`# Goal: Solve better.
# Progress every day.

def solve(problem):
    think()
    plan()
    code()
    test()
    optimize()
    submit()

while True:
    problem = get_problem()
    solve(problem)`}
    </pre>
  )
}

export function BraceDecoration() {
  return (
    <span className="pointer-events-none absolute top-6 right-[38%] font-mono text-[120px] leading-none text-[#1e293b] select-none">
      {'{ }'}
    </span>
  )
}

/* ─── Data-driven widgets ─── */

export function CurrentProblemWidget() {
  const p = useCurrentProblem()
  if (!p) return null
  return (
    <Widget title="Current Problem" accent>
      <p className="mb-2 text-[13px] leading-snug font-semibold text-white">
        {p.id}. {p.title}
      </p>
      <DifficultyTag difficulty={p.difficulty} />
    </Widget>
  )
}

export function ProgressTodayWidget() {
  const { current, target } = useProgressToday()
  return (
    <Widget title="Progress Today">
      <p className="mb-1 text-[22px] font-bold text-white">
        {current} <span className="text-[16px] text-codes-muted">/ {target}</span>
      </p>
      <p className="mb-2.5 text-[11px] text-codes-muted">Problems Solved</p>
      <ProgressTrack current={current} target={target} />
    </Widget>
  )
}

export function StreamTimeWidget() {
  const stream = useStreamTimerDisplay()
  return (
    <Widget title="Stream Time" icon={<IconClock className="h-3.5 w-3.5" />}>
      <p className="font-mono text-[32px] font-bold tracking-wide text-white">
        {stream.formatted}
      </p>
    </Widget>
  )
}

export function WeekGoalWidget() {
  const g = useWeekGoal()
  return (
    <Widget title="Week Goal">
      <p className="mb-1 text-[22px] font-bold text-white">
        {g.current} <span className="text-[16px] text-codes-muted">/ {g.target}</span>
      </p>
      <p className="mb-2.5 text-[11px] text-codes-muted">Problems</p>
      <ProgressTrack current={g.current} target={g.target} />
    </Widget>
  )
}

export function StatsWidget() {
  const progressToday = useProgressToday()
  const weekGoal = useWeekGoal()
  const streak = useCodesGoals().streak
  return (
    <Widget title="Stats">
      <div className="space-y-2.5 text-[12px]">
        <Row label="Problems Solved Today" value={`${progressToday.current} / ${progressToday.target}`} />
        <Row label="This Week" value={`${weekGoal.current} / ${weekGoal.target}`} />
        <Row label="Current Streak" value={`${streak} days`} highlight />
      </div>
    </Widget>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-codes-muted">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-codes-accent' : 'text-white'}`}>
        {value}
      </span>
    </div>
  )
}

export function TodayPlanWidget() {
  const items = useTodayPlan()
  return (
    <Widget title="Today's Plan">
      <Checklist items={items} />
    </Widget>
  )
}

export function LatestProblemWidget() {
  const p = useCurrentProblem()
  if (!p) return null
  return (
    <Widget title="Latest Problem">
      <p className="mb-2 text-[12px] font-semibold text-white">
        {p.id}. {p.title}
      </p>
      <DifficultyTag difficulty={p.difficulty} />
    </Widget>
  )
}

export function ScheduleWidget() {
  const schedule = useBranding().schedule
  return (
    <Widget title="Stream Schedule" icon={<IconCalendar className="h-3.5 w-3.5" />}>
      <p className="text-[12px] font-semibold text-white">Mon – Fri</p>
      <p className="text-[12px] text-codes-accent">{schedule.split('·')[1]?.trim() ?? schedule}</p>
    </Widget>
  )
}

export function StayConnectedWidget() {
  const { discord, twitter } = useBranding().social
  return (
    <Widget title="Stay Connected">
      <div className="space-y-2 text-[11px] text-codes-text">
        <p className="flex items-center gap-2">
          <IconDiscord className="h-3.5 w-3.5 text-indigo-400" /> {discord}
        </p>
        <p className="flex items-center gap-2">
          <IconTwitter className="h-3.5 w-3.5 text-sky-400" /> {twitter}
        </p>
      </div>
    </Widget>
  )
}

export function LoadingWidget() {
  const progress = useLoadingProgress()
  return (
    <Widget title="Loading Status" className="border-dashed">
      <p className="mb-2 text-[12px] text-codes-muted">Loading...</p>
      <ProgressTrack current={progress} target={100} className="mb-2" />
      <p className="font-mono text-[10px] text-emerald-500/80">&gt; Getting ready to code</p>
      <p className="font-mono text-[10px] text-emerald-500/80">&gt; See you in a few minutes!</p>
    </Widget>
  )
}

/* ─── Footers ─── */

export function MottoFooter() {
  const motto = useBranding().motto
  return (
    <div className="flex h-full items-center gap-3 px-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-codes-accent/15 text-codes-accent">
        <IconCode className="h-4 w-4" />
      </span>
      <div>
        <p className="text-[11px] font-bold tracking-[0.12em] text-codes-accent uppercase">
          {motto}
        </p>
        <p className="text-[10px] text-codes-muted">One problem at a time.</p>
      </div>
    </div>
  )
}

export function MottoFooterExtended() {
  const motto = useBranding().motto
  return (
    <div className="flex h-full items-center gap-3 px-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-codes-accent/15 text-codes-accent">
        <IconCode className="h-4 w-4" />
      </span>
      <div>
        <p className="text-[11px] font-bold tracking-[0.12em] text-codes-accent uppercase">
          {motto}
        </p>
        <p className="text-[10px] text-codes-muted">
          One problem at a time. Discipline today, freedom tomorrow.
        </p>
      </div>
    </div>
  )
}

export function FooterCell({
  title,
  icon,
  children,
}: {
  title: string
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="codes-widget flex h-full flex-col justify-center px-4 py-2">
      <div className="mb-1.5 flex items-center gap-2">
        {icon && <span className="text-codes-accent">{icon}</span>}
        <span className="text-[10px] font-bold tracking-[0.12em] text-codes-muted uppercase">
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

export function MainCodingFooter() {
  const items = useTodayPlan()
  const problems = useRecentProblems()
  const { discord, twitter } = useBranding().social

  return (
    <footer className="grid h-[88px] shrink-0 grid-cols-4 gap-3 border-t border-codes-border px-4 py-2.5">
      <MottoFooter />
      <FooterCell title="Today's Plan">
        <ul className="space-y-0.5">
          {items.map((i) => (
            <li key={i.id} className="text-[11px] text-codes-text">
              • {i.label}
            </li>
          ))}
        </ul>
      </FooterCell>
      <FooterCell title="Recent Problems">
        <ProblemList problems={problems} compact />
      </FooterCell>
      <FooterCell title="Stay Connected">
        <p className="flex items-center gap-1.5 text-[11px] text-codes-text">
          <IconDiscord className="h-3 w-3 text-indigo-400" /> {discord}
        </p>
        <p className="flex items-center gap-1.5 text-[11px] text-codes-text">
          <IconTwitter className="h-3 w-3 text-sky-400" /> {twitter}
        </p>
      </FooterCell>
    </footer>
  )
}

export function StartingSoonFooter() {
  const problems = useRecentProblems()
  return (
    <footer className="grid h-[88px] shrink-0 grid-cols-4 gap-3 border-t border-codes-border px-4 py-2.5">
      <MottoFooterExtended />
      <FooterCell title="Recent Problems">
        <ProblemList problems={problems} compact />
      </FooterCell>
      <FooterCell title="Week Goal">
        <WeekGoalRing />
      </FooterCell>
      <LoadingWidget />
    </footer>
  )
}

export function BrbFooter() {
  const upNext = useCodesCopy().upNextLabel
  const problems = useRecentProblems()
  const schedule = useBranding().schedule

  return (
    <footer className="grid h-[88px] shrink-0 grid-cols-4 gap-3 border-t border-codes-border px-4 py-2.5">
      <FooterCell title="Today's Focus" icon={<IconTarget className="h-3.5 w-3.5" />}>
        <p className="text-[12px] text-codes-text">Discipline today, freedom tomorrow.</p>
      </FooterCell>
      <FooterCell title="Up Next" icon={<IconCode className="h-3.5 w-3.5" />}>
        <p className="text-[12px] font-semibold text-white">{upNext}</p>
      </FooterCell>
      <FooterCell title="Recent Problems">
        <ProblemList problems={problems} compact />
      </FooterCell>
      <FooterCell title="Schedule" icon={<IconCalendar className="h-3.5 w-3.5" />}>
        <p className="text-[11px] text-codes-text">Daily Live</p>
        <p className="text-[11px] text-codes-muted">{schedule}</p>
      </FooterCell>
    </footer>
  )
}

export function WhiteboardFooter() {
  const { latestSubscriber: sub, latestFollower: fol, latestDonation: don } =
    useSession().streamEvents
  const { discord, twitter } = useBranding().social

  return (
    <footer className="grid h-[88px] shrink-0 grid-cols-5 gap-3 border-t border-codes-border px-4 py-2.5">
      <MottoFooter />
      <FooterCell title="Latest Subscriber" icon={<IconUser className="h-3.5 w-3.5" />}>
        <p className="text-[12px] font-semibold text-white">{sub}</p>
      </FooterCell>
      <FooterCell title="Latest Follower" icon={<IconHeart className="h-3.5 w-3.5" />}>
        <p className="text-[12px] font-semibold text-white">{fol}</p>
      </FooterCell>
      <FooterCell title="Latest Donation" icon={<IconDollar className="h-3.5 w-3.5" />}>
        <p className="text-[12px] font-semibold text-white">{don}</p>
      </FooterCell>
      <FooterCell title="Stay Connected">
        <p className="flex items-center gap-1.5 text-[11px] text-codes-text">
          <IconDiscord className="h-3 w-3" /> {discord}
        </p>
        <p className="flex items-center gap-1.5 text-[11px] text-codes-text">
          <IconTwitter className="h-3 w-3" /> {twitter}
        </p>
      </FooterCell>
    </footer>
  )
}

export function SocialRow() {
  const handle = brandingHandle(useBranding(), 'codes')
  return (
    <div className="mt-5 flex items-center gap-4 text-codes-muted">
      <IconYouTube className="h-4 w-4" />
      <IconKick className="h-4 w-4" />
      <IconTwitter className="h-4 w-4" />
      <span className="text-[12px] text-codes-text">{handle}</span>
    </div>
  )
}
