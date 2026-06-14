import { Link } from '@tanstack/react-router'
import { patchStreamState, streamStore } from '@/stores/stream-store'
import { useStreamState } from '@/hooks/useStreamStore'
import { ObsPreview } from '@/components/shared/ObsCanvas'
import { StartingSoonPage, BrbPage, MainCodingPage, WhiteboardPage } from '@/routes/codes/pages'
import { CalisthenicsMainPage } from '@/routes/calisthenics/pages'
import { defaultStreamState } from '@/stores/types'
import { persistState, STORAGE_KEY } from '@/stores/persistence'

const codesRoutes = [
  { path: '/codes/starting-soon', label: 'Starting Soon' },
  { path: '/codes/main', label: 'Main Coding' },
  { path: '/codes/brb', label: 'BRB' },
  { path: '/codes/whiteboard', label: 'Whiteboard' },
]

const calRoutes = [{ path: '/calisthenics/main', label: 'Main Workout' }]

export function ControlPage() {
  const state = useStreamState()

  const set = (partial: Parameters<typeof patchStreamState>[0]) => patchStreamState(partial)

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY)
    streamStore.setState(() => ({ ...defaultStreamState }))
    persistState(defaultStreamState)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-8 py-6">
        <h1 className="text-2xl font-bold">Woragis Stream Control</h1>
        <p className="mt-1 text-sm text-slate-400">
          Edite o estado aqui — persiste no localStorage e sincroniza com as telas OBS.
          Use <code className="text-codes-accent">?obs=1</code> na URL para modo overlay.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 p-8 xl:grid-cols-2">
        <section className="space-y-6">
          <Panel title="Rotas OBS — WoragisCodes">
            <ul className="space-y-2">
              {codesRoutes.map((r) => (
                <RouteLink key={r.path} path={r.path} label={r.label} />
              ))}
            </ul>
          </Panel>

          <Panel title="Rotas OBS — WoragisCalisthenics">
            <ul className="space-y-2">
              {calRoutes.map((r) => (
                <RouteLink key={r.path} path={r.path} label={r.label} />
              ))}
            </ul>
          </Panel>

          <Panel title="Branding">
            <Field label="Brand Title">
              <input
                className={inputClass}
                value={state.brandTitle}
                onChange={(e) => set({ brandTitle: e.target.value })}
              />
            </Field>
            <Field label="Handle">
              <input
                className={inputClass}
                value={state.handle}
                onChange={(e) => set({ handle: e.target.value })}
              />
            </Field>
            <Field label="Motto (Codes)">
              <input
                className={inputClass}
                value={state.motto}
                onChange={(e) => set({ motto: e.target.value })}
              />
            </Field>
            <Field label="Motto (Calisthenics)">
              <input
                className={inputClass}
                value={state.calisthenicsMotto}
                onChange={(e) => set({ calisthenicsMotto: e.target.value })}
              />
            </Field>
          </Panel>

          <Panel title="Social">
            <Field label="Discord">
              <input
                className={inputClass}
                value={state.discord}
                onChange={(e) => set({ discord: e.target.value })}
              />
            </Field>
            <Field label="Twitter">
              <input
                className={inputClass}
                value={state.twitter}
                onChange={(e) => set({ twitter: e.target.value })}
              />
            </Field>
            <Field label="Schedule">
              <input
                className={inputClass}
                value={state.schedule}
                onChange={(e) => set({ schedule: e.target.value })}
              />
            </Field>
          </Panel>

          <Panel title="Timers">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Stream Time (seconds)">
                <NumberInput
                  value={state.streamTimeSeconds}
                  onChange={(v) => set({ streamTimeSeconds: v })}
                />
              </Field>
              <Field label="Stream Timer Running">
                <Toggle
                  checked={state.streamTimeRunning}
                  onChange={(v) => set({ streamTimeRunning: v })}
                />
              </Field>
              <Field label="Starting Soon (sec)">
                <NumberInput
                  value={state.startingSoonCountdown}
                  onChange={(v) => set({ startingSoonCountdown: v })}
                />
              </Field>
              <Field label="Starting Soon Running">
                <Toggle
                  checked={state.startingSoonRunning}
                  onChange={(v) => set({ startingSoonRunning: v })}
                />
              </Field>
              <Field label="BRB Countdown (sec)">
                <NumberInput
                  value={state.brbCountdown}
                  onChange={(v) => set({ brbCountdown: v })}
                />
              </Field>
              <Field label="BRB Running">
                <Toggle
                  checked={state.brbRunning}
                  onChange={(v) => set({ brbRunning: v })}
                />
              </Field>
              <Field label="Rest Timer (sec)">
                <NumberInput
                  value={state.restTimerSeconds}
                  onChange={(v) => set({ restTimerSeconds: v })}
                />
              </Field>
              <Field label="Rest Timer Running">
                <Toggle
                  checked={state.restTimerRunning}
                  onChange={(v) => set({ restTimerRunning: v })}
                />
              </Field>
              <Field label="Loading Progress (%)">
                <NumberInput
                  value={state.loadingProgress}
                  onChange={(v) => set({ loadingProgress: v })}
                />
              </Field>
            </div>
          </Panel>

          <Panel title="Progress & Goals">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Today Current">
                <NumberInput
                  value={state.progressToday.current}
                  onChange={(v) =>
                    set({ progressToday: { ...state.progressToday, current: v } })
                  }
                />
              </Field>
              <Field label="Today Target">
                <NumberInput
                  value={state.progressToday.target}
                  onChange={(v) =>
                    set({ progressToday: { ...state.progressToday, target: v } })
                  }
                />
              </Field>
              <Field label="Week Current">
                <NumberInput
                  value={state.weekGoal.current}
                  onChange={(v) => set({ weekGoal: { ...state.weekGoal, current: v } })}
                />
              </Field>
              <Field label="Week Target">
                <NumberInput
                  value={state.weekGoal.target}
                  onChange={(v) => set({ weekGoal: { ...state.weekGoal, target: v } })}
                />
              </Field>
              <Field label="Streak (days)">
                <NumberInput value={state.streak} onChange={(v) => set({ streak: v })} />
              </Field>
            </div>
          </Panel>

          <Panel title="Current Problem">
            <Field label="ID">
              <NumberInput
                value={state.currentProblem.id}
                onChange={(v) =>
                  set({ currentProblem: { ...state.currentProblem, id: v } })
                }
              />
            </Field>
            <Field label="Title">
              <input
                className={inputClass}
                value={state.currentProblem.title}
                onChange={(e) =>
                  set({ currentProblem: { ...state.currentProblem, title: e.target.value } })
                }
              />
            </Field>
            <Field label="Difficulty">
              <select
                className={inputClass}
                value={state.currentProblem.difficulty}
                onChange={(e) =>
                  set({
                    currentProblem: {
                      ...state.currentProblem,
                      difficulty: e.target.value as 'easy' | 'medium' | 'hard',
                    },
                  })
                }
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </Field>
            <Field label="Description">
              <textarea
                className={`${inputClass} min-h-[80px]`}
                value={state.currentProblem.description}
                onChange={(e) =>
                  set({
                    currentProblem: { ...state.currentProblem, description: e.target.value },
                  })
                }
              />
            </Field>
          </Panel>

          <Panel title="Code Editor">
            <Field label="File Name">
              <input
                className={inputClass}
                value={state.codeFileName}
                onChange={(e) => set({ codeFileName: e.target.value })}
              />
            </Field>
            <Field label="Content">
              <textarea
                className={`${inputClass} min-h-[200px] font-mono text-xs`}
                value={state.codeContent}
                onChange={(e) => set({ codeContent: e.target.value })}
              />
            </Field>
          </Panel>

          <Panel title="Whiteboard">
            <Field label="Title">
              <input
                className={inputClass}
                value={state.whiteboardTitle}
                onChange={(e) => set({ whiteboardTitle: e.target.value })}
              />
            </Field>
            <Field label="Bullets (one per line)">
              <textarea
                className={`${inputClass} min-h-[100px]`}
                value={state.whiteboardBullets.join('\n')}
                onChange={(e) =>
                  set({ whiteboardBullets: e.target.value.split('\n').filter(Boolean) })
                }
              />
            </Field>
            <Field label="Notes (one per line)">
              <textarea
                className={`${inputClass} min-h-[80px]`}
                value={state.whiteboardNotes.join('\n')}
                onChange={(e) =>
                  set({ whiteboardNotes: e.target.value.split('\n').filter(Boolean) })
                }
              />
            </Field>
            <Field label="Current Approach">
              <input
                className={inputClass}
                value={state.currentApproach}
                onChange={(e) => set({ currentApproach: e.target.value })}
              />
            </Field>
          </Panel>

          <Panel title="Today's Plan">
            {state.todayPlan.map((item, i) => (
              <div key={item.id} className="mb-2 flex gap-2">
                <input
                  className={`${inputClass} flex-1`}
                  value={item.label}
                  onChange={(e) => {
                    const todayPlan = [...state.todayPlan]
                    todayPlan[i] = { ...item, label: e.target.value }
                    set({ todayPlan })
                  }}
                />
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={(e) => {
                      const todayPlan = [...state.todayPlan]
                      todayPlan[i] = { ...item, done: e.target.checked }
                      set({ todayPlan })
                    }}
                  />
                  Done
                </label>
              </div>
            ))}
          </Panel>

          <Panel title="Recent Problems">
            {state.recentProblems.map((p, i) => (
              <div key={p.id} className="mb-2 flex gap-2">
                <input
                  className={`${inputClass} w-16`}
                  value={p.id}
                  type="number"
                  onChange={(e) => {
                    const recentProblems = [...state.recentProblems]
                    recentProblems[i] = { ...p, id: Number(e.target.value) }
                    set({ recentProblems })
                  }}
                />
                <input
                  className={`${inputClass} flex-1`}
                  value={p.title}
                  onChange={(e) => {
                    const recentProblems = [...state.recentProblems]
                    recentProblems[i] = { ...p, title: e.target.value }
                    set({ recentProblems })
                  }}
                />
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={p.done}
                    onChange={(e) => {
                      const recentProblems = [...state.recentProblems]
                      recentProblems[i] = { ...p, done: e.target.checked }
                      set({ recentProblems })
                    }}
                  />
                  Done
                </label>
              </div>
            ))}
          </Panel>

          <Panel title="Calisthenics">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Workout Type">
                <input
                  className={inputClass}
                  value={state.workoutType}
                  onChange={(e) => set({ workoutType: e.target.value })}
                />
              </Field>
              <Field label="Current Exercise">
                <input
                  className={inputClass}
                  value={state.currentExercise}
                  onChange={(e) => set({ currentExercise: e.target.value })}
                />
              </Field>
              <Field label="Set Current">
                <NumberInput
                  value={state.currentSet.current}
                  onChange={(v) =>
                    set({ currentSet: { ...state.currentSet, current: v } })
                  }
                />
              </Field>
              <Field label="Set Total">
                <NumberInput
                  value={state.currentSet.total}
                  onChange={(v) => set({ currentSet: { ...state.currentSet, total: v } })}
                />
              </Field>
              <Field label="Reps Current">
                <NumberInput
                  value={state.currentReps.current}
                  onChange={(v) =>
                    set({ currentReps: { ...state.currentReps, current: v } })
                  }
                />
              </Field>
              <Field label="Reps Target">
                <NumberInput
                  value={state.currentReps.target}
                  onChange={(v) =>
                    set({ currentReps: { ...state.currentReps, target: v } })
                  }
                />
              </Field>
              <Field label="Total Reps">
                <NumberInput value={state.totalReps} onChange={(v) => set({ totalReps: v })} />
              </Field>
              <Field label="Goal Progress (%)">
                <NumberInput
                  value={state.todayGoalProgress}
                  onChange={(v) => set({ todayGoalProgress: v })}
                />
              </Field>
              <Field label="Goal Label">
                <input
                  className={inputClass}
                  value={state.todayGoalLabel}
                  onChange={(e) => set({ todayGoalLabel: e.target.value })}
                />
              </Field>
              <Field label="Up Next Exercise">
                <input
                  className={inputClass}
                  value={state.upNextExercise}
                  onChange={(e) => set({ upNextExercise: e.target.value })}
                />
              </Field>
              <Field label="Up Next Sets">
                <NumberInput
                  value={state.upNextSets}
                  onChange={(v) => set({ upNextSets: v })}
                />
              </Field>
            </div>
          </Panel>

          <Panel title="Stream Events">
            <Field label="Latest Subscriber">
              <input
                className={inputClass}
                value={state.latestSubscriber}
                onChange={(e) => set({ latestSubscriber: e.target.value })}
              />
            </Field>
            <Field label="Latest Follower">
              <input
                className={inputClass}
                value={state.latestFollower}
                onChange={(e) => set({ latestFollower: e.target.value })}
              />
            </Field>
            <Field label="Latest Donation">
              <input
                className={inputClass}
                value={state.latestDonation}
                onChange={(e) => set({ latestDonation: e.target.value })}
              />
            </Field>
          </Panel>

          <button
            type="button"
            onClick={resetAll}
            className="rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            Reset to defaults
          </button>
        </section>

        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-300">Previews</h2>
          <ObsPreview label="Starting Soon">
            <StartingSoonPage />
          </ObsPreview>
          <ObsPreview label="Main Coding">
            <MainCodingPage />
          </ObsPreview>
          <ObsPreview label="BRB">
            <BrbPage />
          </ObsPreview>
          <ObsPreview label="Whiteboard">
            <WhiteboardPage />
          </ObsPreview>
          <ObsPreview label="Calisthenics Main">
            <CalisthenicsMainPage />
          </ObsPreview>
        </section>
      </div>
    </div>
  )
}

function RouteLink({ path, label }: { path: string; label: string }) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-2">
      <span className="text-sm">{label}</span>
      <div className="flex gap-2">
        <Link to={path} className="text-xs text-codes-accent hover:underline">
          Preview
        </Link>
        <a
          href={`${path}?obs=1`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-emerald-400 hover:underline"
        >
          OBS URL
        </a>
      </div>
    </li>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-400 uppercase">
        {title}
      </h3>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-xs text-slate-500">{label}</span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-codes-accent'

function NumberInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <input
      type="number"
      className={inputClass}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4"
    />
  )
}
