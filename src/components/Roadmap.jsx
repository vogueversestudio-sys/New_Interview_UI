import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../store'
import { ROADMAP } from '../data'
import {
  CheckCircle2, Circle, Lock, ChevronDown, ChevronRight,
  Calendar, BookOpen, Target, Flame, ArrowRight
} from 'lucide-react'

export default function Roadmap() {
  const { completedTopics, streak } = useProgress()
  const [expandedDay, setExpandedDay] = useState(null)

  const currentDay = Math.min(
    ROADMAP.flatMap(p => p.items).findIndex(item => {
      if (!item.topicId) return !completedTopics.includes('all_review')
      return !completedTopics.includes(item.topicId)
    }) + 1,
    30
  ) || 1

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={18} className="text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Learning Path</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">30-Day Interview Roadmap</h1>
        <p className="text-slate-400 text-sm">
          A structured plan to go from zero to interview-ready. Follow one day at a time.
        </p>

        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
              style={{ width: `${(Math.max(currentDay - 1, 0) / 30) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-indigo-400">Day {currentDay}/30</span>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-8">
        {ROADMAP.map((phase, phaseIdx) => {
          const phaseStart = ROADMAP.slice(0, phaseIdx).reduce((sum, p) => sum + p.items.length, 0) + 1
          const phaseEnd = phaseStart + phase.items.length - 1

          return (
            <div key={phase.phase} className="animate-slide-up" style={{ animationDelay: `${phaseIdx * 0.1}s`, animationFillMode: 'both' }}>
              {/* Phase header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${phase.color}, ${phase.color}88)` }}
                >
                  {phaseIdx + 1}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{phase.phase}</h2>
                  <p className="text-xs text-slate-500">Days {phase.days} — {phase.description}</p>
                </div>
              </div>

              {/* Days */}
              <div className="ml-5 border-l-2 border-slate-800/60 pl-6 space-y-2">
                {phase.items.map((item, dayIdx) => {
                  const dayNum = phaseStart + dayIdx
                  const isCompleted = dayNum < currentDay
                  const isCurrent = dayNum === currentDay
                  const isLocked = dayNum > currentDay + 1
                  const isExpanded = expandedDay === dayNum

                  return (
                    <div key={dayNum} className="relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-[31px] top-3 w-4 h-4 rounded-full border-2
                        ${isCompleted ? 'bg-emerald-500 border-emerald-500' :
                          isCurrent ? 'bg-indigo-500 border-indigo-500 animate-glow' :
                          'bg-slate-800 border-slate-700'}`}
                      >
                        {isCompleted && <CheckCircle2 size={16} className="text-white -mt-[1px] -ml-[1px]" />}
                      </div>

                      {/* Day card */}
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : dayNum)}
                        disabled={isLocked}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200
                          ${isCurrent
                            ? 'bg-indigo-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/5'
                            : isCompleted
                              ? 'bg-slate-800/20 border-slate-800/40'
                              : isLocked
                                ? 'bg-slate-900/30 border-slate-800/20 opacity-50 cursor-not-allowed'
                                : 'bg-slate-800/30 border-slate-800/40 hover:border-slate-700'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md
                              ${isCurrent ? 'bg-indigo-500/20 text-indigo-400' :
                                isCompleted ? 'bg-emerald-500/10 text-emerald-500' :
                                'bg-slate-800 text-slate-500'}`}
                            >
                              Day {dayNum}
                            </span>
                            <span className={`text-sm font-semibold
                              ${isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                              {item.title}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full animate-glow">
                                TODAY
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {item.topicId && (
                              <Link
                                to={`/topics/${item.topicId}`}
                                onClick={e => e.stopPropagation()}
                                className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                              >
                                <BookOpen size={12} /> Read
                              </Link>
                            )}
                            {isLocked ? <Lock size={14} className="text-slate-600" /> :
                              isExpanded ? <ChevronDown size={14} className="text-slate-400" /> :
                              <ChevronRight size={14} className="text-slate-500" />}
                          </div>
                        </div>

                        {/* Expanded tasks */}
                        {isExpanded && !isLocked && (
                          <div className="mt-3 pt-3 border-t border-slate-700/40 space-y-2">
                            {item.tasks.map((task, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <Circle size={14} className="text-slate-600 shrink-0" />
                                <span className="text-slate-400">{task}</span>
                              </div>
                            ))}
                            {item.topicId && (
                              <Link
                                to={`/topics/${item.topicId}`}
                                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg
                                  bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400
                                  hover:bg-indigo-500/20 transition-colors"
                              >
                                Start Learning <ArrowRight size={12} />
                              </Link>
                            )}
                          </div>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
