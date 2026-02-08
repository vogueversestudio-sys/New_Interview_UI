import { Link } from 'react-router-dom'
import { useProgress } from '../store'
import { TOPICS } from '../data'
import { BookOpen, CheckCircle2, ChevronRight, Search } from 'lucide-react'
import { useState } from 'react'

export default function Topics() {
  const { completedTopics } = useProgress()
  const [search, setSearch] = useState('')

  const filtered = TOPICS.map(cat => ({
    ...cat,
    items: cat.items.filter(i =>
      i.label.toLowerCase().includes(search.toLowerCase()) ||
      cat.category.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-slide-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={18} className="text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Study Material</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">All Topics</h1>
          <p className="text-slate-400 text-sm mt-1">350+ questions across 17 chapters. Click any topic to start reading.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-200
              placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filtered.map((cat, catIdx) => (
          <div key={cat.category} className="animate-slide-up" style={{ animationDelay: `${catIdx * 0.05}s`, animationFillMode: 'both' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">{cat.category}</h2>
              <span className="text-[10px] text-slate-600 ml-1">{cat.items.length} {cat.items.length === 1 ? 'topic' : 'topics'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.items.map(item => {
                const isDone = completedTopics.includes(item.id)
                return (
                  <Link
                    key={item.id}
                    to={`/topics/${item.id}`}
                    className={`group relative flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-200
                      hover:scale-[1.01] hover:shadow-lg
                      ${isDone
                        ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                        : 'bg-slate-800/30 border-slate-700/30 hover:border-indigo-500/30 hover:bg-slate-800/50'
                      }`}
                  >
                    <div className="text-2xl shrink-0">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200 truncate">{item.label}</span>
                        {isDone && <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />}
                      </div>
                      <span className="text-[11px] text-slate-500">{item.questions > 0 ? `${item.questions} questions` : 'Review'}</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
