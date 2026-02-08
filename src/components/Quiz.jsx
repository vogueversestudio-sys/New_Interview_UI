import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProgress } from '../store'
import { QUIZZES } from '../data'
import {
  Brain, ChevronRight, Trophy, RotateCcw, ArrowLeft, CheckCircle2,
  XCircle, Clock, Zap, Target, ArrowRight, Star
} from 'lucide-react'

function QuizSelector() {
  const { quizScores } = useProgress()
  const quizList = Object.entries(QUIZZES)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 animate-slide-up">
        <div className="flex items-center gap-2 mb-1">
          <Brain size={18} className="text-purple-400" />
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Test Your Knowledge</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Quizzes</h1>
        <p className="text-slate-400 text-sm">Challenge yourself with topic-specific quizzes. Earn XP for correct answers!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizList.map(([key, quiz], i) => {
          const score = quizScores[key]
          const isPerfect = score && score.score === score.total
          return (
            <Link
              key={key}
              to={`/quiz/${key}`}
              className="group relative p-5 rounded-2xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-xl animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both',
                background: score ? 'rgba(16,185,129,0.03)' : 'rgba(30,41,59,0.3)',
                borderColor: isPerfect ? 'rgba(16,185,129,0.3)' : score ? 'rgba(16,185,129,0.15)' : 'rgba(51,65,85,0.3)'
              }}
            >
              <div className="text-3xl mb-3">{quiz.icon}</div>
              <h3 className="text-base font-bold text-slate-200 mb-1">{quiz.title}</h3>
              <p className="text-xs text-slate-500 mb-3">{quiz.questions.length} questions</p>

              {score ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {isPerfect ? (
                      <Star size={14} className="text-amber-400" />
                    ) : (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    )}
                    <span className="text-sm font-bold text-emerald-400">{score.score}/{score.total}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {isPerfect ? '⭐ Perfect!' : 'Retake →'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-400 font-semibold">Start Quiz</span>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                </div>
              )}

              {isPerfect && (
                <div className="absolute top-3 right-3 text-lg">🏆</div>
              )}
            </Link>
          )
        })}
      </div>

      {/* XP Info */}
      <div className="mt-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 animate-slide-up stagger-6">
        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-2">
          <Zap size={14} className="text-indigo-400" /> How XP Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2"><span className="text-indigo-400 font-bold">+20 XP</span> per correct answer</div>
          <div className="flex items-center gap-2"><span className="text-amber-400 font-bold">+50 XP</span> bonus for perfect score</div>
          <div className="flex items-center gap-2"><span className="text-emerald-400 font-bold">Retake</span> anytime to improve</div>
        </div>
      </div>
    </div>
  )
}

