import { ObsCanvas } from '@/components/shared/ObsCanvas'
import { useObsMode } from '@/hooks/useObsMode'
import {
  useBrbTimer,
  useCodesCopy,
  useProgressToday,
  useStartingSoonTimer,
  useCurrentProblem,
  useWhiteboard,
  useBranding,
  useStreamTimerDisplay,
  useWeekGoal,
  useCodesGoals,
} from '@/hooks/useOverlayData'
import {
  CODES_SIDEBAR_LEFT_ANALYSIS_W,
  CODES_SIDEBAR_LEFT_BRB_W,
  CODES_SIDEBAR_LEFT_MAIN_W,
  CODES_SIDEBAR_LEFT_WB_W,
  CODES_SIDEBAR_RIGHT_W,
} from '@/constants/codes-layout'
import {
  CodesContentShell,
  CodesLayoutGrid,
  CodesLayeredContent,
  CodesLeftSidebar,
  CodesRightSidebar,
  CodesScreenHole,
} from '@/components/codes/CodesLayoutShell'
import {
  CodesShell,
  CountdownBox,
  BraceDecoration,
  SocialRow,
  CurrentProblemWidget,
  ProgressTodayWidget,
  StreamTimeWidget,
  WeekGoalWidget,
  StatsWidget,
  TodayPlanWidget,
  LatestProblemWidget,
  ScheduleWidget,
  StayConnectedWidget,
  MainCodingFooter,
  StartingSoonFooter,
  BrbFooter,
  WhiteboardFooter,
  ProgressTrack,
  DifficultyTag,
  Widget,
  FooterCell,
  MottoFooter,
} from '@/components/codes/CodesLayout'
import { IconCode } from '@/components/codes/Icons'
import {
  LeetCodeMock,
  CodeEditorMock,
  WhiteboardMock,
  NotesWidgetPanel,
  ApproachWidget,
  TimerWidget,
} from '@/components/codes/Mocks'

const rightW = `${CODES_SIDEBAR_RIGHT_W}px`

export function StartingSoonPage() {
  const obs = useObsMode()
  const startingSoon = useStartingSoonTimer()
  const subtext = useCodesCopy().startingSoonSubtext

  return (
    <ObsCanvas obs={obs}>
      <CodesShell footer={<StartingSoonFooter />}>
        <CodesContentShell>
          <CodesLayeredContent>
            <CodesLayoutGrid columns={`1fr ${rightW}`}>
              <div className="flex flex-col items-center justify-center px-8 text-center">
                <div className="max-w-[680px] rounded-2xl bg-black/55 px-10 py-10 backdrop-blur-sm">
                  <p className="mb-2 text-[11px] font-bold tracking-[0.2em] text-codes-accent uppercase">
                    LeetCode Live
                  </p>
                  <h1 className="mb-3 text-[56px] leading-none font-black tracking-tight text-white uppercase">
                    Stream Starting Soon
                  </h1>
                  <p className="mb-10 text-[12px] tracking-[0.14em] text-codes-muted uppercase">
                    {subtext}
                  </p>
                  <div className="codes-widget-accent mx-auto w-[420px] rounded-2xl px-10 py-8">
                    <CountdownBox label="Starting In" seconds={startingSoon.seconds} />
                  </div>
                  <div className="mt-8">
                    <SocialRow />
                  </div>
                </div>
              </div>

              <CodesRightSidebar showWebcam={false}>
                <TodayPlanWidget />
                <StatsWidget />
                <LatestProblemWidget />
                <ScheduleWidget />
                <StayConnectedWidget />
              </CodesRightSidebar>
            </CodesLayoutGrid>
          </CodesLayeredContent>
        </CodesContentShell>
      </CodesShell>
    </ObsCanvas>
  )
}

