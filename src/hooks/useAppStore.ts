import { useStore } from '@tanstack/react-store'
import { useMemo, useState, useEffect } from 'react'
import { appStore } from '@/stores/app-store'
import type { AppState, TimerId } from '@/stores/types'
import { getTimerSeconds, toTimerDisplay } from '@/stores/timers'

export function useAppStore<T>(selector: (state: AppState) => T): T {
  return useStore(appStore, selector)
}

export function useAppState(): AppState {
  return useStore(appStore, (state) => state)
}

/** @deprecated use useAppStore */
export function useStreamStore<T>(selector: (state: AppState) => T): T {
  return useAppStore(selector)
}

/** @deprecated use useAppState */
export function useStreamState(): AppState {
  return useAppState()
}

export function useNow(tickMs = 1000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), tickMs)
    return () => clearInterval(id)
  }, [tickMs])

  return now
}

export function useTimerDisplay(id: TimerId) {
  const now = useNow()
  const timer = useAppStore((s) => s.timers.timers[id])
  return useMemo(() => toTimerDisplay(timer, now), [timer, now])
}

export function useTimerSeconds(id: TimerId) {
  const now = useNow()
  const timer = useAppStore((s) => s.timers.timers[id])
  return useMemo(() => getTimerSeconds(timer, now), [timer, now])
}

export function useAnyTimerRunning() {
  return useAppStore((s) => Object.values(s.timers.timers).some((t) => t.running))
}
