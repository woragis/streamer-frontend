import { formatTimerSeconds } from '@/stores/timers'

export function formatCountdown(totalSeconds: number): string {
  return formatTimerSeconds(totalSeconds, 'countdown')
}

export function formatStreamTime(totalSeconds: number): string {
  return formatTimerSeconds(totalSeconds, 'stopwatch')
}

export function formatRestTime(totalSeconds: number): string {
  return formatTimerSeconds(totalSeconds, 'countdown')
}

export { useTimerDisplay, useTimerSeconds, useNow } from '@/hooks/useAppStore'

// Legacy hooks — pages should use useTimerDisplay instead
export function useCountdown() {
  // no-op: engine is global; kept for import compatibility during migration
}

export function useStreamTimer() {
  // no-op: use useTimerDisplay('stream')
}
