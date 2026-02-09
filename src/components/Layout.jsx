import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useProgress } from '../store'
import {
  LayoutDashboard, Map, BookOpen, Brain, Code2, Users, Trophy,
  Menu, X, Flame, Zap, ChevronRight, Sun, Moon, Palette, BookMarked
} from 'lucide-react'

const THEMES = [
  { id: 'dark', label: 'Dark', icon: Moon, bg: 'bg-slate-800', ring: 'ring-indigo-500' },
  { id: 'light', label: 'Light', icon: Sun, bg: 'bg-amber-100', ring: 'ring-amber-500' },
  { id: 'sepia', label: 'Sepia', icon: Palette, bg: 'bg-amber-200', ring: 'ring-orange-500' },
]

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
  const [showThemePicker, setShowThemePicker] = useState(false)
  const { xp, level, nextLevel, streak, theme, readingMode, setTheme, toggleReadingMode } = useProgress()
  const location = useLocation()

  const xpProgress = nextLevel
    ? ((xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100
    : 100

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.className = `theme-${theme}`
  }, [theme])

  return (
    <div className={`min-h-screen flex transition-colors duration-300
      ${theme === 'light' ? 'bg-stone-50 text-stone-800' :
        theme === 'sepia' ? 'bg-amber-50 text-stone-800' :
        'bg-slate-950 text-slate-200'}`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-[260px] border-r
        flex flex-col z-50 transition-all duration-300
        ${readingMode ? '-translate-x-full lg:-translate-x-full' : `lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        ${theme === 'light' ? 'bg-white/95 border-stone-200' :
          theme === 'sepia' ? 'bg-orange-50/95 border-amber-200' :
          'bg-slate-900/95 border-slate-800/60'}
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

        {/* Theme & Reading Mode Controls */}
        <div className="mx-3 mb-2 p-2 rounded-xl bg-slate-800/40 border border-slate-700/30">
          {/* Theme picker */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Theme</span>
            <div className="flex gap-1">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  title={t.label}
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-all
                    ${theme === t.id
                      ? `${t.bg} ring-2 ${t.ring} scale-110`
                      : 'bg-slate-700/50 hover:bg-slate-700 text-slate-400'}`}
                >
                  <t.icon size={12} className={theme === t.id ? 'text-slate-900' : ''} />
                </button>
              ))}
            </div>
          </div>
          {/* Reading mode toggle */}
          <button
            onClick={toggleReadingMode}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all
              ${readingMode
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/40 border border-transparent'}`}
          >
            <span className="flex items-center gap-1.5">
              <BookMarked size={13} />
              Reading Mode
            </span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold
              ${readingMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700/50 text-slate-600'}`}>
              {readingMode ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/60">
          <div className="text-[10px] text-slate-600 text-center leading-relaxed">
            India 2026 • Noida • Pune<br />Hyderabad • Bangalore • Dubai
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className={`flex-1 min-h-screen transition-all duration-300
        ${readingMode ? 'lg:ml-0' : 'lg:ml-[260px]'}`}>
        {/* Top bar (mobile) */}
        <header className={`sticky top-0 z-30 backdrop-blur-xl border-b transition-colors duration-300
          ${theme === 'light' ? 'bg-white/90 border-stone-200' :
            theme === 'sepia' ? 'bg-orange-50/90 border-amber-200' :
            'bg-slate-950/90 border-slate-800/50'}
          ${readingMode ? '' : 'lg:hidden'}`}>
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => readingMode ? toggleReadingMode() : setSidebarOpen(!sidebarOpen)}
              className={`p-2 -ml-2 rounded-lg transition-colors
                ${theme === 'light' || theme === 'sepia' ? 'hover:bg-stone-200/50 text-stone-500' : 'hover:bg-slate-800/50 text-slate-400'}`}
            >
              {readingMode ? <BookMarked size={20} className="text-indigo-400" /> : sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className={`text-sm font-bold ${theme === 'light' || theme === 'sepia' ? 'text-stone-700' : 'text-slate-200'}`}>SDET Prep</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Reading mode toggle (topbar) */}
              {!readingMode && (
                <button
                  onClick={toggleReadingMode}
                  title="Reading Mode"
                  className={`p-1.5 rounded-lg transition-colors
                    ${theme === 'light' || theme === 'sepia' ? 'hover:bg-stone-200/50 text-stone-500' : 'hover:bg-slate-800/50 text-slate-400'}`}
                >
                  <BookMarked size={16} />
                </button>
              )}
              {/* Theme cycle (topbar) */}
              <button
                onClick={() => {
                  const idx = THEMES.findIndex(t => t.id === theme)
                  setTheme(THEMES[(idx + 1) % THEMES.length].id)
                }}
                title="Switch Theme"
                className={`p-1.5 rounded-lg transition-colors
                  ${theme === 'light' || theme === 'sepia' ? 'hover:bg-stone-200/50 text-stone-500' : 'hover:bg-slate-800/50 text-slate-400'}`}
              >
                {theme === 'dark' ? <Moon size={16} /> : theme === 'light' ? <Sun size={16} /> : <Palette size={16} />}
              </button>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg
                ${theme === 'light' || theme === 'sepia' ? 'bg-stone-100' : 'bg-slate-800/50'}`}>
                <Flame size={13} className={streak.count > 0 ? 'text-orange-400' : 'text-slate-600'} />
                <span className={`text-xs font-bold ${theme === 'light' || theme === 'sepia' ? 'text-stone-600' : 'text-slate-300'}`}>{streak.count}</span>
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
