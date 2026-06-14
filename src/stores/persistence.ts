import type { AppState } from './types'
import { createDefaultAppState } from './defaults'
import { hydrateAppState, mergeWithDefaults } from './migrate'

export const STORAGE_KEY = 'woragis-stream-state'
export const SYNC_CHANNEL = 'woragis-stream-sync'

export function loadPersistedState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return hydrateAppState(JSON.parse(raw))
  } catch {
    return null
  }
}

export function persistState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function createInitialState(): AppState {
  const persisted = loadPersistedState()
  if (!persisted) return createDefaultAppState()
  return mergeWithDefaults(persisted)
}

export function broadcastState(state: AppState) {
  try {
    const channel = new BroadcastChannel(SYNC_CHANNEL)
    channel.postMessage({ type: 'state', state })
    channel.close()
  } catch {
    // BroadcastChannel unavailable
  }
}

export function subscribeToCrossTabSync(onState: (state: AppState) => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return
    try {
      onState(hydrateAppState(JSON.parse(event.newValue)))
    } catch {
      // ignore malformed payloads
    }
  }

  window.addEventListener('storage', onStorage)

  let channel: BroadcastChannel | null = null
  try {
    channel = new BroadcastChannel(SYNC_CHANNEL)
    channel.onmessage = (event) => {
      if (event.data?.type === 'state' && event.data.state) {
        onState(hydrateAppState(event.data.state))
      }
    }
  } catch {
    // BroadcastChannel unavailable
  }

  return () => {
    window.removeEventListener('storage', onStorage)
    channel?.close()
  }
}
