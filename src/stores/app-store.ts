import { Store } from '@tanstack/store'
import type { AppState } from './types'
import { resetAppState, tickTimers } from './actions'
import {
  broadcastState,
  createInitialState,
  persistState,
  subscribeToCrossTabSync,
} from './persistence'

export const appStore = new Store<AppState>(createInitialState())

/** @deprecated alias — use appStore */
export const streamStore = appStore

let persistTimeout: ReturnType<typeof setTimeout> | null = null
let lastPersistedJson = ''

function schedulePersist(state: AppState) {
  if (persistTimeout) clearTimeout(persistTimeout)
  persistTimeout = setTimeout(() => {
    const json = JSON.stringify(state)
    if (json === lastPersistedJson) return
    lastPersistedJson = json
    persistState(state)
    broadcastState(state)
  }, 250)
}

appStore.subscribe(() => {
  schedulePersist(appStore.state)
})

subscribeToCrossTabSync((state) => {
  appStore.setState(() => state)
  lastPersistedJson = JSON.stringify(state)
})

export function setAppState(updater: (state: AppState) => AppState) {
  appStore.setState(updater)
}

export function dispatch(updater: (state: AppState) => AppState) {
  appStore.setState(updater)
}

export function resetStoreToDefaults() {
  appStore.setState(() => resetAppState())
}

let timerEngineStarted = false

/** Pauses countdown timers at zero; UI display uses useNow + getTimerSeconds */
export function startTimerEngine() {
  if (timerEngineStarted) return () => undefined
  timerEngineStarted = true

  const id = setInterval(() => {
    appStore.setState((state) => tickTimers(state))
  }, 1000)

  return () => {
    clearInterval(id)
    timerEngineStarted = false
  }
}
