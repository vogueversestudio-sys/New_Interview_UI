import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProgress } from '../store'
import { ALL_ITEMS } from '../data'
import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'
import yaml from 'highlight.js/lib/languages/yaml'
import groovy from 'highlight.js/lib/languages/groovy'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import 'highlight.js/styles/github-dark.css'
import {
  ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Clock, Copy, Check,
  ChevronLeft, ChevronRight
} from 'lucide-react'

hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('groovy', groovy)
hljs.registerLanguage('dockerfile', dockerfile)

marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try { return hljs.highlight(code, { language: lang }).value } catch {}
    }
    try { return hljs.highlightAuto(code).value } catch {}
    return code
  },
})

export default function Reader() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const { completedTopics, completeTopic, readingMode, theme } = useProgress()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [readProgress, setReadProgress] = useState(0)
  const contentRef = useRef(null)

  const item = ALL_ITEMS.find(i => i.id === topicId)
  const idx = ALL_ITEMS.indexOf(item)
  const prev = idx > 0 ? ALL_ITEMS[idx - 1] : null
  const next = idx < ALL_ITEMS.length - 1 ? ALL_ITEMS[idx + 1] : null
  const isDone = completedTopics.includes(topicId)

  useEffect(() => {
    if (!item) return
    setLoading(true)
    setContent('')
    setReadProgress(0)
    fetch(`/content/${item.file}`)
      .then(r => r.ok ? r.text() : Promise.reject('Not found'))
      .then(md => {
        const lines = md.split('\n')
        const filtered = lines.filter((l, i) => {
          if (i === 0 && l.startsWith('# ')) return false
          if (i <= 3 && l.startsWith('## ')) return false
          return true
        }).join('\n')
        setContent(marked.parse(filtered))
        setLoading(false)
      })
      .catch(() => {
        setContent('<p class="text-slate-500">Content not available. Run the dev server with <code>npm run dev</code> to load content.</p>')
        setLoading(false)
      })
  }, [topicId, item])

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return
      const el = contentRef.current
      const rect = el.getBoundingClientRect()
      const scrolled = Math.max(0, -rect.top)
      const total = el.scrollHeight - window.innerHeight
      const pct = total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 100
      setReadProgress(pct)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [content])

  useEffect(() => {
    if (!contentRef.current) return
    contentRef.current.querySelectorAll('pre code').forEach(block => {
      if (!block.dataset.highlighted) {
        try { hljs.highlightElement(block) } catch {}
        block.dataset.highlighted = 'true'
      }
    })
    contentRef.current.querySelectorAll('pre').forEach(pre => {
      if (pre.querySelector('.copy-btn')) return
      const btn = document.createElement('button')
      btn.className = 'copy-btn absolute top-2 right-2 px-2 py-1 rounded-md text-[10px] font-semibold bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1'
      btn.innerHTML = 'Copy'
      btn.onclick = () => {
        const code = pre.querySelector('code')?.textContent || ''
        navigator.clipboard.writeText(code).then(() => {
          btn.innerHTML = '✓ Copied'
          btn.classList.add('text-emerald-400', 'border-emerald-500/30')
          setTimeout(() => {
            btn.innerHTML = 'Copy'
            btn.classList.remove('text-emerald-400', 'border-emerald-500/30')
          }, 2000)
        })
      }
      pre.style.position = 'relative'
      pre.classList.add('group')
      pre.appendChild(btn)
    })
  }, [content])

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Topic not found</p>
          <Link to="/topics" className="text-indigo-400 text-sm hover:underline">← Back to Topics</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`mx-auto px-4 sm:px-6 py-6 sm:py-8 transition-all duration-300
      ${readingMode ? 'max-w-3xl reading-mode' : 'max-w-4xl'}`}>
      {/* Reading progress bar */}
      <div className={`fixed top-0 left-0 right-0 h-1 z-50
        ${theme === 'light' ? 'bg-stone-200' : theme === 'sepia' ? 'bg-amber-100' : 'bg-slate-900'}`}>
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Header */}
      <div className="mb-6 animate-slide-up">
        <Link to="/topics" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-400 transition-colors mb-4">
          <ArrowLeft size={14} /> Back to Topics
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                Chapter {String(idx + 1).padStart(2, '0')} of {ALL_ITEMS.length}
              </span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-extrabold
              ${theme === 'light' || theme === 'sepia' ? 'text-stone-800' : 'text-white'}
              ${readingMode ? 'sm:text-3xl' : ''}`}>{item.label}</h1>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><BookOpen size={12} /> {item.questions} questions</span>
              <span className="flex items-center gap-1"><Clock size={12} /> ~{Math.max(5, Math.round(item.questions * 1.5))} min read</span>
            </div>
          </div>
          <button
            onClick={() => completeTopic(topicId)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all
              ${isDone
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
              }`}
          >
            <CheckCircle2 size={14} />
            {isDone ? 'Completed ✓' : 'Mark Complete (+50 XP)'}
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div
          ref={contentRef}
          className="md-body animate-fade"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-800/50">
        {prev ? (
          <Link
            to={`/topics/${prev.id}`}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/30
              hover:border-indigo-500/30 transition-all text-left group"
          >
            <ChevronLeft size={16} className="text-slate-500 group-hover:text-indigo-400" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Previous</div>
              <div className="text-sm font-semibold text-slate-300">{prev.label}</div>
            </div>
          </Link>
        ) : <div />}
        {next ? (
          <Link
            to={`/topics/${next.id}`}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/30
              hover:border-indigo-500/30 transition-all text-right group"
          >
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Next</div>
              <div className="text-sm font-semibold text-slate-300">{next.label}</div>
            </div>
            <ChevronRight size={16} className="text-slate-500 group-hover:text-indigo-400" />
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}
