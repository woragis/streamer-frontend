import { useEffect, useRef } from 'react'
import type { ChatMessage } from '@/lib/api/chat'

function platformStyle(platform: string) {
  const p = platform.toLowerCase()
  if (p.includes('kick')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  if (p.includes('youtube') || p.includes('yt')) return 'bg-red-500/20 text-red-300 border-red-500/40'
  return 'bg-slate-500/20 text-slate-300 border-slate-500/40'
}

function avatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const hues = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']
  return hues[Math.abs(hash) % hues.length]
}

function ChatLine({ message }: { message: ChatMessage }) {
  const name = message.displayName || message.username
  const initial = (name[0] ?? '?').toUpperCase()
  const isCommand = message.content.trimStart().startsWith('!')

  return (
    <li
      className={`flex gap-2 rounded-lg px-2 py-1.5 ${
        isCommand ? 'opacity-70' : 'bg-black/25'
      }`}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
        style={{ backgroundColor: avatarColor(name) }}
      >
        {initial}
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
          <span className="truncate text-[12px] font-semibold text-white">{name}</span>
          <span
            className={`rounded border px-1 py-0 text-[8px] font-bold tracking-wider uppercase ${platformStyle(message.platform)}`}
          >
            {message.platform}
          </span>
        </div>
        <p className="text-[12px] leading-snug break-words text-codes-text">{message.content}</p>
      </div>
    </li>
  )
}

type Props = {
  messages: ChatMessage[]
  compact?: boolean
  className?: string
}

export function ChatMessageList({ messages, compact = false, className = '' }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className={`flex flex-col overflow-hidden ${compact ? '' : 'h-full'} ${className}`}>
      {!compact && (
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[10px] font-bold tracking-[0.14em] text-codes-accent uppercase">
            Live Chat
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-live" />
        </div>
      )}
      <ul
        className={`overlay-scroll min-h-0 flex-1 space-y-1 overflow-y-auto ${
          compact ? 'mask-fade-top' : ''
        }`}
      >
        {messages.length === 0 ? (
          <li className="px-2 py-4 text-center text-[11px] text-codes-muted">Aguardando mensagens…</li>
        ) : (
          messages.map((m) => <ChatLine key={m.id} message={m} />)
        )}
        <div ref={bottomRef} />
      </ul>
    </div>
  )
}
