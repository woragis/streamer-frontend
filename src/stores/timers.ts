import type { TimerConfig, TimerDisplay, TimerId } from './types'

export function getTimerSeconds(timer: TimerConfig, now = Date.now()): number {
  if (timer.mode === 'stopwatch') {
    if (timer.running && timer.startedAt) {
      return timer.accumulatedSeconds + Math.floor((now - timer.startedAt) / 1000)
    }
    return timer.accumulatedSeconds
  }

  if (timer.running && timer.endsAt) {
    return Math.max(0, Math.ceil((timer.endsAt - now) / 1000))
  }

  return timer.durationSeconds
}

export function formatTimerSeconds(totalSeconds: number, mode: TimerConfig['mode']): string {
  const s = Math.max(0, totalSeconds)
  if (mode === 'countdown' && s < 3600) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export function toTimerDisplay(timer: TimerConfig, now = Date.now()): TimerDisplay {
  const seconds = getTimerSeconds(timer, now)
  return {
    id: timer.id,
    label: timer.label,
    mode: timer.mode,
    running: timer.running,
    seconds,
    formatted: formatTimerSeconds(seconds, timer.mode),
  }
}

export function startTimerConfig(timer: TimerConfig, now = Date.now()): TimerConfig {
  if (timer.mode === 'stopwatch') {
    return {
      ...timer,
      running: true,
      startedAt: now,
      endsAt: null,
    }
  }

  const remaining =
    timer.endsAt && timer.endsAt > now
      ? Math.ceil((timer.endsAt - now) / 1000)
      : timer.durationSeconds

  return {
    ...timer,
    durationSeconds: remaining,
    running: true,
    startedAt: now,
    endsAt: now + remaining * 1000,
  }
}

export function pauseTimerConfig(timer: TimerConfig, now = Date.now()): TimerConfig {
  if (!timer.running) return timer

  if (timer.mode === 'stopwatch' && timer.startedAt) {
    return {
      ...timer,
      running: false,
      accumulatedSeconds: timer.accumulatedSeconds + Math.floor((now - timer.startedAt) / 1000),
      startedAt: null,
      endsAt: null,
    }
  }

  const remaining = timer.endsAt
    ? Math.max(0, Math.ceil((timer.endsAt - now) / 1000))
    : timer.durationSeconds

  return {
    ...timer,
    running: false,
    durationSeconds: remaining,
    startedAt: null,
    endsAt: null,
  }
}

export function resetTimerConfig(timer: TimerConfig, durationOverride?: number): TimerConfig {
  const duration = durationOverride ?? timer.durationSeconds
  return {
    ...timer,
    durationSeconds: duration,
    running: false,
    startedAt: null,
    endsAt: null,
    accumulatedSeconds: timer.mode === 'stopwatch' ? 0 : timer.accumulatedSeconds,
  }
}

export function setTimerDuration(timer: TimerConfig, durationSeconds: number): TimerConfig {
  return resetTimerConfig({ ...timer, durationSeconds }, durationSeconds)
}

export function isTimerFinished(timer: TimerConfig, now = Date.now()): boolean {
  return timer.mode === 'countdown' && timer.running && getTimerSeconds(timer, now) <= 0
}

export const TIMER_IDS: TimerId[] = ['stream', 'startingSoon', 'brb', 'rest', 'focus']

export const SCENE_TIMER_MAP: Partial<Record<string, TimerId>> = {
  'starting-soon': 'startingSoon',
  brb: 'brb',
  workout: 'rest',
  whiteboard: 'focus',
  'problem-analysis': 'focus',
}
