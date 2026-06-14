import type { StreamState } from './types'
import { defaultStreamState } from './types'

export const STORAGE_KEY = 'woragis-stream-state'
export const SYNC_CHANNEL = 'woragis-stream-sync'

export function loadPersistedState(): Partial<StreamState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Partial<StreamState>
  } catch {
    return null
  }
}

export function persistState(state: StreamState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function createInitialState(): StreamState {
  const persisted = loadPersistedState()
  if (!persisted) return { ...defaultStreamState }
  return { ...defaultStreamState, ...persisted }
}

export function broadcastState(state: StreamState) {
  try {
    const channel = new BroadcastChannel(SYNC_CHANNEL)
    channel.postMessage({ type: 'state', state })
    channel.close()
  } catch {
    // BroadcastChannel unavailable
  }
}

export function subscribeToCrossTabSync(onState: (state: StreamState) => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return
    try {
      onState(JSON.parse(event.newValue) as StreamState)
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
        onState(event.data.state as StreamState)
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
