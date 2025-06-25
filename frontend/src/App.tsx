import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { JobDashboard } from './features/jobs/JobDashboard'
import { ResumeAnalyzer } from './features/resume/ResumeAnalyzer'
import { ApplicationTracker } from './features/applications/ApplicationTracker'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<JobDashboard />} />
          <Route path="resume" element={<ResumeAnalyzer />} />
          <Route path="applications" element={<ApplicationTracker />} />
          <Route index element={<ResumeAnalyzer />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
