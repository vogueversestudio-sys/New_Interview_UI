import { Routes, Route, Navigate } from 'react-router-dom'
import { ProgressProvider } from './store'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Roadmap from './components/Roadmap'
import Topics from './components/Topics'
import Reader from './components/Reader'
import Quiz from './components/Quiz'
import Practice from './components/Practice'
import Scenarios from './components/Scenarios'
import Achievements from './components/Achievements'

export default function App() {
  return (
    <ProgressProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="topics" element={<Topics />} />
          <Route path="topics/:topicId" element={<Reader />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="quiz/:quizId" element={<Quiz />} />
          <Route path="practice" element={<Practice />} />
          <Route path="scenarios" element={<Scenarios />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ProgressProvider>
  )
}
