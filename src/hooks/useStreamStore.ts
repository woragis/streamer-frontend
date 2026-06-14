import { useStore } from '@tanstack/react-store'
import { streamStore } from '@/stores/stream-store'
import type { StreamState } from '@/stores/types'

export function useStreamStore<T>(selector: (state: StreamState) => T): T {
  return useStore(streamStore, selector)
}

export function useStreamState(): StreamState {
  return useStore(streamStore, (state) => state)
}
