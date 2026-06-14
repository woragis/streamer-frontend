import { ObsCanvas } from '@/components/shared/ObsCanvas'
import { StreamHeader } from '@/components/shared/StreamHeader'
import { useObsMode } from '@/hooks/useObsMode'
import { useCountdown, useStreamTimer } from '@/hooks/useTimers'
import { useStreamStore } from '@/hooks/useStreamStore'
import {
  CountdownDisplay,
  CurrentProblemCard,
  ProgressCard,
  StreamTimeCard,
  WeekGoalCard,
  WeekGoalGauge,
} from '@/components/shared/Widgets'
import {
  ChecklistWidget,
  RecentProblemsList,
  ScheduleWidget,
  StatsWidget,
  StayConnectedWidget,
  LatestProblemWidget,
  NotesWidget,
} from '@/components/shared/Lists'
import {
  CodesMainFooter,
  CodesFooterRow,
  DecorativeCodeSnippet,
  LoadingStatusBar,
  LiveCamSlot,
  StreamFooter,
} from '@/components/shared/Footer'
import {
  LeetCodePanel,
  CodeEditorPanel,
  WhiteboardPanel,
  CurrentApproachBar,
} from '@/components/codes/Panels'

export function StartingSoonPage() {
  const obs = useObsMode()
  useCountdown('startingSoonCountdown', 'startingSoonRunning')
  const countdown = useStreamStore((s) => s.startingSoonCountdown)
  const subtext = useStreamStore((s) => s.startingSoonSubtext)
  const handle = useStreamStore((s) => s.handle)

  return (
    <ObsCanvas obs={obs}>
      <StreamHeader statusLabel="Live Soon" statusDot="soon" />
      <div className="grid h-[calc(1080px-52px-90px)] grid-cols-12 gap-4 px-6 py-4">
        <div className="col-span-2 flex items-center pt-8">
          <DecorativeCodeSnippet />
        </div>
        <div className="col-span-5 flex flex-col items-center justify-center">
          <h1 className="mb-2 text-5xl font-black tracking-tight text-white uppercase">
            Stream Starting Soon
          </h1>
          <p className="mb-8 text-center text-sm tracking-wider text-codes-accent uppercase">
            {subtext}
          </p>
          <div className="rounded-xl border border-codes-accent/40 bg-codes-panel/60 px-16 py-8">
            <CountdownDisplay seconds={countdown} label="Starting In" />
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm text-codes-muted">
            <span>YT</span>
            <span>K</span>
            <span>𝕏</span>
            <span className="text-codes-text">{handle}</span>
          </div>
        </div>
        <div className="col-span-2 space-y-3">
          <ChecklistWidget />
          <StatsWidget />
          <LatestProblemWidget />
          <ScheduleWidget />
          <StayConnectedWidget />
        </div>
        <div className="col-span-3 space-y-3">
          <WeekGoalGauge />
          <LoadingStatusBar />
          <RecentProblemsList />
        </div>
      </div>
      <footer className="grid h-[90px] grid-cols-4 gap-3 border-t border-codes-border/80 px-6 py-3">
        <DecorativeCodeSnippet />
        <RecentProblemsList compact />
        <WeekGoalGauge />
        <LoadingStatusBar />
      </footer>
    </ObsCanvas>
  )
}

export function BrbPage() {
  const obs = useObsMode()
  useCountdown('brbCountdown', 'brbRunning')
  const countdown = useStreamStore((s) => s.brbCountdown)
  const subtext = useStreamStore((s) => s.brbSubtext)
  const brbMessage = useStreamStore((s) => s.brbMessage)
  const progressToday = useStreamStore((s) => s.progressToday)

  return (
    <ObsCanvas obs={obs}>
      <StreamHeader statusLabel="Live" statusDot="live" />
      <div className="grid h-[calc(1080px-52px-90px)] grid-cols-12 gap-4 px-6 py-4">
        <div className="col-span-2 space-y-3 pt-16">
          <ProgressCard
            title="Today's Progress"
            current={progressToday.current}
            target={progressToday.target}
            subtitle="Problems Solved"
          />
        </div>
        <div className="relative col-span-5 flex flex-col items-center justify-center">
          <DecorativeCodeSnippet />
          <span className="absolute top-8 text-6xl text-slate-800 select-none">{'{'}{'}'}</span>
          <span className="mb-4 text-codes-accent">&lt;/&gt;</span>
          <h1 className="mb-2 text-6xl font-black text-white uppercase">
            Be Right <span className="text-codes-accent">Back</span>
          </h1>
          <p className="mb-8 text-center text-xs tracking-[0.2em] text-codes-muted uppercase">
            {subtext}
          </p>
          <div className="rounded-xl border border-codes-accent/40 bg-codes-panel/60 px-12 py-6">
            <CountdownDisplay
              seconds={countdown}
              label={brbMessage}
              showProgress
              totalSeconds={300}
            />
            <p className="mt-4 text-center text-xs tracking-wider text-codes-muted uppercase">
              Thank you for waiting!
            </p>
          </div>
        </div>
        <div className="col-span-2 space-y-3">
          <CurrentProblemCard />
          <StreamTimeCard />
          <WeekGoalCard />
          <ChecklistWidget />
          <LiveCamSlot className="h-[140px]" />
          <StayConnectedWidget />
        </div>
      </div>
      <CodesFooterRow />
    </ObsCanvas>
  )
}

export function MainCodingPage() {
  const obs = useObsMode()
  useStreamTimer()
  const progressToday = useStreamStore((s) => s.progressToday)

  return (
    <ObsCanvas obs={obs}>
      <StreamHeader statusLabel="Live" statusDot="live" />
      <div className="grid h-[calc(1080px-52px-90px)] grid-cols-12 gap-3 px-4 py-3">
        <div className="col-span-3 overflow-hidden">
          <LeetCodePanel />
        </div>
        <div className="col-span-5 overflow-hidden">
          <CodeEditorPanel />
        </div>
        <div className="col-span-4 space-y-3">
          <CurrentProblemCard />
          <ProgressCard
            title="Progress Today"
            current={progressToday.current}
            target={progressToday.target}
            subtitle="Problems Solved"
          />
          <StreamTimeCard />
          <WeekGoalCard />
          <LiveCamSlot className="h-[200px]" />
        </div>
      </div>
      <CodesMainFooter />
    </ObsCanvas>
  )
}

export function WhiteboardPage() {
  const obs = useObsMode()
  useStreamTimer()
  const progressToday = useStreamStore((s) => s.progressToday)

  return (
    <ObsCanvas obs={obs}>
      <StreamHeader statusLabel="Live" statusDot="live" />
      <div className="grid h-[calc(1080px-52px-90px)] grid-cols-12 gap-3 px-4 py-3">
        <div className="col-span-2 space-y-3">
          <CurrentProblemCard />
          <ProgressCard
            title="Progress Today"
            current={progressToday.current}
            target={progressToday.target}
            subtitle="Problems Solved"
          />
          <WeekGoalCard />
          <StreamTimeCard />
          <ChecklistWidget />
        </div>
        <div className="col-span-7 overflow-hidden">
          <WhiteboardPanel />
        </div>
        <div className="col-span-3 space-y-3">
          <LiveCamSlot className="h-[180px]" />
          <NotesWidget />
          <CurrentApproachBar />
          <StreamTimeCard />
        </div>
      </div>
      <StreamFooter showEvents />
    </ObsCanvas>
  )
}
