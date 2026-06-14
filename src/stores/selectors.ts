import type { AppState, Exercise, Problem, ProgressPair } from './types'
import { getTimerSeconds } from './timers'

function startOfDay(iso: string): number {
  const d = new Date(iso)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function startOfWeek(iso: string): number {
  const d = new Date(iso)
  const day = d.getDay()
  const diff = day === 0 ? 6 : day - 1
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function selectCurrentProblem(state: AppState): Problem | undefined {
  return state.codes.problems.find((p) => p.status === 'active')
}

export function selectRecentProblems(state: AppState): Problem[] {
  return [...state.codes.problems]
    .filter((p) => p.status !== 'queued')
    .sort((a, b) => a.order - b.order)
}

export function selectQueuedProblems(state: AppState): Problem[] {
  return state.codes.problems.filter((p) => p.status === 'queued')
}

export function selectSolvedTodayCount(state: AppState, now = Date.now()): number {
  const dayStart = startOfDay(new Date(now).toISOString())
  return state.codes.problems.filter(
    (p) => p.status === 'solved' && p.solvedAt && startOfDay(p.solvedAt) === dayStart,
  ).length
}

export function selectSolvedWeekCount(state: AppState, now = Date.now()): number {
  const weekStart = startOfWeek(new Date(now).toISOString())
  return state.codes.problems.filter(
    (p) => p.status === 'solved' && p.solvedAt && new Date(p.solvedAt).getTime() >= weekStart,
  ).length
}

export function selectProgressToday(state: AppState, now = Date.now()): ProgressPair {
  return {
    current: selectSolvedTodayCount(state, now),
    target: state.codes.goals.dailyTarget,
  }
}

export function selectWeekGoal(state: AppState, now = Date.now()): ProgressPair {
  return {
    current: selectSolvedWeekCount(state, now),
    target: state.codes.goals.weeklyTarget,
  }
}

export function selectSortedPlan(state: AppState) {
  return [...state.codes.plan].sort((a, b) => a.order - b.order)
}

export function selectActiveExercise(state: AppState): Exercise | undefined {
  return state.calisthenics.exercises.find((e) => e.status === 'active')
}

export function selectNextExercise(state: AppState): Exercise | undefined {
  return state.calisthenics.exercises.find((e) => e.status === 'pending')
}

export function selectTotalReps(state: AppState): number {
  return state.calisthenics.exercises.reduce((sum, e) => sum + e.totalReps, 0)
}

export function selectLoadingProgress(state: AppState, now = Date.now()): number {
  const timer = state.timers.timers.startingSoon
  if (timer.mode !== 'countdown' || timer.durationSeconds <= 0) {
    return state.codes.loadingProgress
  }
  const initial = timer.durationSeconds
  const remaining = getTimerSeconds(timer, now)
  const elapsed = initial - remaining
  return Math.min(100, Math.max(0, Math.round((elapsed / initial) * 100)))
}

export function selectTimer(state: AppState, id: keyof AppState['timers']['timers']) {
  return state.timers.timers[id]
}

export function problemToRecentItem(p: Problem) {
  return {
    id: p.id,
    title: p.title,
    done: p.status === 'solved',
    difficulty: p.difficulty,
  }
}

export function selectRecentProblemItems(state: AppState) {
  return selectRecentProblems(state).map(problemToRecentItem)
}
