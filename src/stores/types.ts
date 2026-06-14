export type Difficulty = 'easy' | 'medium' | 'hard'

export type StreamStatus = 'offline' | 'starting-soon' | 'live' | 'brb'

export interface PlanItem {
  id: string
  label: string
  done: boolean
}

export interface ProblemItem {
  id: number
  title: string
  done: boolean
  difficulty?: Difficulty
}

export interface StreamState {
  handle: string
  brandTitle: string

  streamStatus: StreamStatus
  streamTimeSeconds: number
  streamTimeRunning: boolean

  startingSoonCountdown: number
  startingSoonRunning: boolean
  brbCountdown: number
  brbRunning: boolean
  loadingProgress: number

  currentProblem: {
    id: number
    title: string
    difficulty: Difficulty
    description: string
  }

  todayPlan: PlanItem[]
  recentProblems: ProblemItem[]

  progressToday: { current: number; target: number }
  weekGoal: { current: number; target: number }
  streak: number

  schedule: string
  discord: string
  twitter: string
  youtube: string
  kick: string

  whiteboardTitle: string
  whiteboardBullets: string[]
  whiteboardNotes: string[]
  currentApproach: string

  codeContent: string
  codeFileName: string

  workoutType: string
  currentExercise: string
  currentSet: { current: number; total: number }
  currentReps: { current: number; target: number }
  restTimerSeconds: number
  restTimerRunning: boolean
  totalReps: number
  todayGoalProgress: number
  todayGoalLabel: string
  upNextExercise: string
  upNextSets: number
  motto: string
  calisthenicsMotto: string

  latestSubscriber: string
  latestFollower: string
  latestDonation: string

  brbMessage: string
  startingSoonSubtext: string
  brbSubtext: string
  upNextLabel: string
}

export const defaultStreamState: StreamState = {
  handle: '@yourhandle',
  brandTitle: 'LEETCODE LIVE',

  streamStatus: 'live',
  streamTimeSeconds: 5077,
  streamTimeRunning: false,

  startingSoonCountdown: 298,
  startingSoonRunning: false,
  brbCountdown: 167,
  brbRunning: false,
  loadingProgress: 87,

  currentProblem: {
    id: 124,
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'hard',
    description:
      'A path in the binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.',
  },

  todayPlan: [
    { id: '1', label: '2 Hard Problems', done: true },
    { id: '2', label: 'Dynamic Programming', done: true },
    { id: '3', label: 'Graphs', done: false },
  ],

  recentProblems: [
    { id: 146, title: 'LRU Cache', done: true, difficulty: 'medium' },
    { id: 199, title: 'Binary Tree Right Side View', done: true, difficulty: 'medium' },
    { id: 239, title: 'Sliding Window Maximum', done: false, difficulty: 'hard' },
  ],

  progressToday: { current: 3, target: 5 },
  weekGoal: { current: 18, target: 30 },
  streak: 12,

  schedule: 'Mon – Fri · 10:00 AM EST',
  discord: 'discord.gg/yourserver',
  twitter: '@yourtwitter',
  youtube: 'youtube.com/@yourchannel',
  kick: 'kick.com/yourchannel',

  whiteboardTitle: 'Binary Tree Maximum Path Sum',
  whiteboardBullets: [
    'For each node, compute max gain from left & right subtrees',
    'Path through node = left_gain + right_gain + node.val',
    'Update global max at each node (post-order DFS)',
    'Ignore negative gains (use max(0, gain))',
  ],
  whiteboardNotes: ['Post-order DFS', 'Track global max', 'Skip negative paths'],
  currentApproach: 'Using DFS (Post-order)',

  codeContent: `class TreeNode:
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
        return self.max_sum`,
  codeFileName: 'solution.py',

  workoutType: 'PULL DAY',
  currentExercise: 'PULL-UPS',
  currentSet: { current: 3, total: 5 },
  currentReps: { current: 8, target: 10 },
  restTimerSeconds: 75,
  restTimerRunning: false,
  totalReps: 28,
  todayGoalProgress: 75,
  todayGoalLabel: 'COMPLETE THE WORKOUT',
  upNextExercise: 'CHIN-UPS',
  upNextSets: 4,
  motto: 'FOCUS • DISCIPLINE • CONSISTENCY',
  calisthenicsMotto: 'DISCIPLINE TODAY FREEDOM TOMORROW',

  latestSubscriber: 'code_with_me',
  latestFollower: 'algorithm_lover',
  latestDonation: 'Anonymous - $10',

  brbMessage: "I'LL BE BACK IN",
  startingSoonSubtext: 'SOLVING PROBLEMS • IMPROVING EVERY DAY • BECOMING 1% BETTER',
  brbSubtext: 'GRABBING WATER • STRETCHING • PREPARING THE NEXT PROBLEM',
  upNextLabel: 'Dynamic Programming Problem',
}
