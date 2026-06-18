import { env } from '@/config/env'
import { ChatMessageList } from '@/components/codes/ChatMessageList'
import { useChatFeed } from '@/hooks/useChatFeed'

type Props = {
  roomId?: string
}

export function ChatModerationPanel({ roomId = 'codes' }: Props) {
  const { messages, loading, error, reload, remove } = useChatFeed(roomId, true)

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">Live Chat</h3>
        <div className="flex gap-2">
          <a
            href="/codes/chat?obs=1"
            target="_blank"
            rel="noreferrer"
            className="rounded bg-emerald-900/50 px-2 py-1 text-[10px] font-semibold text-emerald-400"
          >
            OBS URL
          </a>
          <button
            type="button"
            onClick={() => void reload()}
            className="rounded bg-slate-800 px-2 py-1 text-[10px] font-semibold text-slate-300"
          >
            Recarregar
          </button>
        </div>
      </div>

      <p className="mb-3 text-xs text-slate-500">
        Feed unificado YouTube + Kick. Overlay OBS:{' '}
        <code className="text-codes-accent">/codes/chat?obs=1</code> — alinhe ao buraco &quot;Live
        Chat&quot; nas outras cenas.
      </p>

      {error && <p className="mb-2 text-sm text-red-400">{error}</p>}

      <div className="h-[320px] overflow-hidden rounded-lg border border-slate-800 bg-black/40">
        {loading && messages.length === 0 ? (
          <p className="p-4 text-center text-sm text-slate-500">Carregando…</p>
        ) : (
          <ChatMessageList messages={messages} className="h-full p-2" />
        )}
      </div>

      {env.hasApiToken && messages.length > 0 && (
        <ul className="mt-3 max-h-[120px] space-y-1 overflow-y-auto text-xs text-slate-500">
          {messages.slice(-8).map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-2">
              <span className="truncate">
                {m.username}: {m.content}
              </span>
              <button
                type="button"
                className="shrink-0 text-red-400 hover:underline"
                onClick={() => void remove(m.id)}
              >
                delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
