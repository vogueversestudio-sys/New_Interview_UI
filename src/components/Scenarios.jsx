import { useState } from 'react'
import { SCENARIOS } from '../data'
import {
  Users, ChevronDown, ChevronRight, MessageSquare, CheckCircle2,
  Lightbulb, ArrowRight
} from 'lucide-react'

export default function Scenarios() {
  const [expanded, setExpanded] = useState(null)
  const [showAnswer, setShowAnswer] = useState({})
  const [userNotes, setUserNotes] = useState({})

  const toggleAnswer = (id) => {
    setShowAnswer(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 animate-slide-up">
        <div className="flex items-center gap-2 mb-1">
          <Users size={18} className="text-amber-400" />
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Mock Interviews</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Interview Scenarios</h1>
        <p className="text-slate-400 text-sm">
          Practice real-world SDET interview scenarios. Read the situation, think about your answer, then reveal the key points.
        </p>
      </div>

      {/* How to use */}
      <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15 mb-6 animate-slide-up stagger-1">
        <h3 className="text-xs font-bold text-indigo-400 mb-2 flex items-center gap-1.5">
          <Lightbulb size={13} /> How to Practice
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2"><span className="text-indigo-400 font-bold">1.</span> Read the scenario</div>
          <div className="flex items-center gap-2"><span className="text-indigo-400 font-bold">2.</span> Write your answer</div>
          <div className="flex items-center gap-2"><span className="text-indigo-400 font-bold">3.</span> Speak it aloud (practice!)</div>
          <div className="flex items-center gap-2"><span className="text-indigo-400 font-bold">4.</span> Reveal key points</div>
        </div>
      </div>

      {/* Scenarios list */}
      <div className="space-y-4">
        {SCENARIOS.map((scenario, i) => {
          const isExpanded = expanded === scenario.id
          const isAnswerShown = showAnswer[scenario.id]
          return (
            <div
              key={scenario.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/50 overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
            >
              {/* Scenario header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : scenario.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-800/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <MessageSquare size={18} className="text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-slate-200 truncate">{scenario.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-500 shrink-0">
                      {scenario.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{scenario.situation.slice(0, 80)}...</p>
                </div>
                {isExpanded ? <ChevronDown size={16} className="text-slate-500 shrink-0" />
                  : <ChevronRight size={16} className="text-slate-500 shrink-0" />}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-5 pb-5 animate-fade">
                  {/* Situation */}
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 mb-4">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">📋 Situation</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{scenario.situation}</p>
                  </div>

                  {/* Your answer area */}
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      ✍️ Your Answer
                    </h4>
                    <textarea
                      value={userNotes[scenario.id] || ''}
                      onChange={e => setUserNotes(prev => ({ ...prev, [scenario.id]: e.target.value }))}
                      placeholder="Type your answer here... Think about what you would say in an interview."
                      className="w-full h-32 p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 text-sm text-slate-200
                        placeholder:text-slate-600 resize-none focus:outline-none focus:border-indigo-500/40 transition-colors"
                    />
                    <p className="text-[10px] text-slate-600 mt-1">💡 Tip: Practice saying your answer out loud for 2-3 minutes</p>
                  </div>

                  {/* Reveal key points */}
                  <button
                    onClick={() => toggleAnswer(scenario.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-sm font-semibold transition-all
                      ${isAnswerShown
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                        : 'bg-indigo-500/5 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10'}`}
                  >
                    <span className="flex items-center gap-2">
                      {isAnswerShown ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                      {isAnswerShown ? 'Key Points Revealed' : 'Reveal Key Points'}
                    </span>
                    {isAnswerShown ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {isAnswerShown && (
                    <div className="mt-3 space-y-2 animate-slide-up">
                      {scenario.keyPoints.map((point, j) => (
                        <div
                          key={j}
                          className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10"
                          style={{ animationDelay: `${j * 0.05}s` }}
                        >
                          <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-300 leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
