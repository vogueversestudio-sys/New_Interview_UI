import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ProgressContext = createContext()

const STORAGE_KEY = 'sdet_app_state'

const DEFAULT_STATE = {
  xp: 0,
  level: 1,
  streak: { count: 0, lastDate: null },
  completedTopics: [],
  quizScores: {},
  completedProblems: [],
  badges: [],
  dailyGoals: { date: null, goals: [] },
  readingProgress: {},
  name: 'Vikrant',
  theme: 'dark',
  readingMode: false,
}

const LEVELS = [
  { name: 'Intern', minXp: 0, icon: '🌱' },
  { name: 'Junior SDET', minXp: 200, icon: '🧪' },
  { name: 'Mid SDET', minXp: 500, icon: '⚡' },
  { name: 'Senior SDET', minXp: 1000, icon: '🔥' },
  { name: 'Lead SDET', minXp: 2000, icon: '💎' },
  { name: 'SDET Architect', minXp: 3500, icon: '👑' },
]

export const BADGE_DEFS = [
  { id: 'first_step', name: 'First Step', desc: 'Complete your first chapter', icon: '🚀', condition: s => s.completedTopics.length >= 1 },
  { id: 'quiz_master', name: 'Quiz Master', desc: 'Score 100% on any quiz', icon: '🧠', condition: s => Object.values(s.quizScores).some(q => q.score === q.total) },
  { id: 'streak_3', name: 'On Fire', desc: '3-day streak', icon: '🔥', condition: s => s.streak.count >= 3 },
  { id: 'streak_7', name: 'Streak Warrior', desc: '7-day streak', icon: '⚔️', condition: s => s.streak.count >= 7 },
  { id: 'python_pro', name: 'Python Pro', desc: 'Complete all Python chapters', icon: '🐍', condition: s => ['01','02','03','04','05'].every(id => s.completedTopics.includes(id)) },
  { id: 'sql_expert', name: 'SQL Expert', desc: 'Complete all SQL chapters', icon: '🗃️', condition: s => ['08','16'].every(id => s.completedTopics.includes(id)) },
  { id: 'java_hero', name: 'Java Hero', desc: 'Complete all Java chapters', icon: '☕', condition: s => ['11','13'].every(id => s.completedTopics.includes(id)) },
  { id: 'full_stack', name: 'Full Stack SDET', desc: 'Complete all chapters', icon: '🏆', condition: s => s.completedTopics.length >= 17 },
  { id: 'problem_solver', name: 'Problem Solver', desc: 'Solve 10 practice problems', icon: '💡', condition: s => s.completedProblems.length >= 10 },
  { id: 'xp_500', name: 'Rising Star', desc: 'Earn 500 XP', icon: '⭐', condition: s => s.xp >= 500 },
  { id: 'xp_1000', name: 'Unstoppable', desc: 'Earn 1000 XP', icon: '💫', condition: s => s.xp >= 1000 },
  { id: 'quiz_5', name: 'Quiz Addict', desc: 'Complete 5 quizzes', icon: '📝', condition: s => Object.keys(s.quizScores).length >= 5 },
]

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : { ...DEFAULT_STATE }
  } catch { return { ...DEFAULT_STATE } }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

function getLevel(xp) {
  let lvl = LEVELS[0]
  for (const l of LEVELS) {
    if (xp >= l.minXp) lvl = l
  }
  return lvl
}

function getNextLevel(xp) {
  for (const l of LEVELS) {
    if (xp < l.minXp) return l
  }
  return null
}

export function ProgressProvider({ children }) {
  const [state, setState] = useState(loadState)

  useEffect(() => { saveState(state) }, [state])

  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10)
    setState(prev => {
      if (prev.streak.lastDate === today) return prev
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      const newCount = prev.streak.lastDate === yesterday ? prev.streak.count + 1 : 1
      return { ...prev, streak: { count: newCount, lastDate: today } }
    })
  }, [])

  const addXp = useCallback((amount) => {
    setState(prev => ({ ...prev, xp: prev.xp + amount }))
    updateStreak()
  }, [updateStreak])

  const completeTopic = useCallback((topicId) => {
    setState(prev => {
      if (prev.completedTopics.includes(topicId)) return prev
      return { ...prev, completedTopics: [...prev.completedTopics, topicId], xp: prev.xp + 50 }
    })
    updateStreak()
  }, [updateStreak])

  const saveQuizScore = useCallback((quizId, score, total) => {
    setState(prev => {
      const bonus = score === total ? 50 : 0
      return {
        ...prev,
        quizScores: { ...prev.quizScores, [quizId]: { score, total, date: new Date().toISOString() } },
        xp: prev.xp + (score * 20) + bonus,
      }
    })
    updateStreak()
  }, [updateStreak])

  const completeProblem = useCallback((problemId) => {
    setState(prev => {
      if (prev.completedProblems.includes(problemId)) return prev
      return { ...prev, completedProblems: [...prev.completedProblems, problemId], xp: prev.xp + 30 }
    })
    updateStreak()
  }, [updateStreak])

  const checkBadges = useCallback(() => {
    setState(prev => {
      const newBadges = BADGE_DEFS
        .filter(b => b.condition(prev) && !prev.badges.includes(b.id))
        .map(b => b.id)
      if (!newBadges.length) return prev
      return { ...prev, badges: [...prev.badges, ...newBadges] }
    })
  }, [])

  useEffect(() => { checkBadges() }, [state.xp, state.completedTopics, state.quizScores, state.streak, state.completedProblems, checkBadges])

  const setDailyGoals = useCallback((goals) => {
    const today = new Date().toISOString().slice(0, 10)
    setState(prev => ({ ...prev, dailyGoals: { date: today, goals } }))
  }, [])

  const setTheme = useCallback((theme) => {
    setState(prev => ({ ...prev, theme }))
  }, [])

  const toggleReadingMode = useCallback(() => {
    setState(prev => ({ ...prev, readingMode: !prev.readingMode }))
  }, [])

  const toggleGoal = useCallback((goalId) => {
    setState(prev => {
      const goals = prev.dailyGoals.goals.map(g =>
        g.id === goalId ? { ...g, done: !g.done } : g
      )
      const justCompleted = goals.find(g => g.id === goalId)?.done
      return {
        ...prev,
        dailyGoals: { ...prev.dailyGoals, goals },
        xp: justCompleted ? prev.xp + 30 : prev.xp - 30,
      }
    })
  }, [])

  const value = {
    ...state,
    level: getLevel(state.xp),
    nextLevel: getNextLevel(state.xp),
    addXp,
    completeTopic,
    saveQuizScore,
    completeProblem,
    setDailyGoals,
    toggleGoal,
    updateStreak,
    setTheme,
    toggleReadingMode,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
