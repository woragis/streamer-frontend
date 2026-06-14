import { useEffect } from 'react'
import { useStreamStore } from '@/hooks/useStreamStore'
import { patchStreamState, streamStore } from '@/stores/stream-store'

type CountdownField = 'startingSoonCountdown' | 'brbCountdown' | 'restTimerSeconds'
type RunningField = 'startingSoonRunning' | 'brbRunning' | 'restTimerRunning'

export function useCountdown(field: CountdownField, runningField: RunningField) {
  const running = useStreamStore((s) => s[runningField])
  const seconds = useStreamStore((s) => s[field])

  useEffect(() => {
    if (!running || seconds <= 0) return

    const id = setInterval(() => {
      const current = streamStore.state[field]
      patchStreamState({ [field]: Math.max(0, current - 1) } as Partial<
        typeof streamStore.state
      >)
    }, 1000)

    return () => clearInterval(id)
  }, [running, seconds, field, runningField])

  return seconds
}

export function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatStreamTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatRestTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function useStreamTimer() {
  const running = useStreamStore((s) => s.streamTimeRunning)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      streamStore.setState((state) => ({
        ...state,
        streamTimeSeconds: state.streamTimeSeconds + 1,
      }))
    }, 1000)
    return () => clearInterval(id)
  }, [running])
}
