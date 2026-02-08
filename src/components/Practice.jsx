import { useState } from 'react'
import { useProgress } from '../store'
import { PRACTICE_PROBLEMS } from '../data'
import {
  Code2, ChevronRight, ChevronDown, CheckCircle2, Lightbulb,
  Eye, EyeOff, Filter, Zap, Play, RotateCcw
} from 'lucide-react'

const DIFFICULTIES = ['All', 'Easy', 'Medium']
const CATEGORIES = ['All', ...new Set(PRACTICE_PROBLEMS.map(p => p.category))]

export default function Practice() {
  const { completedProblems, completeProblem } = useProgress()
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [userCode, setUserCode] = useState('')
  const [diffFilter, setDiffFilter] = useState('All')
  const [catFilter, setCatFilter] = useState('All')

  const filtered = PRACTICE_PROBLEMS.filter(p => {
    if (diffFilter !== 'All' && p.difficulty !== diffFilter) return false
    if (catFilter !== 'All' && p.category !== catFilter) return false
    return true
  })

  const problem = selectedProblem ? PRACTICE_PROBLEMS.find(p => p.id === selectedProblem) : null

  if (problem) {
    const isDone = completedProblems.includes(problem.id)
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back button */}
        <button
          onClick={() => { setSelectedProblem(null); setShowHint(false); setShowSolution(false); setUserCode('') }}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-400 transition-colors mb-5"
        >
          <ChevronRight size={14} className="rotate-180" /> Back to Problems
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left — Problem description */}
          <div className="space-y-4 animate-slide-up">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md
                    ${problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-md">{problem.category}</span>
                  <span className="text-[10px] text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-md uppercase">{problem.language}</span>
                </div>
                <button
                  onClick={() => completeProblem(problem.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                    ${isDone
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'}`}
                >
                  <CheckCircle2 size={12} />
                  {isDone ? 'Solved ✓' : 'Mark Solved (+30 XP)'}
                </button>
              </div>

              <h2 className="text-lg font-bold text-white mb-3">{problem.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">{problem.description}</p>

              {/* Examples */}
              <div className="space-y-2">
                {problem.examples.map((ex, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                    <div className="text-xs text-slate-500 mb-1">Example {i + 1}:</div>
                    <div className="text-xs font-mono text-slate-300">
                      <span className="text-slate-500">Input:</span> {ex.input}
                    </div>
                    <div className="text-xs font-mono text-emerald-400">
                      <span className="text-slate-500">Output:</span> {ex.output}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hint */}
            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-amber-500/5 border border-amber-500/20
                text-sm font-semibold text-amber-400 hover:bg-amber-500/10 transition-colors"
            >
              <span className="flex items-center gap-2"><Lightbulb size={16} /> {showHint ? 'Hide Hint' : 'Show Hint'}</span>
              {showHint ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {showHint && (
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-sm text-amber-300/80 animate-slide-up">
                💡 {problem.hint}
              </div>
            )}

            {/* Solution */}
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20
                text-sm font-semibold text-indigo-400 hover:bg-indigo-500/10 transition-colors"
            >
              <span className="flex items-center gap-2">
                {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </span>
              {showSolution ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {showSolution && (
              <div className="rounded-xl bg-slate-900/80 border border-slate-700/50 overflow-hidden animate-slide-up">
                <div className="px-4 py-2 bg-slate-800/60 border-b border-slate-700/40 flex items-center gap-2">
                  <Code2 size={13} className="text-emerald-400" />
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Solution</span>
                </div>
                <pre className="p-4 overflow-x-auto">
                  <code className="text-[13px] font-mono text-slate-300 leading-relaxed whitespace-pre">
                    {problem.solution}
                  </code>
                </pre>
              </div>
            )}
          </div>

          {/* Right — Code editor */}
          <div className="space-y-4 animate-slide-up stagger-2">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800/50 overflow-hidden">
              <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-700/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium ml-1">Your Solution</span>
                </div>
                <button
                  onClick={() => setUserCode('')}
                  className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw size={10} /> Clear
                </button>
              </div>
              <textarea
                value={userCode}
                onChange={e => setUserCode(e.target.value)}
                placeholder={`# Write your ${problem.language} solution here...\n# Try solving it before checking the solution!\n\n`}
                className="w-full h-80 p-4 bg-transparent text-[13px] font-mono text-slate-200 leading-relaxed
                  resize-none focus:outline-none placeholder:text-slate-600"
                spellCheck={false}
              />
            </div>

            {/* Tips */}
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                <Zap size={12} className="text-indigo-400" /> Interview Tips
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-500">
                <li>• Think aloud — explain your approach before coding</li>
                <li>• Start with brute force, then optimize</li>
                <li>• Consider edge cases: empty input, single element, duplicates</li>
                <li>• State time & space complexity of your solution</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 animate-slide-up">
        <div className="flex items-center gap-2 mb-1">
          <Code2 size={18} className="text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Hands-On Practice</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Code Practice</h1>
        <p className="text-slate-400 text-sm">Solve coding problems commonly asked in SDET interviews. Earn +30 XP per problem.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6 animate-slide-up stagger-1">
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-slate-500" />
          <span className="text-xs text-slate-500">Difficulty:</span>
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors
                ${diffFilter === d
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  : 'bg-slate-800/40 text-slate-500 border border-slate-700/30 hover:text-slate-300'}`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-0 sm:ml-4">
          <span className="text-xs text-slate-500">Category:</span>
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800/40 text-slate-400 border border-slate-700/30
              focus:outline-none focus:border-indigo-500/40"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Problem grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((p, i) => {
          const isDone = completedProblems.includes(p.id)
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProblem(p.id)}
              className={`group text-left p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01]
                animate-slide-up
                ${isDone
                  ? 'bg-emerald-500/5 border-emerald-500/15 hover:border-emerald-500/30'
                  : 'bg-slate-800/30 border-slate-700/30 hover:border-indigo-500/30'}`}
              style={{ animationDelay: `${i * 0.03}s`, animationFillMode: 'both' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md
                  ${p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {p.difficulty}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-600 uppercase">{p.language}</span>
                  {isDone && <CheckCircle2 size={13} className="text-emerald-400" />}
                </div>
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1 group-hover:text-white transition-colors">
                {p.title}
              </h3>
              <span className="text-[11px] text-slate-500">{p.category}</span>
            </button>
          )
        })}
      </div>

      {/* Stats */}
      <div className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 flex items-center justify-between animate-slide-up stagger-4">
        <span className="text-xs text-slate-500">
          Progress: <span className="text-emerald-400 font-bold">{completedProblems.length}</span> / {PRACTICE_PROBLEMS.length} solved
        </span>
        <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(completedProblems.length / PRACTICE_PROBLEMS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
