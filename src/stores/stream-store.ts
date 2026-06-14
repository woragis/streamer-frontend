import { Store } from '@tanstack/store'
import type { StreamState } from './types'
import {
  broadcastState,
  createInitialState,
  persistState,
  subscribeToCrossTabSync,
} from './persistence'

export const streamStore = new Store<StreamState>(createInitialState())

let persistTimeout: ReturnType<typeof setTimeout> | null = null

function schedulePersist(state: StreamState) {
  if (persistTimeout) clearTimeout(persistTimeout)
  persistTimeout = setTimeout(() => {
    persistState(state)
    broadcastState(state)
  }, 100)
}

streamStore.subscribe(() => {
  schedulePersist(streamStore.state)
})

subscribeToCrossTabSync((state) => {
  streamStore.setState(() => state)
})

export function updateStreamState(updater: (state: StreamState) => StreamState) {
  streamStore.setState(updater)
}

export function patchStreamState(partial: Partial<StreamState>) {
  streamStore.setState((state) => ({ ...state, ...partial }))
}

export function resetStreamState() {
  streamStore.setState(() => createInitialState())
}
