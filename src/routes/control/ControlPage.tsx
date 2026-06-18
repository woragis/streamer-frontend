import { Link, useNavigate } from '@tanstack/react-router'
import { dispatch, resetStoreToDefaults } from '@/stores/app-store'
import { STORAGE_KEY } from '@/stores/persistence'
import { useAppState, useTimerDisplay } from '@/hooks/useAppStore'
import { useProgressToday, useWeekGoal } from '@/hooks/useOverlayData'
import { useApiSync } from '@/hooks/useApiSync'
import { STREAM_ROOMS } from '@/lib/room'
import { SCENE_CATALOG, CONTROL_SCENES } from '@/lib/scenes'
import { ScenePreviewCatalog } from '@/components/control/ScenePreviewCatalog'
import type { Difficulty, TimerId } from '@/stores/types'
import { TIMER_IDS } from '@/stores/timers'
import {
  addExercise,
  addPlanItem,
  addProblem,
  completeRep,
  completeSet,
  goLive,
  markProblemSolved,
  pauseTimer,
  removePlanItem,
  removeProblem,
  resetTimer,
  setActiveProblem,
  setScene,
  setTimerPreset,
  startTimer,
  togglePlanItem,
  updatePlanItemLabel,
  updateProblem,
} from '@/stores/actions'
import { selectSortedPlan } from '@/stores/selectors'
import { PlatformSettingsPanel } from '@/routes/control/PlatformSettingsPanel'

const roomCatalogFilter = (roomId: string): 'codes' | 'calisthenics' | 'all' => {
  if (roomId === 'codes') return 'codes'
  if (roomId === 'calisthenics') return 'calisthenics'
  return 'all'
}

