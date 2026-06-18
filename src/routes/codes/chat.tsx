import { ObsCanvas } from '@/components/shared/ObsCanvas'
import { ChatMessageList } from '@/components/codes/ChatMessageList'
import {
  CODES_CHAT_H,
  CODES_CONTENT_PAD,
  CODES_FOOTER_H,
  CODES_HEADER_H,
  CODES_SIDEBAR_RIGHT_W,
  CODES_WEBCAM_H,
  CODES_WIDGET_GAP,
} from '@/constants/codes-layout'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/constants/canvas'
import { useChatFeed } from '@/hooks/useChatFeed'
import { useObsMode } from '@/hooks/useObsMode'

/** Standalone OBS source — transparent canvas, chat panel aligned to sidebar slot. */
export function CodesChatPage() {
  const obs = useObsMode()
  const { messages, loading } = useChatFeed('codes', true)

  const panelTop =
    CODES_HEADER_H +
    CODES_CONTENT_PAD +
    (944 - CODES_WEBCAM_H - CODES_CHAT_H - CODES_WIDGET_GAP * 2)

  return (
    <ObsCanvas obs={obs} transparent>
      <div
        className="relative"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          background: obs ? 'transparent' : '#06080c',
        }}
      >
        {!obs && (
          <p className="absolute top-4 left-4 text-xs text-codes-muted">
            Preview — no OBS alinhe este painel ao buraco &quot;Live Chat&quot; das outras cenas.
          </p>
        )}
        <div
          className={`absolute overflow-hidden rounded-lg ${
            obs ? '' : 'border border-dashed border-codes-accent/50 bg-black/40'
          }`}
          style={{
            right: CODES_CONTENT_PAD,
            top: panelTop,
            width: CODES_SIDEBAR_RIGHT_W,
            height: CODES_CHAT_H,
          }}
        >
          {loading && messages.length === 0 ? (
            <p className="p-4 text-center text-[11px] text-codes-muted">Carregando chat…</p>
          ) : (
            <ChatMessageList messages={messages} className="h-full p-2" />
          )}
        </div>
        {!obs && (
          <div
            className="pointer-events-none absolute border border-dashed border-slate-600/40"
            style={{
              right: CODES_CONTENT_PAD,
              bottom: CODES_FOOTER_H + CODES_CONTENT_PAD,
              width: CODES_SIDEBAR_RIGHT_W,
              height: CODES_WEBCAM_H + CODES_WIDGET_GAP + CODES_CHAT_H,
            }}
          />
        )}
      </div>
    </ObsCanvas>
  )
}
