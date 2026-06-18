import { useCallback, useEffect, useRef, useState } from 'react'
import { env } from '@/config/env'
import { subscribeWsUrl } from '@/lib/api'
import {
  deleteChatMessage,
  loadChatMessages,
  type ChatMessage,
  type ChatWsEvent,
} from '@/lib/api/chat'
import type { StreamRoomId } from '@/lib/room'

const MAX_VISIBLE = 40

export function useChatFeed(roomId: StreamRoomId | string = 'codes', enabled = true) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const idsRef = useRef(new Set<string>())

  const append = useCallback((msg: ChatMessage) => {
    if (msg.deleted || idsRef.current.has(msg.id)) return
    idsRef.current.add(msg.id)
    setMessages((prev) => [...prev, msg].slice(-MAX_VISIBLE))
  }, [])

  const reload = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    setError(null)
    try {
      const msgs = await loadChatMessages(roomId)
      idsRef.current = new Set(msgs.map((m) => m.id))
      setMessages(msgs.slice(-MAX_VISIBLE))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat')
    } finally {
      setLoading(false)
    }
  }, [roomId, enabled])

  useEffect(() => {
    void reload()
  }, [reload])

  useEffect(() => {
    if (!enabled) return

    let ws: WebSocket | null = null
    let closed = false

    const connect = () => {
      if (closed) return
      ws = new WebSocket(subscribeWsUrl('all', roomId))
      ws.onmessage = (ev) => {
        try {
          const parsed = JSON.parse(String(ev.data)) as ChatWsEvent
          if (parsed.type === 'message.created' && parsed.data && !parsed.data.deleted) {
            if (!parsed.roomId || parsed.roomId === roomId) {
              append(parsed.data)
            }
          }
        } catch {
          // ignore malformed frames
        }
      }
      ws.onclose = () => {
        if (!closed) window.setTimeout(connect, 2500)
      }
    }

    connect()

    return () => {
      closed = true
      ws?.close()
    }
  }, [roomId, enabled, append])

  const remove = useCallback(
    async (messageId: string) => {
      if (!env.hasApiToken) return
      await deleteChatMessage(messageId, roomId)
      setMessages((prev) => prev.filter((m) => m.id !== messageId))
      idsRef.current.delete(messageId)
    },
    [roomId],
  )

  return { messages, loading, error, reload, remove }
}