export function BrbPage() {
  const obs = useObsMode()
  const brb = useBrbTimer()
  const copy = useCodesCopy()
  const progressToday = useProgressToday()

  return (
    <ObsCanvas obs={obs}>
      <CodesShell footer={<BrbFooter />}>
        <CodesContentShell>
          <CodesLayoutGrid columns={`${CODES_SIDEBAR_LEFT_BRB_W}px 1fr ${rightW}`}>
            <div className="pt-4">
              <div className="codes-widget p-4">
                <p className="mb-2 text-[10px] font-bold tracking-[0.14em] text-codes-accent uppercase">
                  Today&apos;s Progress
                </p>
                <p className="mb-1 text-[28px] font-bold text-white">
                  {progressToday.current}{' '}
                  <span className="text-[18px] text-codes-muted">/ {progressToday.target}</span>
                </p>
                <p className="mb-3 text-[11px] text-codes-muted">Problems Solved</p>
                <ProgressTrack current={progressToday.current} target={progressToday.target} />
              </div>
            </div>

            <div className="relative flex flex-col items-center justify-center">
              <BraceDecoration />
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-codes-accent/15 text-codes-accent">
                <IconCode className="h-6 w-6" />
              </span>
              <h1 className="mb-2 text-[64px] leading-none font-black text-white uppercase">
                Be Right <span className="text-codes-accent">Back</span>
              </h1>
              <p className="mb-8 text-[11px] tracking-[0.16em] text-codes-muted uppercase">
                {copy.brbSubtext}
              </p>
              <div className="codes-widget-accent w-[400px] rounded-2xl px-8 py-7">
                <CountdownBox
                  label={copy.brbMessage}
                  seconds={brb.seconds}
                  showBar
                  totalSeconds={300}
                />
                <p className="mt-4 text-center text-[10px] tracking-[0.14em] text-codes-muted uppercase">
                  Thank you for waiting!
                </p>
              </div>
            </div>

            <CodesRightSidebar>
              <CurrentProblemWidget />
              <StreamTimeWidget />
              <WeekGoalWidget />
              <TodayPlanWidget />
              <StayConnectedWidget />
            </CodesRightSidebar>
          </CodesLayoutGrid>
        </CodesContentShell>
      </CodesShell>
    </ObsCanvas>
  )
}

export function BreakPage() {
  const obs = useObsMode()
  const copy = useCodesCopy()
  const stream = useStreamTimerDisplay()

  return (
    <ObsCanvas obs={obs}>
      <CodesShell footer={<BrbFooter />}>
        <CodesContentShell>
          <CodesLayoutGrid columns={`1fr ${rightW}`}>
            <div className="flex flex-col items-center justify-center text-center">
              <p className="mb-2 text-[11px] font-bold tracking-[0.2em] text-codes-accent uppercase">
                Quick Break
              </p>
              <h1 className="mb-3 text-[72px] leading-none font-black text-white uppercase">
                Break <span className="text-codes-accent">Time</span>
              </h1>
              <p className="mb-8 max-w-[560px] text-[12px] tracking-[0.14em] text-codes-muted uppercase">
                {copy.breakSubtext}
              </p>
              <div className="codes-widget w-[320px] rounded-xl px-8 py-6">
                <p className="mb-1 text-[10px] font-bold tracking-[0.14em] text-codes-muted uppercase">
                  Stream Time
                </p>
                <p className="font-mono text-[48px] font-bold text-white">{stream.formatted}</p>
              </div>
            </div>

            <CodesRightSidebar>
              <ProgressTodayWidget />
              <CurrentProblemWidget />
              <TodayPlanWidget />
              <WeekGoalWidget />
              <StayConnectedWidget />
            </CodesRightSidebar>
          </CodesLayoutGrid>
        </CodesContentShell>
      </CodesShell>
    </ObsCanvas>
  )
}

