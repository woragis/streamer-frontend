import { env } from '@/config/env'
import type { StreamRoomId } from '@/lib/room'
import { normalizeBranding } from '@/lib/branding'
import { mergeWithDefaults } from '@/stores/migrate'
import type {
  AppState,
  BrandingState,
  CalisthenicsState,
  CodesState,
  Exercise,
  Scene,
  SessionState,
  TimerConfig,
  TimerId,
  TimerMode,
} from '@/stores/types'
import { TIMER_IDS } from '@/stores/timers'

type DocResponse<T> = T & { revision?: number }

type LeetCodeApiState = {
  revision?: number
  plan: CodesState['plan']
  problems: CodesState['problems']
  code: CodesState['code']
  whiteboard: CodesState['whiteboard']
  goals: CodesState['goals']
  copy: CodesState['copy']
  loadingProgress: number
  timers?: Record<string, unknown>
}

type CalisthenicsApiState = {
  revision?: number
  workoutId?: string
  workoutType: string
  exercises: Exercise[]
  todayGoal: CalisthenicsState['todayGoal']
  timers?: Record<string, unknown>
}

type RoomMeta = {
  session?: number
  branding?: number
  leetcode?: number
  calisthenics?: number
  streamTimer?: number
  calWorkoutId?: string
}

const metaByRoom: Record<string, RoomMeta> = {}

function roomBase(roomId: string) {
  return `${env.apiUrl}/api/v1/rooms/${roomId}`
}