export function ControlPage() {
  const state = useAppState()
  const progressToday = useProgressToday()
  const weekGoal = useWeekGoal()
  const navigate = useNavigate({ from: '/control' })
  const { roomId, apiSyncEnabled } = useApiSync('control')

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY)
    resetStoreToDefaults()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-8 py-6">
        <h1 className="text-2xl font-bold">Woragis Stream Control</h1>
        <p className="mt-1 text-sm text-slate-400">
          {apiSyncEnabled
            ? `Sincronizado com a API (room: ${roomId}) — overlays OBS recebem updates via WebSocket.`
            : 'Modo local (localStorage) — defina VITE_API_SYNC=true para sincronizar com a API.'}
        </p>
      </header>

      <section className="border-b border-slate-800 px-8 py-6">
        <h2 className="mb-1 text-lg font-semibold text-slate-200">Catálogo de telas</h2>
        <p className="mb-5 text-sm text-slate-500">
          Previews 16:9 — clique para expandir. Use Set scene ou OBS URL em cada card.
        </p>
        <ScenePreviewCatalog
          entries={SCENE_CATALOG}
          activeScene={state.session.scene}
          roomFilter={roomCatalogFilter(roomId)}
        />
      </section>

      <div className="grid grid-cols-1 gap-8 p-8 xl:grid-cols-2">
        <section className="space-y-6">
          <Panel title="Room">
            <div className="flex flex-wrap gap-2">
              {STREAM_ROOMS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => navigate({ search: { room: r.id } })}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    roomId === r.id ? 'bg-codes-accent text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </Panel>

          <PlatformSettingsPanel roomId={roomId} apiSyncEnabled={apiSyncEnabled} />

          <Panel title="Cena ativa">
            <div className="flex flex-wrap gap-2">
              {CONTROL_SCENES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => dispatch((st) => setScene(st, s.id))}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    state.session.scene === s.id
                      ? 'bg-codes-accent text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold"
              onClick={() => dispatch(goLive)}
            >
              Go Live (start stream timer)
            </button>
          </Panel>

          <Panel title="Timers">
            {TIMER_IDS.map((id) => (
              <TimerControl key={id} id={id} />
            ))}
          </Panel>

          <Panel title="Rotas OBS">
            <ul className="space-y-2">
              {SCENE_CATALOG.filter((r) =>
                roomFilterCards(roomId) === 'all' ? true : r.group === roomFilterCards(roomId),
              ).map((r) => (
                <RouteLink key={r.path} path={r.path} label={r.label} />
              ))}
            </ul>
          </Panel>

          <Panel title="Branding">
            <Field label="Brand Title">
              <input
                className={inputClass}
                value={state.branding.brandTitle}
                onChange={(e) =>
                  dispatch((s) => ({ ...s, branding: { ...s.branding, brandTitle: e.target.value } }))
                }
              />
            </Field>
            <Field label="Codes Handle">
              <input
                className={inputClass}
                value={state.branding.codesHandle}
                onChange={(e) =>
                  dispatch((s) => ({
                    ...s,
                    branding: { ...s.branding, codesHandle: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Calisthenics Handle">
              <input
                className={inputClass}
                value={state.branding.calisthenicsHandle}
                onChange={(e) =>
                  dispatch((s) => ({
                    ...s,
                    branding: { ...s.branding, calisthenicsHandle: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Schedule">
              <input
                className={inputClass}
                value={state.branding.schedule}
                onChange={(e) =>
                  dispatch((s) => ({ ...s, branding: { ...s.branding, schedule: e.target.value } }))
                }
              />
            </Field>
          </Panel>

          <Panel title={`Today's Plan (${selectSortedPlan(state).length})`}>
            {selectSortedPlan(state).map((item) => (
              <div key={item.id} className="mb-2 flex gap-2">
                <input
                  className={`${inputClass} flex-1`}
                  value={item.label}
                  onChange={(e) =>
                    dispatch((s) => updatePlanItemLabel(s, item.id, e.target.value))
                  }
                />
                <button
                  type="button"
                  className="rounded bg-slate-700 px-2 text-xs"
                  onClick={() => dispatch((s) => togglePlanItem(s, item.id))}
                >
                  {item.done ? '✓' : '○'}
                </button>
                <button
                  type="button"
                  className="rounded bg-red-900/50 px-2 text-xs text-red-300"
                  onClick={() => dispatch((s) => removePlanItem(s, item.id))}
                >
                  ×
                </button>
              </div>
            ))}
            <AddRow
              placeholder="Novo item do plano"
              onAdd={(label) => dispatch((s) => addPlanItem(s, label))}
            />
          </Panel>

          <Panel title={`Problems (${state.codes.problems.length})`}>
            <p className="mb-2 text-xs text-slate-500">
              Progress today: {progressToday.current}/{progressToday.target} · Week:{' '}
              {weekGoal.current}/{weekGoal.target}
            </p>
            {state.codes.problems.map((p) => (
              <div key={p.id} className="mb-3 rounded-lg border border-slate-800 p-3">
                <div className="mb-2 flex gap-2">
                  <input
                    className={`${inputClass} w-20`}
                    type="number"
                    value={p.id}
                    readOnly
                  />
                  <input
                    className={`${inputClass} flex-1`}
                    value={p.title}
                    onChange={(e) =>
                      dispatch((s) => updateProblem(s, p.id, { title: e.target.value }))
                    }
                  />
                  <select
                    className={inputClass}
                    value={p.status}
                    onChange={(e) => {
                      const status = e.target.value as typeof p.status
                      if (status === 'active') dispatch((s) => setActiveProblem(s, p.id))
                      else if (status === 'solved') dispatch((s) => markProblemSolved(s, p.id))
                      else
                        dispatch((s) => ({
                          ...s,
                          codes: {
                            ...s.codes,
                            problems: s.codes.problems.map((x) =>
                              x.id === p.id ? { ...x, status } : x,
                            ),
                          },
                        }))
                    }}
                  >
                    <option value="queued">queued</option>
                    <option value="active">active</option>
                    <option value="solved">solved</option>
                    <option value="skipped">skipped</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded bg-emerald-800 px-2 py-1 text-xs"
                    onClick={() => dispatch((s) => markProblemSolved(s, p.id))}
                  >
                    Mark solved
                  </button>
                  <button
                    type="button"
                    className="rounded bg-red-900/50 px-2 py-1 text-xs text-red-300"
                    onClick={() => dispatch((s) => removeProblem(s, p.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <AddProblemForm
              onAdd={(data) => dispatch((s) => addProblem(s, data))}
            />
          </Panel>

          <Panel title="Goals">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Daily target">
                <NumberInput
                  value={state.codes.goals.dailyTarget}
                  onChange={(v) =>
                    dispatch((s) => ({
                      ...s,
                      codes: { ...s.codes, goals: { ...s.codes.goals, dailyTarget: v } },
                    }))
                  }
                />
              </Field>
              <Field label="Weekly target">
                <NumberInput
                  value={state.codes.goals.weeklyTarget}
                  onChange={(v) =>
                    dispatch((s) => ({
                      ...s,
                      codes: { ...s.codes, goals: { ...s.codes.goals, weeklyTarget: v } },
                    }))
                  }
                />
              </Field>
              <Field label="Streak">
                <NumberInput
                  value={state.codes.goals.streak}
                  onChange={(v) =>
                    dispatch((s) => ({
                      ...s,
                      codes: { ...s.codes, goals: { ...s.codes.goals, streak: v } },
                    }))
                  }
                />
              </Field>
            </div>
          </Panel>

          <Panel title="Whiteboard & Code">
            <Field label="Whiteboard title">
              <input
                className={inputClass}
                value={state.codes.whiteboard.title}
                onChange={(e) =>
                  dispatch((s) => ({
                    ...s,
                    codes: {
                      ...s.codes,
                      whiteboard: { ...s.codes.whiteboard, title: e.target.value },
                    },
                  }))
                }
              />
            </Field>
            <Field label="Approach">
              <input
                className={inputClass}
                value={state.codes.whiteboard.approach}
                onChange={(e) =>
                  dispatch((s) => ({
                    ...s,
                    codes: {
                      ...s.codes,
                      whiteboard: { ...s.codes.whiteboard, approach: e.target.value },
                    },
                  }))
                }
              />
            </Field>
            <Field label="Code file">
              <input
                className={inputClass}
                value={state.codes.code.fileName}
                onChange={(e) =>
                  dispatch((s) => ({
                    ...s,
                    codes: { ...s.codes, code: { ...s.codes.code, fileName: e.target.value } },
                  }))
                }
              />
            </Field>
            <Field label="Code">
              <textarea
                className={`${inputClass} min-h-[120px] font-mono text-xs`}
                value={state.codes.code.content}
                onChange={(e) =>
                  dispatch((s) => ({
                    ...s,
                    codes: { ...s.codes, code: { ...s.codes.code, content: e.target.value } },
                  }))
                }
              />
            </Field>
          </Panel>

          <Panel title="Calisthenics">
            <Field label="Workout type">
              <input
                className={inputClass}
                value={state.calisthenics.workoutType}
                onChange={(e) =>
                  dispatch((s) => ({
                    ...s,
                    calisthenics: { ...s.calisthenics, workoutType: e.target.value },
                  }))
                }
              />
            </Field>
            {state.calisthenics.exercises.map((ex) => (
              <div key={ex.id} className="mb-2 rounded border border-slate-800 p-2 text-sm">
                <span className="font-semibold">{ex.name}</span>
                <span className="ml-2 text-slate-500">
                  {ex.status} · set {ex.completedSets + 1}/{ex.sets} · reps{' '}
                  {ex.repsInCurrentSet}/{ex.repTarget}
                </span>
              </div>
            ))}
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="rounded bg-codes-accent px-3 py-1.5 text-xs font-bold"
                onClick={() => dispatch(completeRep)}
              >
                +1 Rep
              </button>
              <button
                type="button"
                className="rounded bg-slate-700 px-3 py-1.5 text-xs"
                onClick={() => dispatch(completeSet)}
              >
                Complete Set
              </button>
            </div>
            <AddExerciseForm onAdd={(d) => dispatch((s) => addExercise(s, d))} />
          </Panel>

          <Panel title="Stream Events">
            {(['latestSubscriber', 'latestFollower', 'latestDonation'] as const).map((key) => (
              <Field key={key} label={key}>
                <input
                  className={inputClass}
                  value={state.session.streamEvents[key]}
                  onChange={(e) =>
                    dispatch((s) => ({
                      ...s,
                      session: {
                        ...s.session,
                        streamEvents: { ...s.session.streamEvents, [key]: e.target.value },
                      },
                    }))
                  }
                />
              </Field>
            ))}
          </Panel>

          <button
            type="button"
            onClick={resetAll}
            className="rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-400"
          >
            Reset to defaults
          </button>
        </section>

        <section className="space-y-6">
          <Panel title="Atalhos">
            <p className="text-sm text-slate-400">
              Selecione uma cena no catálogo acima ou use os botões de cena ativa. Chat commands
              existentes: <code className="text-codes-accent">!brb</code>,{' '}
              <code className="text-codes-accent">!live</code>,{' '}
              <code className="text-codes-accent">!whiteboard</code>.
            </p>
          </Panel>
        </section>
      </div>
    </div>
  )
}

function roomFilterCards(roomId: string): 'codes' | 'calisthenics' | 'all' {
  return roomCatalogFilter(roomId)
}

function TimerControl({ id }: { id: TimerId }) {
  const timer = useTimerDisplay(id)
  const config = useAppState().timers.timers[id]

  return (
    <div className="mb-4 rounded-lg border border-slate-800 bg-slate-900/50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold capitalize">{id}</span>
        <span className="font-mono text-lg">{timer.formatted}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded bg-codes-accent px-2 py-1 text-xs font-bold"
          onClick={() => dispatch((s) => (timer.running ? pauseTimer(s, id) : startTimer(s, id)))}
        >
          {timer.running ? 'Pause' : 'Start'}
        </button>
        <button
          type="button"
          className="rounded bg-slate-700 px-2 py-1 text-xs"
          onClick={() => dispatch((s) => resetTimer(s, id))}
        >
          Reset
        </button>
        {config.mode === 'countdown' && (
          <>
            {[300, 600, 1500].map((sec) => (
              <button
                key={sec}
                type="button"
                className="rounded bg-slate-800 px-2 py-1 text-xs"
                onClick={() => dispatch((s) => setTimerPreset(s, id, sec))}
              >
                {sec / 60}m
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function AddRow({ placeholder, onAdd }: { placeholder: string; onAdd: (v: string) => void }) {
  return (
    <form
      className="mt-2 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const v = String(fd.get('v') ?? '').trim()
        if (v) onAdd(v)
        e.currentTarget.reset()
      }}
    >
      <input name="v" className={`${inputClass} flex-1`} placeholder={placeholder} />
      <button type="submit" className="rounded bg-codes-accent px-3 text-sm font-bold">
        Add
      </button>
    </form>
  )
}

function AddProblemForm({
  onAdd,
}: {
  onAdd: (d: { id: number; title: string; difficulty: Difficulty }) => void
}) {
  return (
    <form
      className="mt-3 flex flex-wrap gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const id = Number(fd.get('id'))
        const title = String(fd.get('title') ?? '').trim()
        const difficulty = String(fd.get('difficulty') ?? 'medium') as Difficulty
        if (id && title) onAdd({ id, title, difficulty })
        e.currentTarget.reset()
      }}
    >
      <input name="id" type="number" className={`${inputClass} w-24`} placeholder="ID" />
      <input name="title" className={`${inputClass} flex-1`} placeholder="Title" />
      <select name="difficulty" className={inputClass}>
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>
      <button type="submit" className="rounded bg-codes-accent px-3 text-sm font-bold">
        Add
      </button>
    </form>
  )
}

function AddExerciseForm({
  onAdd,
}: {
  onAdd: (d: { name: string; sets: number; repTarget: number }) => void
}) {
  return (
    <form
      className="mt-3 flex flex-wrap gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const name = String(fd.get('name') ?? '').trim()
        const sets = Number(fd.get('sets') ?? 3)
        const repTarget = Number(fd.get('reps') ?? 10)
        if (name) onAdd({ name, sets, repTarget })
        e.currentTarget.reset()
      }}
    >
      <input name="name" className={`${inputClass} flex-1`} placeholder="Exercise" />
      <input name="sets" type="number" className={`${inputClass} w-20`} placeholder="Sets" defaultValue={3} />
      <input name="reps" type="number" className={`${inputClass} w-20`} placeholder="Reps" defaultValue={10} />
      <button type="submit" className="rounded bg-cal-accent px-3 text-sm font-bold text-black">
        Add
      </button>
    </form>
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
        <a href={`${path}?obs=1`} target="_blank" rel="noreferrer" className="text-xs text-emerald-400">
          OBS URL
        </a>
      </div>
    </li>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-400 uppercase">{title}</h3>
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

function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      className={inputClass}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  )
}
