import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SetCatalogueScreen } from './pages/SetCatalogueScreen'
import { AssessmentScreen } from './pages/AssessmentScreen'
import { ResultsDashboardScreen } from './pages/ResultsDashboardScreen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SetCatalogueScreen />} />
        <Route path="/exam/:setId" element={<AssessmentScreen />} />
        <Route path="/results/:sessionId" element={<ResultsDashboardScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
