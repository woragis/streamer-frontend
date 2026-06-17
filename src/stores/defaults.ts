import type {
  AppState,
  CalisthenicsState,
  CodesState,
  Exercise,
  PlanItem,
  Problem,
  TimerConfig,
  TimerId,
} from './types'
import { STORAGE_VERSION } from './types'

const DEFAULT_CODE = `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxPathSum(self, root):
        self.max_sum = float('-inf')

        def dfs(node):
            if not node:
                return 0
            left = max(dfs(node.left), 0)
            right = max(dfs(node.right), 0)
            self.max_sum = max(
                self.max_sum,
                node.val + left + right
            )
            return node.val + max(left, right)

        dfs(root)
        return self.max_sum`

function makeTimer(
  id: TimerId,
  mode: TimerConfig['mode'],
  label: string,
  durationSeconds: number,
  accumulatedSeconds = 0,
): TimerConfig {
  return {
    id,
    mode,
    label,
    durationSeconds,
    accumulatedSeconds,
    running: false,
    startedAt: null,
    endsAt: null,
  }
}

export function createDefaultProblems(): Problem[] {
  return [
    {
      id: 124,
      title: 'Binary Tree Maximum Path Sum',
      difficulty: 'hard',
      description:
        'A path in the binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.',
      status: 'active',
      solvedAt: null,
      order: 0,
    },
    {
      id: 146,
      title: 'LRU Cache',
      difficulty: 'medium',
      description: '',
      status: 'solved',
      solvedAt: new Date().toISOString(),
      order: 1,
    },
    {
      id: 199,
      title: 'Binary Tree Right Side View',
      difficulty: 'medium',
      description: '',
      status: 'solved',
      solvedAt: new Date().toISOString(),
      order: 2,
    },
    {
      id: 239,
      title: 'Sliding Window Maximum',
      difficulty: 'hard',
      description: '',
      status: 'queued',
      solvedAt: null,
      order: 3,
    },
  ]
}

export function createDefaultPlan(): PlanItem[] {
  return [
    { id: 'plan-1', label: '2 Hard Problems', done: true, order: 0 },
    { id: 'plan-2', label: 'Dynamic Programming', done: true, order: 1 },
    { id: 'plan-3', label: 'Graphs', done: false, order: 2 },
  ]
}

export function createDefaultExercises(): Exercise[] {
  return [
    {
      id: 'ex-1',
      name: 'PULL-UPS',
      sets: 5,
      repTarget: 10,
      completedSets: 2,
      repsInCurrentSet: 8,
      totalReps: 28,
      status: 'active',
      order: 0,
    },
    {
      id: 'ex-2',
      name: 'CHIN-UPS',
      sets: 4,
      repTarget: 10,
      completedSets: 0,
      repsInCurrentSet: 0,
      totalReps: 0,
      status: 'pending',
      order: 1,
    },
  ]
}

export function createDefaultCodesState(): CodesState {
  return {
    plan: createDefaultPlan(),
    problems: createDefaultProblems(),
    code: {
      fileName: 'solution.py',
      content: DEFAULT_CODE,
    },
    whiteboard: {
      title: 'Binary Tree Maximum Path Sum',
      bullets: [
        'For each node, compute max gain from left & right subtrees',
        'Path through node = left_gain + right_gain + node.val',
        'Update global max at each node (post-order DFS)',
        'Ignore negative gains (use max(0, gain))',
      ],
      notes: ['Post-order DFS', 'Track global max', 'Skip negative paths'],
      approach: 'Using DFS (Post-order)',
    },
    goals: {
      dailyTarget: 5,
      weeklyTarget: 30,
      streak: 12,
    },
    copy: {
      startingSoonSubtext:
        'SOLVING PROBLEMS • IMPROVING EVERY DAY • BECOMING 1% BETTER',
      brbSubtext: 'GRABBING WATER • STRETCHING • PREPARING THE NEXT PROBLEM',
      brbMessage: "I'LL BE BACK IN",
      upNextLabel: 'Dynamic Programming Problem',
    },
    loadingProgress: 87,
  }
}

export function createDefaultCalisthenicsState(): CalisthenicsState {
  return {
    workoutType: 'PULL DAY',
    exercises: createDefaultExercises(),
    todayGoal: {
      label: 'COMPLETE THE WORKOUT',
      progress: 75,
    },
  }
}

export function createDefaultAppState(): AppState {
  return {
    version: STORAGE_VERSION,
    branding: {
      codesHandle: '@WoragisCodes',
      calisthenicsHandle: '@WoragisCalisthenics',
      handle: '@WoragisCodes',
      brandTitle: 'LEETCODE LIVE',
      motto: 'FOCUS • DISCIPLINE • CONSISTENCY',
      calisthenicsMotto: 'DISCIPLINE TODAY FREEDOM TOMORROW',
      schedule: 'Mon – Fri · 10:00 AM EST',
      social: {
        discord: 'discord.gg/yourserver',
        twitter: '@yourtwitter',
        youtube: 'youtube.com/@yourchannel',
        kick: 'kick.com/yourchannel',
      },
    },
    session: {
      scene: 'live',
      startedAt: null,
      streamEvents: {
        latestSubscriber: 'code_with_me',
        latestFollower: 'algorithm_lover',
        latestDonation: 'Anonymous - $10',
      },
    },
    timers: {
      timers: {
        stream: makeTimer('stream', 'stopwatch', 'Stream Time', 0, 5077),
        startingSoon: makeTimer('startingSoon', 'countdown', 'Starting Soon', 300, 0),
        brb: makeTimer('brb', 'countdown', 'BRB', 300, 0),
        rest: makeTimer('rest', 'countdown', 'Rest', 90, 0),
        focus: makeTimer('focus', 'countdown', 'Focus', 1500, 0),
      },
    },
    codes: createDefaultCodesState(),
    calisthenics: createDefaultCalisthenicsState(),
  }
}
