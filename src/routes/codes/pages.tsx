import { ObsCanvas } from '@/components/shared/ObsCanvas'
import { useObsMode } from '@/hooks/useObsMode'
import {
  useBrbTimer,
  useCodesCopy,
  useProgressToday,
  useStartingSoonTimer,
} from '@/hooks/useOverlayData'
import {
  CodesShell,
  CountdownBox,
  CodeWatermark,
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
  LiveCam,
  MainCodingFooter,
  StartingSoonFooter,
  BrbFooter,
  WhiteboardFooter,
  ProgressTrack,
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

export function StartingSoonPage() {
  const obs = useObsMode()
  const startingSoon = useStartingSoonTimer()
  const subtext = useCodesCopy().startingSoonSubtext

  return (
    <ObsCanvas obs={obs}>
      <CodesShell footer={<StartingSoonFooter />}>
        <div className="relative grid h-full grid-cols-[280px_1fr_340px] gap-5 px-5 py-4">
          <div className="pt-6">
            <CodeWatermark />
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <p className="mb-2 text-[11px] font-bold tracking-[0.2em] text-codes-accent uppercase">
              LeetCode Live
            </p>
            <h1 className="mb-3 text-[56px] leading-none font-black tracking-tight text-white uppercase">
              Stream Starting Soon
            </h1>
            <p className="mb-10 max-w-[620px] text-[12px] tracking-[0.14em] text-codes-muted uppercase">
              {subtext}
            </p>
            <div className="codes-widget-accent w-[420px] rounded-2xl px-10 py-8">
              <CountdownBox label="Starting In" seconds={startingSoon.seconds} />
            </div>
            <SocialRow />
          </div>

          <div className="space-y-3 overflow-y-auto">
            <TodayPlanWidget />
            <StatsWidget />
            <LatestProblemWidget />
            <ScheduleWidget />
            <StayConnectedWidget />
          </div>
        </div>
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
        <div className="relative grid h-full grid-cols-[260px_1fr_300px] gap-4 px-5 py-4">
          <div className="pt-20">
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
            <CodeWatermark className="absolute top-0 left-0 opacity-40" />
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

          <div className="space-y-2.5 overflow-y-auto">
            <CurrentProblemWidget />
            <StreamTimeWidget />
            <WeekGoalWidget />
            <TodayPlanWidget />
            <LiveCam className="h-[130px]" />
            <StayConnectedWidget />
          </div>
        </div>
      </CodesShell>
    </ObsCanvas>
  )
}

export function MainCodingPage() {
  const obs = useObsMode()

  return (
    <ObsCanvas obs={obs}>
      <CodesShell footer={<MainCodingFooter />}>
        <div className="grid h-full grid-cols-[480px_1fr_340px] gap-3 px-3 py-3">
          <LeetCodeMock />
          <CodeEditorMock />
          <div className="flex flex-col gap-2.5 overflow-hidden">
            <CurrentProblemWidget />
            <ProgressTodayWidget />
            <StreamTimeWidget />
            <WeekGoalWidget />
            <LiveCam className="min-h-0 flex-1" />
          </div>
        </div>
      </CodesShell>
    </ObsCanvas>
  )
}

export function WhiteboardPage() {
  const obs = useObsMode()

  return (
    <ObsCanvas obs={obs}>
      <CodesShell footer={<WhiteboardFooter />}>
        <div className="grid h-full grid-cols-[240px_1fr_280px] gap-3 px-3 py-3">
          <div className="flex flex-col gap-2.5 overflow-y-auto">
            <CurrentProblemWidget />
            <ProgressTodayWidget />
            <WeekGoalWidget />
            <StreamTimeWidget />
            <TodayPlanWidget />
          </div>
          <WhiteboardMock />
          <div className="flex flex-col gap-2.5 overflow-hidden">
            <LiveCam className="h-[160px] shrink-0" />
            <NotesWidgetPanel />
            <ApproachWidget />
            <TimerWidget />
          </div>
        </div>
      </CodesShell>
    </ObsCanvas>
  )
}
