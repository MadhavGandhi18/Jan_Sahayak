import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to English
    return localStorage.getItem('selectedLanguage') || 'en'
  })
  const [showLanguageSelector, setShowLanguageSelector] = useState(() => {
    // Show selector if no language is saved
    return !localStorage.getItem('selectedLanguage')
  })

  useEffect(() => {
    // Save language to localStorage whenever it changes
    localStorage.setItem('selectedLanguage', language)
    setShowLanguageSelector(false)
  }, [language])

  const changeLanguage = (lang) => {
    setLanguage(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, showLanguageSelector, setShowLanguageSelector }}>
      {children}
    </LanguageContext.Provider>
  )
}
