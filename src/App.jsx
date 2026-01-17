import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import LanguageSelector from './components/LanguageSelector'
import LandingPage from './pages/LandingPage'
import GovtAffidavits from './pages/GovtAffidavits'
import CustomForms from './pages/CustomForms'
import AboutUs from './pages/AboutUs'
import Chatbot from './pages/Chatbot'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <LanguageSelector />
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/govt-affidavits" element={<GovtAffidavits />} />
            <Route path="/custom-forms" element={<CustomForms />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
