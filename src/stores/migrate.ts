import type { AppState, LegacyStreamState, Problem, PlanItem, Exercise, Scene } from './types'
import { STORAGE_VERSION } from './types'
import {
  createDefaultAppState,
  createDefaultExercises,
  createDefaultPlan,
  createDefaultProblems,
} from './defaults'

function isAppState(value: unknown): value is AppState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'version' in value &&
    (value as AppState).version === STORAGE_VERSION
  )
}

function legacyToProblems(legacy: LegacyStreamState): Problem[] {
  const problems: Problem[] = []
  const current = legacy.currentProblem

  if (current) {
    problems.push({
      id: current.id,
      title: current.title,
      difficulty: current.difficulty,
      description: current.description,
      status: 'active',
      solvedAt: null,
      order: 0,
    })
  }

  legacy.recentProblems?.forEach((p, i) => {
    if (current && p.id === current.id) return
    problems.push({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty ?? 'medium',
      description: '',
      status: p.done ? 'solved' : 'queued',
      solvedAt: p.done ? new Date().toISOString() : null,
      order: i + 1,
    })
  })

  return problems.length > 0 ? problems : createDefaultProblems()
}

function legacyToPlan(legacy: LegacyStreamState): PlanItem[] {
  if (!legacy.todayPlan?.length) return createDefaultPlan()
  return legacy.todayPlan.map((item, order) => ({ ...item, order }))
}

function legacyToExercises(legacy: LegacyStreamState): Exercise[] {
  const exercises = createDefaultExercises()
  if (legacy.currentExercise) {
    exercises[0] = {
      ...exercises[0],
      name: legacy.currentExercise,
      sets: legacy.currentSet?.total ?? exercises[0].sets,
      completedSets: (legacy.currentSet?.current ?? 1) - 1,
      repsInCurrentSet: legacy.currentReps?.current ?? 0,
      repTarget: legacy.currentReps?.target ?? exercises[0].repTarget,
      totalReps: legacy.totalReps ?? exercises[0].totalReps,
      status: 'active',
    }
  }
  if (legacy.upNextExercise && exercises[1]) {
    exercises[1] = {
      ...exercises[1],
      name: legacy.upNextExercise,
      sets: legacy.upNextSets ?? exercises[1].sets,
    }
  }
  return exercises
}

