import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from '../hooks/useTranslation'
import { useLanguage } from '../contexts/LanguageContext'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { setShowLanguageSelector } = useLanguage()

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        <Link to="/" className="logo">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="logo-text">Jan Sahayak</span>
          </motion.div>
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/govt-affidavits" 
            className={location.pathname === '/govt-affidavits' ? 'active' : ''}
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {t('nav.govtAffidavits')}
            </motion.span>
          </Link>
          <Link 
            to="/custom-forms"
            className={location.pathname === '/custom-forms' ? 'active' : ''}
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {t('nav.customForms')}
            </motion.span>
          </Link>
          <Link 
            to="/about-us"
            className={location.pathname === '/about-us' ? 'active' : ''}
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {t('nav.aboutUs')}
            </motion.span>
          </Link>
          <motion.button
            className="language-switcher"
            onClick={() => setShowLanguageSelector(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Change Language"
          >
            🌐
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
