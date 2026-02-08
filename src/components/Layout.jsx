import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useProgress } from '../store'
import {
  LayoutDashboard, Map, BookOpen, Brain, Code2, Users, Trophy,
  Menu, X, Flame, Zap, ChevronRight
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/roadmap', icon: Map, label: 'Roadmap' },
  { to: '/topics', icon: BookOpen, label: 'Topics' },
  { to: '/quiz', icon: Brain, label: 'Quizzes' },
  { to: '/practice', icon: Code2, label: 'Practice' },
  { to: '/scenarios', icon: Users, label: 'Scenarios' },
  { to: '/achievements', icon: Trophy, label: 'Achievements' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { xp, level, nextLevel, streak } = useProgress()
  const location = useLocation()

  const xpProgress = nextLevel
    ? ((xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100
    : 100

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-[260px] bg-slate-900/95 border-r border-slate-800/60
        flex flex-col z-50 transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100 tracking-tight">SDET Prep</div>
              <div className="text-[10px] text-slate-500 font-medium">Vikrant Mishra • 2026</div>
            </div>
          </div>
        </div>

        {/* XP & Level */}
        <div className="mx-4 mb-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{level.icon}</span>
              <span className="text-xs font-semibold text-slate-300">{level.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame size={13} className={streak.count > 0 ? 'text-orange-400' : 'text-slate-600'} />
              <span className={`text-xs font-bold ${streak.count > 0 ? 'text-orange-400' : 'text-slate-600'}`}>
                {streak.count}
              </span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-indigo-400 font-semibold">{xp} XP</span>
            {nextLevel && (
              <span className="text-[10px] text-slate-500">{nextLevel.minXp - xp} to {nextLevel.name}</span>
            )}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-xl text-[13px] font-medium
                transition-all duration-150 group
                ${isActive
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }
              `}
            >
              <item.icon size={17} className="shrink-0" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/60">
          <div className="text-[10px] text-slate-600 text-center leading-relaxed">
            India 2026 • Noida • Pune<br />Hyderabad • Bangalore • Dubai
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 lg:ml-[260px] min-h-screen">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 lg:hidden">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-800/50 text-slate-400"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-slate-200">SDET Prep</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/50">
                <Flame size={13} className={streak.count > 0 ? 'text-orange-400' : 'text-slate-600'} />
                <span className="text-xs font-bold text-slate-300">{streak.count}</span>
              </div>
              <div className="px-2 py-1 rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-400">
                {xp} XP
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="animate-fade">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