export function migrateLegacyState(legacy: LegacyStreamState): AppState {
  const defaults = createDefaultAppState()
  const now = Date.now()

  const streamRunning = legacy.streamTimeRunning ?? false
  const startingRunning = legacy.startingSoonRunning ?? false
  const brbRunning = legacy.brbRunning ?? false
  const restRunning = legacy.restTimerRunning ?? false

  const startingSeconds = legacy.startingSoonCountdown ?? 300
  const brbSeconds = legacy.brbCountdown ?? 300
  const restSeconds = legacy.restTimerSeconds ?? 90

  return {
    version: STORAGE_VERSION,
    branding: {
      handle: legacy.handle ?? defaults.branding.handle,
      brandTitle: legacy.brandTitle ?? defaults.branding.brandTitle,
      motto: legacy.motto ?? defaults.branding.motto,
      calisthenicsMotto: legacy.calisthenicsMotto ?? defaults.branding.calisthenicsMotto,
      schedule: legacy.schedule ?? defaults.branding.schedule,
      social: {
        discord: legacy.discord ?? defaults.branding.social.discord,
        twitter: legacy.twitter ?? defaults.branding.social.twitter,
        youtube: legacy.youtube ?? defaults.branding.social.youtube,
        kick: legacy.kick ?? defaults.branding.social.kick,
      },
    },
    session: {
      scene: (legacy.streamStatus as Scene) ?? defaults.session.scene,
      startedAt: null,
      streamEvents: {
        latestSubscriber: legacy.latestSubscriber ?? defaults.session.streamEvents.latestSubscriber,
        latestFollower: legacy.latestFollower ?? defaults.session.streamEvents.latestFollower,
        latestDonation: legacy.latestDonation ?? defaults.session.streamEvents.latestDonation,
      },
    },
    timers: {
      timers: {
        stream: {
          ...defaults.timers.timers.stream,
          accumulatedSeconds: legacy.streamTimeSeconds ?? defaults.timers.timers.stream.accumulatedSeconds,
          running: streamRunning,
          startedAt: streamRunning ? now : null,
          endsAt: null,
        },
        startingSoon: {
          ...defaults.timers.timers.startingSoon,
          durationSeconds: startingSeconds,
          running: startingRunning,
          startedAt: startingRunning ? now : null,
          endsAt: startingRunning ? now + startingSeconds * 1000 : null,
        },
        brb: {
          ...defaults.timers.timers.brb,
          durationSeconds: brbSeconds,
          running: brbRunning,
          startedAt: brbRunning ? now : null,
          endsAt: brbRunning ? now + brbSeconds * 1000 : null,
        },
        rest: {
          ...defaults.timers.timers.rest,
          durationSeconds: restSeconds,
          running: restRunning,
          startedAt: restRunning ? now : null,
          endsAt: restRunning ? now + restSeconds * 1000 : null,
        },
        focus: { ...defaults.timers.timers.focus },
      },
    },
    codes: {
      plan: legacyToPlan(legacy),
      problems: legacyToProblems(legacy),
      code: {
        fileName: legacy.codeFileName ?? defaults.codes.code.fileName,
        content: legacy.codeContent ?? defaults.codes.code.content,
      },
      whiteboard: {
        title: legacy.whiteboardTitle ?? defaults.codes.whiteboard.title,
        bullets: legacy.whiteboardBullets ?? defaults.codes.whiteboard.bullets,
        notes: legacy.whiteboardNotes ?? defaults.codes.whiteboard.notes,
        approach: legacy.currentApproach ?? defaults.codes.whiteboard.approach,
      },
      goals: {
        dailyTarget: legacy.progressToday?.target ?? defaults.codes.goals.dailyTarget,
        weeklyTarget: legacy.weekGoal?.target ?? defaults.codes.goals.weeklyTarget,
        streak: legacy.streak ?? defaults.codes.goals.streak,
      },
      copy: {
        startingSoonSubtext: legacy.startingSoonSubtext ?? defaults.codes.copy.startingSoonSubtext,
        brbSubtext: legacy.brbSubtext ?? defaults.codes.copy.brbSubtext,
        brbMessage: legacy.brbMessage ?? defaults.codes.copy.brbMessage,
        upNextLabel: legacy.upNextLabel ?? defaults.codes.copy.upNextLabel,
      },
      loadingProgress: legacy.loadingProgress ?? defaults.codes.loadingProgress,
    },
    calisthenics: {
      workoutType: legacy.workoutType ?? defaults.calisthenics.workoutType,
      exercises: legacyToExercises(legacy),
      todayGoal: {
        label: legacy.todayGoalLabel ?? defaults.calisthenics.todayGoal.label,
        progress: legacy.todayGoalProgress ?? defaults.calisthenics.todayGoal.progress,
      },
    },
  }
}

export function hydrateAppState(raw: unknown): AppState {
  if (isAppState(raw)) return raw
  if (typeof raw === 'object' && raw !== null) {
    return migrateLegacyState(raw as LegacyStreamState)
  }
  return createDefaultAppState()
}

export function mergeWithDefaults(partial: Partial<AppState>): AppState {
  const defaults = createDefaultAppState()
  return {
    ...defaults,
    ...partial,
    version: STORAGE_VERSION,
    branding: { ...defaults.branding, ...partial.branding, social: { ...defaults.branding.social, ...partial.branding?.social } },
    session: { ...defaults.session, ...partial.session, streamEvents: { ...defaults.session.streamEvents, ...partial.session?.streamEvents } },
    timers: partial.timers?.timers
      ? { timers: { ...defaults.timers.timers, ...partial.timers.timers } }
      : defaults.timers,
    codes: partial.codes
      ? {
          ...defaults.codes,
          ...partial.codes,
          code: { ...defaults.codes.code, ...partial.codes.code },
          whiteboard: { ...defaults.codes.whiteboard, ...partial.codes.whiteboard },
          goals: { ...defaults.codes.goals, ...partial.codes.goals },
          copy: { ...defaults.codes.copy, ...partial.codes.copy },
          plan: partial.codes.plan ?? defaults.codes.plan,
          problems: partial.codes.problems ?? defaults.codes.problems,
        }
      : defaults.codes,
    calisthenics: partial.calisthenics
      ? {
          ...defaults.calisthenics,
          ...partial.calisthenics,
          todayGoal: { ...defaults.calisthenics.todayGoal, ...partial.calisthenics.todayGoal },
          exercises: partial.calisthenics.exercises ?? defaults.calisthenics.exercises,
        }
      : defaults.calisthenics,
  }
}
