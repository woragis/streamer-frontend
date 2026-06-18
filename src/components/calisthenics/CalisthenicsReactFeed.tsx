import type { ReactNode } from 'react'
import { useSession } from '@/hooks/useOverlayData'
import { useChatFeed } from '@/hooks/useChatFeed'
import { ChatMessageList } from '@/components/codes/ChatMessageList'
import { IconHeart, IconUser, IconDollar } from '@/components/codes/Icons'

export function CalisthenicsReactFeed() {
  const { messages } = useChatFeed('calisthenics', true)
  const { streamEvents } = useSession()

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-cal-border bg-[#0a0a0acc]">
      <div className="border-b border-cal-border px-4 py-2">
        <p className="text-[10px] font-bold tracking-[0.2em] text-cal-accent uppercase">
          Live Feed
        </p>
      </div>

      <div className="grid shrink-0 grid-cols-3 gap-2 border-b border-cal-border p-3">
        <MiniAlert icon={<IconHeart className="h-3.5 w-3.5 text-pink-400" />} label="Follow" value={streamEvents.latestFollower} />
        <MiniAlert icon={<IconUser className="h-3.5 w-3.5 text-cal-accent" />} label="Sub" value={streamEvents.latestSubscriber} />
        <MiniAlert icon={<IconDollar className="h-3.5 w-3.5 text-emerald-400" />} label="Donation" value={streamEvents.latestDonation} />
      </div>

      <div className="min-h-0 flex-1 p-2">
        <ChatMessageList messages={messages} compact className="h-full" />
      </div>
    </div>
  )
}

function MiniAlert({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-cal-border/60 bg-black/40 px-2 py-1.5">
      <div className="mb-0.5 flex items-center gap-1 text-[8px] font-bold tracking-wider text-cal-muted uppercase">
        {icon}
        {label}
      </div>
      <p className="truncate text-[10px] font-semibold text-white">{value || '—'}</p>
    </div>
  )
}