function QuizPlay({ quizId }) {
  const navigate = useNavigate()
  const { saveQuizScore } = useProgress()
  const quiz = QUIZZES[quizId]
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if (finished) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [finished])

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Quiz not found</p>
          <Link to="/quiz" className="text-indigo-400 text-sm hover:underline">← Back to Quizzes</Link>
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQ]
  const total = quiz.questions.length
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const isCorrect = idx === question.answer
    if (isCorrect) setScore(s => s + 1)
    setAnswers(prev => [...prev, { question: currentQ, selected: idx, correct: question.answer, isCorrect }])
  }

  const handleNext = () => {
    if (currentQ + 1 >= total) {
      const finalScore = score
      saveQuizScore(quizId, finalScore, total)
      setFinished(true)
    } else {
      setCurrentQ(q => q + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const handleRestart = () => {
    setCurrentQ(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setAnswers([])
    setFinished(false)
    setTimer(0)
  }

  if (finished) {
    const percent = Math.round((score / total) * 100)
    const isPerfect = score === total
    const xpEarned = score * 20 + (isPerfect ? 50 : 0)

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/50 p-6 sm:p-8 text-center animate-slide-up">
          <div className="text-5xl mb-4">{isPerfect ? '🏆' : percent >= 70 ? '🎉' : percent >= 50 ? '👍' : '💪'}</div>
          <h2 className="text-2xl font-extrabold text-white mb-2">
            {isPerfect ? 'Perfect Score!' : percent >= 70 ? 'Great Job!' : percent >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
          </h2>
          <p className="text-slate-400 text-sm mb-6">{quiz.title} — Completed in {formatTime(timer)}</p>

          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-white">{score}/{total}</div>
              <div className="text-xs text-slate-500">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-indigo-400">+{xpEarned}</div>
              <div className="text-xs text-slate-500">XP Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-amber-400">{percent}%</div>
              <div className="text-xs text-slate-500">Score</div>
            </div>
          </div>

          {/* Score bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-6">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                percent >= 70 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                percent >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                'bg-gradient-to-r from-red-500 to-orange-400'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Review answers */}
          <div className="text-left space-y-2 mb-6 max-h-64 overflow-y-auto">
            {answers.map((a, i) => (
              <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg text-sm
                ${a.isCorrect ? 'bg-emerald-500/5' : 'bg-red-500/5'}`}>
                {a.isCorrect
                  ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  : <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-slate-300 text-xs">{quiz.questions[a.question].q}</p>
                  {!a.isCorrect && (
                    <p className="text-[11px] text-emerald-400 mt-0.5">
                      Correct: {quiz.questions[a.question].options[a.correct]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40
                text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw size={14} /> Retake
            </button>
            <Link
              to="/quiz"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30
                text-sm font-semibold text-indigo-400 hover:bg-indigo-500/20 transition-colors"
            >
              All Quizzes <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade">
        <Link to="/quiz" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-400 transition-colors">
          <ArrowLeft size={14} /> Quizzes
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock size={12} /> {formatTime(timer)}
          </span>
          <span className="text-xs font-bold text-indigo-400">{currentQ + 1}/{total}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentQ + (answered ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/50 p-6 sm:p-8 animate-slide-up" key={currentQ}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{quiz.icon}</span>
          <span className="text-xs text-slate-500 font-semibold">{quiz.title}</span>
        </div>

        <h2 className="text-lg font-bold text-white mb-6 leading-relaxed">{question.q}</h2>

        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            let styles = 'bg-slate-800/40 border-slate-700/40 text-slate-300 hover:border-indigo-500/40 hover:bg-slate-800/60'
            if (answered) {
              if (idx === question.answer) {
                styles = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
              } else if (idx === selected && idx !== question.answer) {
                styles = 'bg-red-500/10 border-red-500/40 text-red-400 animate-shake'
              } else {
                styles = 'bg-slate-800/20 border-slate-800/30 text-slate-500 opacity-50'
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left ${styles}`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
                  ${answered && idx === question.answer ? 'bg-emerald-500/20 text-emerald-400' :
                    answered && idx === selected ? 'bg-red-500/20 text-red-400' :
                    'bg-slate-700/50 text-slate-400'}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm font-medium flex-1">{opt}</span>
                {answered && idx === question.answer && <CheckCircle2 size={18} className="text-emerald-400" />}
                {answered && idx === selected && idx !== question.answer && <XCircle size={18} className="text-red-400" />}
              </button>
            )
          })}
        </div>

        {/* Feedback & Next */}
        {answered && (
          <div className="mt-6 flex items-center justify-between animate-slide-up">
            <div className={`text-sm font-semibold ${selected === question.answer ? 'text-emerald-400' : 'text-red-400'}`}>
              {selected === question.answer ? '✓ Correct! +20 XP' : '✗ Wrong answer'}
            </div>
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600
                text-sm font-semibold text-white transition-colors"
            >
              {currentQ + 1 >= total ? 'See Results' : 'Next'}
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Score tracker */}
      <div className="flex justify-center mt-4">
        <span className="text-xs text-slate-500">Score: <span className="text-emerald-400 font-bold">{score}</span> / {currentQ + (answered ? 1 : 0)}</span>
      </div>
    </div>
  )
}

export default function Quiz() {
  const { quizId } = useParams()
  if (quizId) return <QuizPlay quizId={quizId} />
  return <QuizSelector />
}
