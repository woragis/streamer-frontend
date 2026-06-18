import type { AppState, CalContentLayout, Difficulty, Exercise, PlanItem, Problem, Scene, TimerId } from './types'
import { createDefaultAppState } from './defaults'
import {
  pauseTimerConfig,
  resetTimerConfig,
  setTimerDuration,
  startTimerConfig,
} from './timers'
import {
  selectActiveExercise,
  selectCurrentProblem,
  selectNextExercise,
  selectTotalReps,
} from './selectors'

function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}

function updateTimer(state: AppState, id: TimerId, updater: (t: AppState['timers']['timers'][TimerId]) => AppState['timers']['timers'][TimerId]) {
  return {
    ...state,
    timers: {
      timers: {
        ...state.timers.timers,
        [id]: updater(state.timers.timers[id]),
      },
    },
  }
}

export function patchAppState(state: AppState, partial: Partial<AppState>): AppState {
  return {
    ...state,
    ...partial,
    branding: partial.branding ? { ...state.branding, ...partial.branding, social: { ...state.branding.social, ...partial.branding.social } } : state.branding,
    session: partial.session ? { ...state.session, ...partial.session, streamEvents: { ...state.session.streamEvents, ...partial.session.streamEvents } } : state.session,
    timers: partial.timers ?? state.timers,
    codes: partial.codes ? { ...state.codes, ...partial.codes } : state.codes,
    calisthenics: partial.calisthenics ? { ...state.calisthenics, ...partial.calisthenics } : state.calisthenics,
  }
}

export function resetAppState(): AppState {
  return createDefaultAppState()
}

/* ─── Session / Scene ─── */

export function setScene(state: AppState, scene: Scene): AppState {
  return { ...state, session: { ...state.session, scene } }
}

export function goLive(state: AppState): AppState {
  let next = setScene(state, 'live')
  next = updateTimer(next, 'stream', (t) => startTimerConfig(t))
  if (!next.session.startedAt) {
    next = { ...next, session: { ...next.session, startedAt: new Date().toISOString() } }
  }
  return next
}

/* ─── Timers ─── */

export function startTimer(state: AppState, id: TimerId): AppState {
  return updateTimer(state, id, (t) => startTimerConfig(t))
}

export function pauseTimer(state: AppState, id: TimerId): AppState {
  return updateTimer(state, id, (t) => pauseTimerConfig(t))
}

export function resetTimer(state: AppState, id: TimerId, durationSeconds?: number): AppState {
  return updateTimer(state, id, (t) => resetTimerConfig(t, durationSeconds))
}

export function setTimerPreset(state: AppState, id: TimerId, durationSeconds: number): AppState {
  return updateTimer(state, id, (t) => setTimerDuration(t, durationSeconds))
}

export function tickTimers(state: AppState, now = Date.now()): AppState {
  let changed = false
  const timers = { ...state.timers.timers }

  for (const id of Object.keys(timers) as TimerId[]) {
    const timer = timers[id]
    if (!timer.running) continue
    if (timer.mode === 'countdown' && timer.endsAt && now >= timer.endsAt) {
      timers[id] = pauseTimerConfig({ ...timer, endsAt: timer.endsAt }, now)
      changed = true
    }
  }

  return changed ? { ...state, timers: { timers } } : state
}

/* ─── Plan list ─── */

export function addPlanItem(state: AppState, label: string): AppState {
  const order = state.codes.plan.length
  const item: PlanItem = { id: uid('plan'), label, done: false, order }
  return {
    ...state,
    codes: { ...state.codes, plan: [...state.codes.plan, item] },
  }
}

export function togglePlanItem(state: AppState, id: string): AppState {
  return {
    ...state,
    codes: {
      ...state.codes,
      plan: state.codes.plan.map((p) => (p.id === id ? { ...p, done: !p.done } : p)),
    },
  }
}

export function removePlanItem(state: AppState, id: string): AppState {
  return {
    ...state,
    codes: {
      ...state.codes,
      plan: state.codes.plan.filter((p) => p.id !== id).map((p, order) => ({ ...p, order })),
    },
  }
}

export function updatePlanItemLabel(state: AppState, id: string, label: string): AppState {
  return {
    ...state,
    codes: {
      ...state.codes,
      plan: state.codes.plan.map((p) => (p.id === id ? { ...p, label } : p)),
    },
  }
}

/* ─── Problems ─── */

export function addProblem(
  state: AppState,
  data: { id: number; title: string; difficulty: Difficulty; description?: string },
): AppState {
  const order = state.codes.problems.length
  const problem: Problem = {
    id: data.id,
    title: data.title,
    difficulty: data.difficulty,
    description: data.description ?? '',
    status: 'queued',
    solvedAt: null,
    order,
  }
  return {
    ...state,
    codes: { ...state.codes, problems: [...state.codes.problems, problem] },
  }
}

