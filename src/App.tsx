import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SetCatalogueScreen } from './pages/SetCatalogueScreen'
import { AssessmentScreen } from './pages/AssessmentScreen'
import { ResultsDashboardScreen } from './pages/ResultsDashboardScreen'
import { AuthStatusBanner } from './features/auth/AuthStatusBanner'
import { ConsentBanner } from './components/ConsentBanner'

function App() {
  return (
    <BrowserRouter>
      <AuthStatusBanner />
      <Routes>
        <Route path="/" element={<SetCatalogueScreen />} />
        <Route path="/exam/:setId" element={<AssessmentScreen />} />
        <Route path="/results/:sessionId" element={<ResultsDashboardScreen />} />
      </Routes>
      <ConsentBanner />
    </BrowserRouter>
  )
}

export default App
