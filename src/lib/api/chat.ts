import { apiFetch } from '@/lib/api'
import type { StreamRoomId } from '@/lib/room'

export type ChatMessage = {
  id: string
  roomId: string
  userId: string
  platform: string
  username: string
  displayName: string
  content: string
  createdAt: string
  deleted: boolean
}

export async function loadChatMessages(
  roomId: StreamRoomId | string = 'codes',
  limit = 50,
): Promise<ChatMessage[]> {
  const msgs = await apiFetch<ChatMessage[]>(`chat/messages?limit=${limit}`, {}, roomId)
  return msgs.filter((m) => !m.deleted)
}

export async function deleteChatMessage(
  messageId: string,
  roomId: StreamRoomId | string = 'codes',
): Promise<void> {
  await apiFetch(`chat/messages/${messageId}`, { method: 'DELETE' }, roomId)
}

export type ChatWsEvent = {
  type: string
  roomId?: string
  data?: ChatMessage
}
