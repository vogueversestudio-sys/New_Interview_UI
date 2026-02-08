import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../store'
import { TOPICS, ALL_ITEMS, TOTAL_QUESTIONS, DAILY_GOAL_TEMPLATES, MOTIVATIONAL_QUOTES } from '../data'
import {
  Flame, Zap, BookOpen, Brain, Code2, Trophy, Target, ChevronRight,
  CheckCircle2, Circle, TrendingUp, Calendar, Star, Sparkles, ArrowRight
} from 'lucide-react'

function getQuote() {
  const idx = Math.floor(Date.now() / 86400000) % MOTIVATIONAL_QUOTES.length
  return MOTIVATIONAL_QUOTES[idx]
}

function getDailyGoals(existing) {
  const today = new Date().toISOString().slice(0, 10)
  if (existing.date === today && existing.goals.length > 0) return existing.goals
  const shuffled = [...DAILY_GOAL_TEMPLATES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3).map(g => ({ ...g, done: false }))
}

export default function Dashboard() {
  const progress = useProgress()
  const { xp, level, nextLevel, streak, completedTopics, quizScores, completedProblems, dailyGoals, setDailyGoals, toggleGoal } = progress
  const quote = getQuote()

  useEffect(() => {
    const goals = getDailyGoals(dailyGoals)
    if (dailyGoals.date !== new Date().toISOString().slice(0, 10) || dailyGoals.goals.length === 0) {
      setDailyGoals(goals)
    }
  }, [])

  const topicsPercent = Math.round((completedTopics.length / ALL_ITEMS.length) * 100)
  const quizzesCompleted = Object.keys(quizScores).length
  const problemsSolved = completedProblems.length
  const goalsToday = dailyGoals.goals || []
  const goalsDone = goalsToday.filter(g => g.done).length

  const xpProgress = nextLevel
    ? Math.round(((xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100)
    : 100

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 animate-slide-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Welcome back</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Ready to ace your interview? 🚀
          </h1>
          <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
            {quote.text} — <span className="text-slate-500 italic">{quote.author}</span>
          </p>

          {/* Quick stats row */}
          <div className="flex flex-wrap gap-3 mt-5">
            <StatPill icon={<Flame size={14} />} value={streak.count} label="Day Streak" color="orange" />
            <StatPill icon={<Zap size={14} />} value={xp} label="Total XP" color="indigo" />
            <StatPill icon={<BookOpen size={14} />} value={`${completedTopics.length}/${ALL_ITEMS.length}`} label="Topics" color="emerald" />
            <StatPill icon={<Brain size={14} />} value={quizzesCompleted} label="Quizzes" color="purple" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column — Level + Daily Goals */}
        <div className="lg:col-span-2 space-y-5">
          {/* Level progress card */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/50 p-5 animate-slide-up stagger-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{level.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">{level.name}</h3>
                  <p className="text-[10px] text-slate-500">Level Progress</p>
                </div>
              </div>
              {nextLevel && (
                <div className="text-right">
                  <span className="text-xs text-slate-400">{nextLevel.icon} {nextLevel.name}</span>
                  <p className="text-[10px] text-slate-500">{nextLevel.minXp - xp} XP to go</p>
                </div>
              )}
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 animate-glow"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[11px] text-indigo-400 font-semibold">{xp} XP</span>
              {nextLevel && <span className="text-[11px] text-slate-500">{nextLevel.minXp} XP</span>}
            </div>
          </div>

          {/* Daily Goals */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/50 p-5 animate-slide-up stagger-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-amber-400" />
                <h3 className="text-sm font-bold text-slate-200">Today's Goals</h3>
              </div>
              <span className="text-xs text-slate-500 bg-slate-800/60 px-2 py-1 rounded-lg">
                {goalsDone}/{goalsToday.length} complete
              </span>
            </div>
            <div className="space-y-2.5">
              {goalsToday.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left
                    ${goal.done
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800/30 border-slate-700/40 text-slate-300 hover:border-slate-600'
                    }`}
                >
                  {goal.done
                    ? <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    : <Circle size={18} className="text-slate-600 shrink-0" />
                  }
                  <span className={`text-sm flex-1 ${goal.done ? 'line-through opacity-60' : ''}`}>
                    {goal.text}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-400">+{goal.xp} XP</span>
                </button>
              ))}
            </div>
            {goalsDone === goalsToday.length && goalsToday.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-center">
                <span className="text-sm font-bold text-amber-400">🎉 All goals complete! Amazing work!</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up stagger-3">
            <QuickAction to="/topics" icon={<BookOpen size={20} />} label="Read Topics" color="from-blue-500/10 to-blue-600/5" border="border-blue-500/20" textColor="text-blue-400" />
            <QuickAction to="/quiz" icon={<Brain size={20} />} label="Take Quiz" color="from-purple-500/10 to-purple-600/5" border="border-purple-500/20" textColor="text-purple-400" />
            <QuickAction to="/practice" icon={<Code2 size={20} />} label="Code Practice" color="from-emerald-500/10 to-emerald-600/5" border="border-emerald-500/20" textColor="text-emerald-400" />
            <QuickAction to="/scenarios" icon={<Target size={20} />} label="Scenarios" color="from-amber-500/10 to-amber-600/5" border="border-amber-500/20" textColor="text-amber-400" />
          </div>
        </div>

        {/* Right column — Progress Overview */}
        <div className="space-y-5">
          {/* Topic Progress */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/50 p-5 animate-slide-up stagger-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" />
                Progress
              </h3>
              <span className="text-xs font-bold text-emerald-400">{topicsPercent}%</span>
            </div>

            {/* Circular progress */}
            <div className="flex justify-center mb-4">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="url(#progressGrad)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${topicsPercent * 2.64} 264`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-white">{topicsPercent}%</span>
                  <span className="text-[9px] text-slate-500">COMPLETE</span>
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="space-y-2">
              {TOPICS.filter(c => c.category !== 'Profile').map(cat => {
                const done = cat.items.filter(i => completedTopics.includes(i.id)).length
                const total = cat.items.length
                const pct = total > 0 ? Math.round((done / total) * 100) : 0
                return (
                  <div key={cat.category} className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 w-24 truncate">{cat.category}</span>
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: cat.color }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 w-8 text-right">{done}/{total}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-3 animate-slide-up stagger-3">
            <MiniStat icon="🧩" value={problemsSolved} label="Problems" />
            <MiniStat icon="🏅" value={progress.badges.length} label="Badges" />
            <MiniStat icon="📝" value={TOTAL_QUESTIONS} label="Total Qs" />
            <MiniStat icon="📅" value={streak.count} label="Streak" />
          </div>

          {/* Continue learning */}
          <Link
            to="/roadmap"
            className="block rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-4 hover:border-indigo-500/40 transition-all group animate-slide-up stagger-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-indigo-400 font-semibold mb-0.5">Continue Learning</p>
                <p className="text-sm font-bold text-slate-200">30-Day Roadmap</p>
              </div>
              <ArrowRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatPill({ icon, value, label, color }) {
  const colors = {
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${colors[color]}`}>
      {icon}
      <span className="text-sm font-bold">{value}</span>
      <span className="text-[10px] opacity-60">{label}</span>
    </div>
  )
}

function QuickAction({ to, icon, label, color, border, textColor }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${color} border ${border}
        hover:scale-[1.02] transition-all duration-200 group`}
    >
      <div className={textColor}>{icon}</div>
      <span className={`text-xs font-semibold ${textColor}`}>{label}</span>
    </Link>
  )
}

function MiniStat({ icon, value, label }) {
  return (
    <div className="rounded-xl bg-slate-800/40 border border-slate-700/30 p-3 text-center">
      <div className="text-lg mb-0.5">{icon}</div>
      <div className="text-lg font-extrabold text-white animate-count">{value}</div>
      <div className="text-[10px] text-slate-500">{label}</div>
    </div>
  )
}
