import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SetCatalogueScreen } from './pages/SetCatalogueScreen'
import { AssessmentScreen } from './pages/AssessmentScreen'
import { ResultsDashboardScreen } from './pages/ResultsDashboardScreen'
import { AdminDashboardScreen } from './pages/AdminDashboardScreen'
import { SetCreatorScreen } from './pages/SetCreatorScreen'
import { SetEditorScreen } from './pages/SetEditorScreen'
import { AdminGuard } from './components/AdminGuard'
import { AuthStatusBanner } from './features/auth/AuthStatusBanner'
import { ConsentBanner } from './components/ConsentBanner'
import { OfflineBanner } from './components/OfflineBanner'
import { ThemeToggle } from './components/ThemeToggle'
import { useOfflineQueue } from './hooks/useOfflineQueue'

function App() {
  useOfflineQueue();

  return (
    <BrowserRouter>
      <AuthStatusBanner />
      <OfflineBanner />\n      <ThemeToggle />
      <Routes>
        <Route path="/" element={<SetCatalogueScreen />} />
        <Route path="/exam/:setId" element={<AssessmentScreen />} />
        <Route path="/results/:sessionId" element={<ResultsDashboardScreen />} />
        <Route path="/admin" element={<AdminGuard><AdminDashboardScreen /></AdminGuard>} />
        <Route path="/admin/sets/new" element={<AdminGuard><SetCreatorScreen /></AdminGuard>} />
        <Route path="/admin/sets/:setId" element={<AdminGuard><SetEditorScreen /></AdminGuard>} />
      </Routes>
      <ConsentBanner />
    </BrowserRouter>
  )
}

export default App
