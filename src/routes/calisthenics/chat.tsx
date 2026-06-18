import { ObsCanvas } from '@/components/shared/ObsCanvas'
import { ChatMessageList } from '@/components/codes/ChatMessageList'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/constants/canvas'
import { getCalChatRect } from '@/constants/overlay-frames'
import { useChatFeed } from '@/hooks/useChatFeed'
import { useObsMode } from '@/hooks/useObsMode'

export function CalisthenicsChatPage() {
  const obs = useObsMode()
  const { messages, loading } = useChatFeed('calisthenics', true)
  const rect = getCalChatRect()

  return (
    <ObsCanvas theme="calisthenics" obs={obs} transparent>
      <div
        className="relative"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          background: obs ? 'transparent' : '#050505',
        }}
      >
        {!obs && (
          <p className="absolute top-4 left-4 text-xs text-cal-muted">
            Preview — alinhe ao buraco Live Chat da sidebar.
          </p>
        )}
        <div
          className={`absolute overflow-hidden rounded-lg ${
            obs ? '' : 'border border-dashed border-cal-accent/50 bg-black/40'
          }`}
          style={{
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
          }}
        >
          {loading && messages.length === 0 ? (
            <p className="p-4 text-center text-[11px] text-cal-muted">Carregando chat…</p>
          ) : (
            <ChatMessageList messages={messages} className="h-full p-2" />
          )}
        </div>
      </div>
    </ObsCanvas>
  )
}