async function apiGet<T>(roomId: string, segment: string): Promise<T | null> {
  const headers = new Headers()
  if (env.apiToken) headers.set('Authorization', `Bearer ${env.apiToken}`)
  const res = await fetch(`${roomBase(roomId)}/${segment.replace(/^\//, '')}`, { headers })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GET ${segment}: ${res.status}`)
  return (await res.json()) as T
}

async function apiPut<T>(roomId: string, segment: string, body: unknown): Promise<T> {
  const headers = new Headers({ 'Content-Type': 'application/json' })
  if (env.apiToken) headers.set('Authorization', `Bearer ${env.apiToken}`)
  const res = await fetch(`${roomBase(roomId)}/${segment.replace(/^\//, '')}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PUT ${segment}: ${res.status}`)
  return (await res.json()) as T
}

function timerFromApi(raw: Record<string, unknown>, fallback: TimerConfig): TimerConfig {
  return {
    id: (String(raw.id ?? fallback.id) as TimerId),
    mode: (String(raw.mode ?? fallback.mode) as TimerMode),
    label: String(raw.label ?? fallback.label),
    durationSeconds: Number(raw.durationSeconds ?? fallback.durationSeconds),
    accumulatedSeconds: Number(raw.accumulatedSeconds ?? fallback.accumulatedSeconds),
    running: Boolean(raw.running),
    startedAt: raw.startedAt != null ? Number(raw.startedAt) : null,
    endsAt: raw.endsAt != null ? Number(raw.endsAt) : null,
  }
}

function timerToApi(timer: TimerConfig): Record<string, unknown> {
  return {
    id: timer.id,
    mode: timer.mode,
    label: timer.label,
    durationSeconds: timer.durationSeconds,
    accumulatedSeconds: timer.accumulatedSeconds,
    running: timer.running,
    startedAt: timer.startedAt,
    endsAt: timer.endsAt,
  }
}

function applyApiTimers(
  timers: AppState['timers'],
  streamRaw: Record<string, unknown> | null,
  lcRaw: Record<string, unknown> | undefined,
  calRaw: Record<string, unknown> | undefined,
): AppState['timers'] {
  const next = { ...timers.timers }
  if (streamRaw) next.stream = timerFromApi(streamRaw, next.stream)
  if (lcRaw) {
    for (const id of ['startingSoon', 'brb', 'focus'] as TimerId[]) {
      const raw = lcRaw[id]
      if (raw && typeof raw === 'object') {
        next[id] = timerFromApi(raw as Record<string, unknown>, next[id])
      }
    }
  }
  if (calRaw) {
    for (const id of ['rest'] as TimerId[]) {
      const raw = calRaw[id]
      if (raw && typeof raw === 'object') {
        next[id] = timerFromApi(raw as Record<string, unknown>, next[id])
      }
    }
  }
  return { timers: next }
}

function codesFromLeetCode(api: LeetCodeApiState): CodesState {
  return {
    plan: api.plan ?? [],
    problems: api.problems ?? [],
    code: api.code ?? { fileName: 'solution.py', content: '' },
    whiteboard: api.whiteboard ?? { title: '', bullets: [], notes: [], approach: '' },
    goals: api.goals ?? { dailyTarget: 5, weeklyTarget: 30, streak: 0 },
    copy: api.copy ?? {
      startingSoonSubtext: '',
      brbSubtext: '',
      brbMessage: '',
      upNextLabel: '',
    },
    loadingProgress: api.loadingProgress ?? 0,
  }
}

export async function loadRoomState(roomId: StreamRoomId): Promise<AppState> {
  const base = mergeWithDefaults({})
  const [brandingDoc, sessionDoc, streamDoc, lcDoc, calDoc] = await Promise.all([
    apiGet<DocResponse<BrandingState>>(roomId, 'branding'),
    apiGet<DocResponse<SessionState>>(roomId, 'session'),
    apiGet<DocResponse<Record<string, unknown>>>(roomId, 'timers/stream'),
    apiGet<LeetCodeApiState>(roomId, 'leetcode/state'),
    apiGet<CalisthenicsApiState>(roomId, 'calisthenics/state').catch(() => null),
  ])

  const meta = metaByRoom[roomId] ?? {}
  if (brandingDoc?.revision != null) meta.branding = brandingDoc.revision
  if (sessionDoc?.revision != null) meta.session = sessionDoc.revision
  if (streamDoc?.revision != null) meta.streamTimer = streamDoc.revision
  if (lcDoc?.revision != null) meta.leetcode = lcDoc.revision
  if (calDoc?.revision != null) meta.calisthenics = calDoc.revision
  if (calDoc?.workoutId) meta.calWorkoutId = calDoc.workoutId
  metaByRoom[roomId] = meta

  const branding = brandingDoc ? normalizeBranding(brandingDoc) : base.branding
  const session = sessionDoc
    ? {
        scene: (sessionDoc.scene as Scene) ?? base.session.scene,
        startedAt: sessionDoc.startedAt ?? null,
        streamEvents: { ...base.session.streamEvents, ...sessionDoc.streamEvents },
      }
    : base.session

  let partial: Partial<AppState> = { branding, session }
  if (lcDoc) {
    partial.codes = codesFromLeetCode(lcDoc)
  }
  if (calDoc) {
    partial.calisthenics = {
      workoutType: calDoc.workoutType ?? base.calisthenics.workoutType,
      exercises: calDoc.exercises ?? base.calisthenics.exercises,
      todayGoal: calDoc.todayGoal ?? base.calisthenics.todayGoal,
    }
  }

  const merged = mergeWithDefaults(partial)
  merged.timers = applyApiTimers(
    merged.timers,
    streamDoc ?? null,
    lcDoc?.timers as Record<string, unknown> | undefined,
    calDoc?.timers as Record<string, unknown> | undefined,
  )
  return merged
}

function leetCodeTimers(state: AppState): Record<string, unknown> {
  return {
    startingSoon: timerToApi(state.timers.timers.startingSoon),
    brb: timerToApi(state.timers.timers.brb),
    focus: timerToApi(state.timers.timers.focus),
  }
}

function calisthenicsTimers(state: AppState): Record<string, unknown> {
  return {
    rest: timerToApi(state.timers.timers.rest),
  }
}

export async function pushRoomState(roomId: StreamRoomId, state: AppState): Promise<void> {
  const meta = metaByRoom[roomId] ?? {}

  const brandingBody = { ...state.branding, revision: meta.branding }
  const brandingRes = await apiPut<DocResponse<BrandingState>>(roomId, 'branding', brandingBody)
  if (brandingRes.revision != null) meta.branding = brandingRes.revision

  const sessionBody = { ...state.session, revision: meta.session }
  const sessionRes = await apiPut<DocResponse<SessionState>>(roomId, 'session', sessionBody)
  if (sessionRes.revision != null) meta.session = sessionRes.revision

  const streamBody = { ...timerToApi(state.timers.timers.stream), revision: meta.streamTimer }
  const streamRes = await apiPut<DocResponse<Record<string, unknown>>>(roomId, 'timers/stream', streamBody)
  if (streamRes.revision != null) meta.streamTimer = streamRes.revision

  const lcBody = {
    revision: meta.leetcode,
    plan: state.codes.plan,
    problems: state.codes.problems,
    code: state.codes.code,
    whiteboard: state.codes.whiteboard,
    goals: state.codes.goals,
    copy: state.codes.copy,
    loadingProgress: state.codes.loadingProgress,
    timers: leetCodeTimers(state),
  }
  const lcRes = await apiPut<LeetCodeApiState>(roomId, 'leetcode/state', lcBody)
  if (lcRes.revision != null) meta.leetcode = lcRes.revision

  const calBody = {
    revision: meta.calisthenics,
    workoutId: meta.calWorkoutId,
    workoutType: state.calisthenics.workoutType,
    workoutStatus: 'active',
    exercises: state.calisthenics.exercises,
    todayGoal: state.calisthenics.todayGoal,
    timers: calisthenicsTimers(state),
  }
  try {
    const calRes = await apiPut<CalisthenicsApiState>(roomId, 'calisthenics/state', calBody)
    if (calRes.revision != null) meta.calisthenics = calRes.revision
    if (calRes.workoutId) meta.calWorkoutId = calRes.workoutId
  } catch {
    // calisthenics room may not have active workout yet
  }

  metaByRoom[roomId] = meta
}

export async function refreshRoomState(roomId: StreamRoomId): Promise<AppState> {
  return loadRoomState(roomId)
}

export type WsServerEvent = {
  type: string
  domain?: string
  roomId?: string
  data?: { domain?: string; revision?: number; scene?: string; type?: string; username?: string; payload?: unknown }
}

export function applyStreamEvent(state: AppState, eventType: string, username: string, payload: unknown): AppState {
  const streamEvents = { ...state.session.streamEvents }
  if (eventType === 'subscriber') streamEvents.latestSubscriber = username
  if (eventType === 'follower') streamEvents.latestFollower = username
  if (eventType === 'donation') {
    const p = payload as { amount?: string; message?: string }
    streamEvents.latestDonation = p.message ? `${username} - ${p.message}` : username
  }
  return { ...state, session: { ...state.session, streamEvents } }
}

export { TIMER_IDS }
