import { useEffect, useRef, type ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { env } from '@/config/env'
import { resolveRoomId, type StreamRoomId } from '@/lib/room'
import {
  applyStreamEvent,
  loadRoomState,
  pushRoomState,
  refreshRoomState,
  type WsServerEvent,
} from '@/lib/api/state'
import { subscribeWsUrl } from '@/lib/api'
import { appStore } from '@/stores/app-store'

let pushTimeout: ReturnType<typeof setTimeout> | null = null
const applyingRemote = { current: false }

function schedulePush(roomId: StreamRoomId) {
  if (pushTimeout) clearTimeout(pushTimeout)
  pushTimeout = setTimeout(() => {
    void pushRoomState(roomId, appStore.state).catch((err) => {
      console.warn('api sync push failed:', err)
    })
  }, 600)
}

async function pullRemote(roomId: StreamRoomId) {
  try {
    const remote = await loadRoomState(roomId)
    applyingRemote.current = true
    appStore.setState(() => remote)
    applyingRemote.current = false
  } catch (err) {
    console.warn('api sync load failed:', err)
  }
}

function handleWsMessage(roomId: StreamRoomId, raw: string) {
  let ev: WsServerEvent
  try {
    ev = JSON.parse(raw) as WsServerEvent
  } catch {
    return
  }
  if (ev.roomId && ev.roomId !== roomId) return

  if (ev.type === 'event.created' && ev.data?.type) {
    applyingRemote.current = true
    appStore.setState((state) =>
      applyStreamEvent(state, ev.data!.type!, ev.data!.username ?? '', ev.data!.payload),
    )
    applyingRemote.current = false
    return
  }

  if (ev.type === 'session.updated' || ev.type === 'state.updated') {
    void refreshRoomState(roomId).then((remote) => {
      applyingRemote.current = true
      appStore.setState(() => remote)
      applyingRemote.current = false
    })
  }
}

export function useApiSync(mode: 'control' | 'overlay') {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const searchRoom = useRouterState({ select: (s) => (s.location.search as { room?: string }).room })
  const roomId = resolveRoomId(pathname, searchRoom ?? null)

  const modeRef = useRef(mode)
  modeRef.current = mode

  useEffect(() => {
    if (!env.apiSyncEnabled) return
    void pullRemote(roomId)
  }, [roomId])

  useEffect(() => {
    if (!env.apiSyncEnabled || mode !== 'overlay') return

    let closed = false
    let ws: WebSocket | null = null
    let retry: ReturnType<typeof setTimeout> | null = null

    const connect = () => {
      if (closed) return
      ws = new WebSocket(subscribeWsUrl('all', roomId))
      ws.onmessage = (event) => handleWsMessage(roomId, String(event.data))
      ws.onclose = () => {
        if (!closed) retry = setTimeout(connect, 3000)
      }
      ws.onerror = () => ws?.close()
    }

    connect()
    return () => {
      closed = true
      if (retry) clearTimeout(retry)
      ws?.close()
    }
  }, [roomId, mode])

  useEffect(() => {
    if (!env.apiSyncEnabled || mode !== 'control') return

    const unsub = appStore.subscribe(() => {
      if (applyingRemote.current) return
      schedulePush(roomId)
    })
    return () => {
      unsub.unsubscribe()
    }
  }, [roomId, mode])

  return { roomId, apiSyncEnabled: env.apiSyncEnabled }
}

export function ApiSyncProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const mode = pathname.startsWith('/control') ? 'control' : 'overlay'
  useApiSync(mode)
  return children
}