export function setActiveProblem(state: AppState, id: number): AppState {
  const problems = state.codes.problems.map((p) => {
    if (p.id === id) return { ...p, status: 'active' as const }
    if (p.status === 'active') return { ...p, status: 'queued' as const }
    return p
  })
  const active = problems.find((p) => p.id === id)
  return {
    ...state,
    codes: {
      ...state.codes,
      problems,
      code: active ? { ...state.codes.code } : state.codes.code,
      whiteboard: active
        ? { ...state.codes.whiteboard, title: active.title }
        : state.codes.whiteboard,
    },
  }
}

export function markProblemSolved(state: AppState, id: number): AppState {
  const problems = state.codes.problems.map((p) =>
    p.id === id ? { ...p, status: 'solved' as const, solvedAt: new Date().toISOString() } : p,
  )
  return { ...state, codes: { ...state.codes, problems } }
}

export function markProblemSkipped(state: AppState, id: number): AppState {
  const problems = state.codes.problems.map((p) =>
    p.id === id ? { ...p, status: 'skipped' as const } : p,
  )
  return { ...state, codes: { ...state.codes, problems } }
}

export function removeProblem(state: AppState, id: number): AppState {
  return {
    ...state,
    codes: {
      ...state.codes,
      problems: state.codes.problems
        .filter((p) => p.id !== id)
        .map((p, order) => ({ ...p, order })),
    },
  }
}

export function updateProblem(
  state: AppState,
  id: number,
  patch: Partial<Pick<Problem, 'title' | 'difficulty' | 'description'>>,
): AppState {
  return {
    ...state,
    codes: {
      ...state.codes,
      problems: state.codes.problems.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    },
  }
}

/* ─── Exercises ─── */

export function addExercise(
  state: AppState,
  data: { name: string; sets: number; repTarget: number },
): AppState {
  const order = state.calisthenics.exercises.length
  const exercise: Exercise = {
    id: uid('ex'),
    name: data.name,
    sets: data.sets,
    repTarget: data.repTarget,
    completedSets: 0,
    repsInCurrentSet: 0,
    totalReps: 0,
    status: state.calisthenics.exercises.some((e) => e.status === 'active') ? 'pending' : 'active',
    order,
  }
  return {
    ...state,
    calisthenics: {
      ...state.calisthenics,
      exercises: [...state.calisthenics.exercises, exercise],
    },
  }
}

export function completeRep(state: AppState): AppState {
  const active = selectActiveExercise(state)
  if (!active) return state

  const exercises = state.calisthenics.exercises.map((e) => {
    if (e.id !== active.id) return e
    const repsInCurrentSet = e.repsInCurrentSet + 1
    const totalReps = e.totalReps + 1
    return { ...e, repsInCurrentSet, totalReps }
  })

  let next: AppState = {
    ...state,
    calisthenics: { ...state.calisthenics, exercises },
  }

  const updated = selectActiveExercise(next)!
  if (updated.repsInCurrentSet >= updated.repTarget) {
    next = completeSet(next)
  }

  return next
}

export function completeSet(state: AppState): AppState {
  const active = selectActiveExercise(state)
  if (!active) return state

  const completedSets = active.completedSets + 1
  const isLastSet = completedSets >= active.sets

  let exercises = state.calisthenics.exercises.map((e) => {
    if (e.id !== active.id) return e
    if (isLastSet) {
      return {
        ...e,
        completedSets,
        repsInCurrentSet: 0,
        status: 'done' as const,
      }
    }
    return { ...e, completedSets, repsInCurrentSet: 0 }
  })

  let next: AppState = {
    ...state,
    calisthenics: { ...state.calisthenics, exercises },
  }

  if (isLastSet) {
    const pending = selectNextExercise(next)
    if (pending) {
      exercises = next.calisthenics.exercises.map((e) =>
        e.id === pending.id ? { ...e, status: 'active' as const } : e,
      )
      next = { ...next, calisthenics: { ...next.calisthenics, exercises } }
    }
  } else {
    next = startTimer(next, 'rest')
  }

  return next
}

export function removeExercise(state: AppState, id: string): AppState {
  return {
    ...state,
    calisthenics: {
      ...state.calisthenics,
      exercises: state.calisthenics.exercises
        .filter((e) => e.id !== id)
        .map((e, order) => ({ ...e, order })),
    },
  }
}

export function setCalContentLayout(state: AppState, contentLayout: CalContentLayout): AppState {
  return {
    ...state,
    calisthenics: { ...state.calisthenics, contentLayout },
  }
}

export function syncCalisthenicsGoalProgress(state: AppState): AppState {
  const total = state.calisthenics.exercises.length
  const done = state.calisthenics.exercises.filter((e) => e.status === 'done').length
  const progress = total > 0 ? Math.round((done / total) * 100) : 0
  return {
    ...state,
    calisthenics: {
      ...state.calisthenics,
      todayGoal: { ...state.calisthenics.todayGoal, progress },
    },
  }
}

export function getActiveProblemOrFirst(state: AppState): Problem | undefined {
  return selectCurrentProblem(state) ?? state.codes.problems[0]
}

export { selectTotalReps, selectActiveExercise, selectNextExercise, selectCurrentProblem }
