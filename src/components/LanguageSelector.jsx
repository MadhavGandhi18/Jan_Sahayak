import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import './LanguageSelector.css'

const LanguageSelector = () => {
  const { language, changeLanguage, showLanguageSelector, setShowLanguageSelector } = useLanguage()

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' }
  ]

  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode)
    setShowLanguageSelector(false)
  }

  if (!showLanguageSelector) return null

  return (
    <AnimatePresence>
      <motion.div
        className="language-selector-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowLanguageSelector(false)}
      >
        <motion.div
          className="language-selector-modal"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Choose Your Language / अपनी भाषा चुनें / तुमची भाषा निवडा</h2>
          <p>Select a language to continue / जारी रखने के लिए एक भाषा चुनें / सुरू ठेवण्यासाठी एक भाषा निवडा</p>
          
          <div className="language-options">
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                className={`language-option ${language === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageSelect(lang.code)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="language-flag">{lang.flag}</span>
                <span className="language-name">{lang.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LanguageSelector