export function MainCodingPage() {
  const obs = useObsMode()

  return (
    <ObsCanvas obs={obs}>
      <CodesShell footer={<MainCodingFooter />}>
        <CodesContentShell>
          <CodesLayoutGrid
            columns={`${CODES_SIDEBAR_LEFT_MAIN_W}px 1fr ${rightW}`}
          >
            {obs ? (
              <CodesScreenHole label="Screen / LeetCode" obs className="h-full" />
            ) : (
              <LeetCodeMock />
            )}
            {obs ? (
              <CodesScreenHole label="Editor / Terminal" obs className="h-full" />
            ) : (
              <CodeEditorMock />
            )}
            <CodesRightSidebar>
              <CurrentProblemWidget />
              <ProgressTodayWidget />
              <StreamTimeWidget />
              <WeekGoalWidget />
            </CodesRightSidebar>
          </CodesLayoutGrid>
        </CodesContentShell>
      </CodesShell>
    </ObsCanvas>
  )
}

export function WhiteboardPage() {
  const obs = useObsMode()

  return (
    <ObsCanvas obs={obs}>
      <CodesShell footer={<WhiteboardFooter />}>
        <CodesContentShell>
          <CodesLayoutGrid columns={`${CODES_SIDEBAR_LEFT_WB_W}px 1fr ${rightW}`}>
            <CodesLeftSidebar width={CODES_SIDEBAR_LEFT_WB_W}>
              <CurrentProblemWidget />
              <ProgressTodayWidget />
              <WeekGoalWidget />
              <StreamTimeWidget />
              <TodayPlanWidget />
            </CodesLeftSidebar>
            {obs ? (
              <CodesScreenHole label="Whiteboard / Screen" obs className="h-full" />
            ) : (
              <WhiteboardMock />
            )}
            <CodesRightSidebar>
              <NotesWidgetPanel />
              <ApproachWidget />
              <TimerWidget />
            </CodesRightSidebar>
          </CodesLayoutGrid>
        </CodesContentShell>
      </CodesShell>
    </ObsCanvas>
  )
}

