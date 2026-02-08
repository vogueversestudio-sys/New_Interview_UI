import { useProgress, BADGE_DEFS } from '../store'
import { TOPICS, ALL_ITEMS } from '../data'
import {
  Trophy, Flame, Zap, BookOpen, Brain, Code2, Star, Lock,
  TrendingUp, Calendar, Target
} from 'lucide-react'

export default function Achievements() {
  const { xp, level, nextLevel, streak, completedTopics, quizScores, completedProblems, badges } = useProgress()

  const xpProgress = nextLevel
    ? Math.round(((xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100)
    : 100

  const stats = [
    { icon: <Zap size={18} />, value: xp, label: 'Total XP', color: 'text-indigo-400' },
    { icon: <Flame size={18} />, value: streak.count, label: 'Day Streak', color: 'text-orange-400' },
    { icon: <BookOpen size={18} />, value: completedTopics.length, label: 'Topics Done', color: 'text-emerald-400' },
    { icon: <Brain size={18} />, value: Object.keys(quizScores).length, label: 'Quizzes Done', color: 'text-purple-400' },
    { icon: <Code2 size={18} />, value: completedProblems.length, label: 'Problems Solved', color: 'text-cyan-400' },
    { icon: <Star size={18} />, value: badges.length, label: 'Badges Earned', color: 'text-amber-400' },
  ]

  const perfectQuizzes = Object.values(quizScores).filter(q => q.score === q.total).length

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 animate-slide-up">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={18} className="text-amber-400" />
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Your Journey</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Achievements</h1>
        <p className="text-slate-400 text-sm">Track your progress, collect badges, and level up your SDET skills.</p>
      </div>

      {/* Level card */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-slate-900 border border-indigo-500/20 p-6 mb-6 animate-slide-up stagger-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{level.icon}</div>
            <div>
              <h2 className="text-xl font-extrabold text-white">{level.name}</h2>
              <p className="text-xs text-slate-400">{xp} XP earned total</p>
            </div>
          </div>
          {nextLevel && (
            <div className="text-right">
              <p className="text-sm font-bold text-slate-300">{nextLevel.icon} {nextLevel.name}</p>
              <p className="text-xs text-slate-500">{nextLevel.minXp - xp} XP to unlock</p>
            </div>
          )}
        </div>
        <div className="w-full h-4 bg-slate-800/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 relative"
            style={{ width: `${xpProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/10 animate-pulse rounded-full" />
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>{level.minXp} XP</span>
          {nextLevel && <span>{nextLevel.minXp} XP</span>}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="rounded-xl bg-slate-900/60 border border-slate-800/50 p-4 text-center animate-slide-up"
            style={{ animationDelay: `${(i + 1) * 0.05}s`, animationFillMode: 'both' }}
          >
            <div className={`flex justify-center mb-2 ${stat.color}`}>{stat.icon}</div>
            <div className="text-xl font-extrabold text-white animate-count">{stat.value}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Badges section */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/50 p-5 mb-6 animate-slide-up stagger-3">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Star size={18} className="text-amber-400" />
          Badges ({badges.length}/{BADGE_DEFS.length})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {BADGE_DEFS.map((badge) => {
            const isUnlocked = badges.includes(badge.id)
            return (
              <div
                key={badge.id}
                className={`relative p-4 rounded-xl border text-center transition-all duration-200
                  ${isUnlocked
                    ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
                    : 'bg-slate-800/20 border-slate-800/40 opacity-50'}`}
              >
                <div className="text-3xl mb-2">
                  {isUnlocked ? badge.icon : '🔒'}
                </div>
                <h4 className={`text-xs font-bold mb-0.5 ${isUnlocked ? 'text-amber-400' : 'text-slate-500'}`}>
                  {badge.name}
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">{badge.desc}</p>
                {isUnlocked && (
                  <div className="absolute top-2 right-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Milestones timeline */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/50 p-5 animate-slide-up stagger-4">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-400" />
          Milestones
        </h3>

        <div className="space-y-3">
          {[
            { xp: 0, label: 'Started your SDET journey', done: true },
            { xp: 200, label: 'Reached Junior SDET level', done: xp >= 200 },
            { xp: 500, label: 'Reached Mid SDET level', done: xp >= 500 },
            { xp: 1000, label: 'Reached Senior SDET level', done: xp >= 1000 },
            { xp: 2000, label: 'Reached Lead SDET level', done: xp >= 2000 },
            { xp: 3500, label: 'Reached SDET Architect — Ultimate!', done: xp >= 3500 },
          ].map((milestone, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                ${milestone.done
                  ? 'bg-emerald-500/10 border border-emerald-500/30'
                  : 'bg-slate-800/50 border border-slate-700/30'}`}>
                {milestone.done
                  ? <Trophy size={14} className="text-emerald-400" />
                  : <Lock size={14} className="text-slate-600" />}
              </div>
              <div className="flex-1">
                <span className={`text-sm ${milestone.done ? 'text-slate-200 font-semibold' : 'text-slate-500'}`}>
                  {milestone.label}
                </span>
              </div>
              <span className={`text-xs font-bold ${milestone.done ? 'text-emerald-400' : 'text-slate-600'}`}>
                {milestone.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fun motivational banner */}
      <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-center animate-slide-up stagger-5">
        <div className="text-2xl mb-2">
          {xp >= 3500 ? '👑' : xp >= 1000 ? '🔥' : xp >= 500 ? '⚡' : xp >= 200 ? '🚀' : '🌱'}
        </div>
        <p className="text-sm font-bold text-amber-400">
          {xp >= 3500 ? 'You are the SDET Architect! Maximum respect! 👑'
            : xp >= 1000 ? 'Senior level unlocked! You are on fire! 🔥'
            : xp >= 500 ? 'Mid-level reached! Keep the momentum going!'
            : xp >= 200 ? 'Great start! You are building strong foundations!'
            : 'Every expert was once a beginner. Keep going! 💪'}
        </p>
      </div>
    </div>
  )
}
