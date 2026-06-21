import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SetCatalogueScreen } from './pages/SetCatalogueScreen'
import { AssessmentScreen } from './pages/AssessmentScreen'

function ResultsScreen() {
  return (
    <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
      <h1 className="text-2xl font-bold">Results</h1>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SetCatalogueScreen />} />
        <Route path="/exam/:setId" element={<AssessmentScreen />} />
        <Route path="/results/:sessionId" element={<ResultsScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