export function ProblemAnalysisPage() {
  const obs = useObsMode()
  const problem = useCurrentProblem()
  const wb = useWhiteboard()

  return (
    <ObsCanvas obs={obs}>
      <CodesShell footer={<WhiteboardFooter />}>
        <CodesContentShell>
          <CodesLayoutGrid columns={`${CODES_SIDEBAR_LEFT_ANALYSIS_W}px 1fr ${rightW}`}>
            <CodesLeftSidebar width={CODES_SIDEBAR_LEFT_ANALYSIS_W}>
              <CurrentProblemWidget />
              {problem && (
                <Widget title="Problem" accent>
                  <p className="mb-2 text-[13px] leading-snug font-semibold text-white">
                    {problem.id}. {problem.title}
                  </p>
                  <DifficultyTag difficulty={problem.difficulty} />
                  <p className="mt-3 line-clamp-6 text-[12px] leading-relaxed text-codes-text">
                    {problem.description}
                  </p>
                </Widget>
              )}
              <ProgressTodayWidget />
              <StreamTimeWidget />
            </CodesLeftSidebar>

            <div className="codes-glow-border flex min-h-0 flex-col overflow-hidden rounded-xl bg-codes-panel">
              <div className="border-b border-codes-border px-5 py-3">
                <p className="text-[10px] font-bold tracking-[0.16em] text-codes-accent uppercase">
                  Post-Solve Analysis
                </p>
                <h2 className="mt-1 text-[22px] font-bold text-white">
                  {wb.title || 'Solution Walkthrough'}
                </h2>
              </div>
              <div className="overlay-scroll flex-1 space-y-5 overflow-y-auto p-6">
                <section>
                  <p className="mb-2 text-[10px] font-bold tracking-[0.14em] text-codes-muted uppercase">
                    Approach
                  </p>
                  <p className="text-[15px] font-semibold text-codes-accent">{wb.approach}</p>
                </section>
                <section>
                  <p className="mb-3 text-[10px] font-bold tracking-[0.14em] text-codes-muted uppercase">
                    Key Steps
                  </p>
                  <ul className="space-y-2.5">
                    {wb.bullets.map((b, i) => (
                      <li key={i} className="flex gap-3 text-[13px] leading-relaxed text-codes-text">
                        <span className="font-mono text-codes-accent">{i + 1}.</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="grid grid-cols-3 gap-3">
                  <ComplexityCard label="Time" value="O(n)" />
                  <ComplexityCard label="Space" value="O(h)" />
                  <ComplexityCard label="Pattern" value="DFS" />
                </section>
              </div>
            </div>

            <CodesRightSidebar>
              <NotesWidgetPanel />
              <ApproachWidget />
              <TimerWidget />
            </CodesRightSidebar>
          </CodesLayoutGrid>
        </CodesContentShell>
      </CodesShell>
    </ObsCanvas>
  )
}

function ComplexityCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="codes-widget p-3 text-center">
      <p className="mb-1 text-[9px] font-bold tracking-[0.12em] text-codes-muted uppercase">{label}</p>
      <p className="font-mono text-[18px] font-bold text-white">{value}</p>
    </div>
  )
}

export function EndScreenPage() {
  const obs = useObsMode()
  const progressToday = useProgressToday()
  const weekGoal = useWeekGoal()
  const goals = useCodesGoals()
  const stream = useStreamTimerDisplay()
  const branding = useBranding()

  return (
    <ObsCanvas obs={obs}>
      <CodesShell status="ENDED" statusDot="soon" footer={<EndScreenFooter />}>
        <CodesContentShell>
          <CodesLayeredContent>
            <div className="relative flex h-full flex-col items-center justify-center px-12 text-center">
              <div className="max-w-[920px] rounded-2xl bg-black/60 px-12 py-10 backdrop-blur-sm">
                <p className="mb-2 text-[11px] font-bold tracking-[0.2em] text-codes-accent uppercase">
                  Stream Ended
                </p>
                <h1 className="mb-4 text-[56px] leading-none font-black tracking-tight text-white uppercase">
                  Thanks for <span className="text-codes-accent">Watching</span>
                </h1>
                <p className="mb-10 text-[12px] tracking-[0.14em] text-codes-muted uppercase">
                  See you next stream · {branding.schedule}
                </p>

                <div className="mb-10 grid grid-cols-4 gap-4">
                  <EndStat label="Today" value={`${progressToday.current}/${progressToday.target}`} sub="problems" />
                  <EndStat label="Week" value={`${weekGoal.current}/${weekGoal.target}`} sub="problems" />
                  <EndStat label="Streak" value={String(goals.streak)} sub="days" />
                  <EndStat label="Stream" value={stream.formatted} sub="duration" />
                </div>

                <SocialRow />
              </div>
            </div>
          </CodesLayeredContent>
        </CodesContentShell>
      </CodesShell>
    </ObsCanvas>
  )
}

function EndStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="codes-widget-accent rounded-xl px-6 py-5">
      <p className="mb-1 text-[10px] font-bold tracking-[0.14em] text-codes-muted uppercase">{label}</p>
      <p className="font-mono text-[36px] font-bold text-white">{value}</p>
      <p className="text-[10px] tracking-[0.12em] text-codes-muted uppercase">{sub}</p>
    </div>
  )
}

function EndScreenFooter() {
  const { discord, twitter, youtube, kick } = useBranding().social
  return (
    <footer className="grid h-[88px] shrink-0 grid-cols-3 gap-3 border-t border-codes-border px-4 py-2.5">
      <MottoFooter />
      <FooterCell title="Follow">
        <p className="text-[11px] text-codes-text">YouTube · {youtube}</p>
        <p className="text-[11px] text-codes-text">Kick · {kick}</p>
      </FooterCell>
      <FooterCell title="Community">
        <p className="text-[11px] text-codes-text">Discord · {discord}</p>
        <p className="text-[11px] text-codes-text">Twitter · {twitter}</p>
      </FooterCell>
    </footer>
  )
}
