import { useStreamStore } from '@/hooks/useStreamStore'
import { Panel } from '@/components/shared/ui'

export function LiveCamSlot({
  className = '',
  label = 'Live Cam',
}: {
  className?: string
  label?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border-2 border-codes-accent/60 bg-transparent ${className}`}
    >
      <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded bg-black/60 px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
        {label}
      </div>
    </div>
  )
}

export function MottoBar({ variant = 'codes' }: { variant?: 'codes' | 'full' }) {
  const motto = useStreamStore((s) => s.motto)

  if (variant === 'full') {
    return (
      <div className="flex items-center gap-3 px-4">
        <span className="text-codes-accent">&lt;/&gt;</span>
        <div>
          <p className="text-xs font-bold tracking-[0.15em] text-white uppercase">{motto}</p>
          <p className="text-[10px] text-codes-muted">One problem at a time.</p>
        </div>
      </div>
    )
  }

  return (
    <Panel className="flex items-center gap-3 p-4">
      <span className="text-xl text-codes-accent">&lt;/&gt;</span>
      <div>
        <p className="text-xs font-bold tracking-[0.15em] text-white uppercase">{motto}</p>
        <p className="text-[10px] text-codes-muted">
          One problem at a time. Discipline today, freedom tomorrow.
        </p>
      </div>
    </Panel>
  )
}

export function StreamFooter({ showEvents = false }: { showEvents?: boolean }) {
  const latestSubscriber = useStreamStore((s) => s.latestSubscriber)
  const latestFollower = useStreamStore((s) => s.latestFollower)
  const latestDonation = useStreamStore((s) => s.latestDonation)
  const upNextLabel = useStreamStore((s) => s.upNextLabel)

  return (
    <footer className="grid h-[100px] grid-cols-4 gap-3 border-t border-codes-border/80 px-6 py-3">
      <MottoBar variant="full" />
      {showEvents ? (
        <>
          <FooterBlock icon="⭐" title="Latest Subscriber" value={latestSubscriber} />
          <FooterBlock icon="👤" title="Latest Follower" value={latestFollower} />
          <FooterBlock icon="💰" title="Latest Donation" value={latestDonation} />
        </>
      ) : (
        <>
          <FooterBlock icon="📋" title="Today's Plan" value="Check sidebar" small />
          <FooterBlock icon="&lt;/&gt;" title="Up Next" value={upNextLabel} />
          <StayConnectedFooter />
        </>
      )}
    </footer>
  )
}

function FooterBlock({
  icon,
  title,
  value,
  small = false,
}: {
  icon: string
  title: string
  value: string
  small?: boolean
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-codes-border bg-codes-panel/60 px-4 py-2">
      <span className="text-codes-accent">{icon}</span>
      <div>
        <p className="text-[10px] font-bold tracking-wider text-codes-muted uppercase">{title}</p>
        <p className={`font-semibold text-white ${small ? 'text-xs' : 'text-sm'}`}>{value}</p>
      </div>
    </div>
  )
}

function StayConnectedFooter() {
  const discord = useStreamStore((s) => s.discord)
  const twitter = useStreamStore((s) => s.twitter)

  return (
    <div className="flex items-center gap-3 rounded-lg border border-codes-border bg-codes-panel/60 px-4 py-2">
      <span className="text-codes-accent">🔗</span>
      <div className="text-xs text-codes-text">
        <p className="font-bold tracking-wider text-codes-muted uppercase">Stay Connected</p>
        <p>{discord}</p>
        <p>{twitter}</p>
      </div>
    </div>
  )
}

export function CodesFooterRow() {
  const upNextLabel = useStreamStore((s) => s.upNextLabel)
  const schedule = useStreamStore((s) => s.schedule)

  return (
    <footer className="grid h-[90px] grid-cols-4 gap-3 border-t border-codes-border/80 px-6 py-3">
      <MottoBar variant="full" />
      <RecentProblemsFooter />
      <FooterBlock icon="&lt;/&gt;" title="Up Next" value={upNextLabel} />
      <FooterBlock icon="📅" title="Schedule" value={schedule} small />
    </footer>
  )
}

function RecentProblemsFooter() {
  const problems = useStreamStore((s) => s.recentProblems)
  return (
    <div className="rounded-lg border border-codes-border bg-codes-panel/60 px-4 py-2">
      <p className="text-[10px] font-bold tracking-wider text-codes-muted uppercase">
        Recent Problems
      </p>
      <ul className="mt-1 space-y-0.5">
        {problems.slice(0, 3).map((p) => (
          <li key={p.id} className="truncate text-xs text-codes-text">
            {p.done ? '✓' : '○'} {p.id}. {p.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CodesMainFooter() {
  return (
    <footer className="grid h-[90px] grid-cols-4 gap-3 border-t border-codes-border/80 px-6 py-3">
      <MottoBar variant="full" />
      <div className="rounded-lg border border-codes-border bg-codes-panel/60 px-4 py-2">
        <p className="text-[10px] font-bold tracking-wider text-codes-muted uppercase">
          Today's Plan
        </p>
        <TodayPlanInline />
      </div>
      <RecentProblemsFooter />
      <StayConnectedFooter />
    </footer>
  )
}

function TodayPlanInline() {
  const items = useStreamStore((s) => s.todayPlan)
  return (
    <ul className="mt-1 space-y-0.5">
      {items.map((item) => (
        <li key={item.id} className="truncate text-xs text-codes-text">
          {item.done ? '✓' : '○'} {item.label}
        </li>
      ))}
    </ul>
  )
}

export function LoadingStatusBar() {
  const progress = useStreamStore((s) => s.loadingProgress)
  return (
    <Panel className="p-4">
      <p className="mb-2 text-[10px] font-bold tracking-wider text-codes-muted uppercase">
        Loading Status
      </p>
      <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-codes-accent transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-codes-muted">&gt; Getting ready to code</p>
      <p className="text-xs text-codes-muted">&gt; See you in a few minutes!</p>
    </Panel>
  )
}

export function DecorativeCodeSnippet() {
  return (
    <pre className="font-mono text-[11px] leading-relaxed text-slate-600 select-none">
      {`def solve(problem):
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
