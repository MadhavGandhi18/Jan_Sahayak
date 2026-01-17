import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import AnimatedGirl from '../components/AnimatedGirl'
import VoiceAssistant from '../components/VoiceAssistant'
import { useTranslation } from '../hooks/useTranslation'
import backgroundImage from '../images/image.png'
import './LandingPage.css'

const LandingPage = () => {
  const { t } = useTranslation()
  const [isVoiceAssistantActive, setIsVoiceAssistantActive] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
  const backgroundOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3])

  const teamMembers = [
    {
      name: 'Madhav Gandhi',
      email: 'member1@jansahayak.com',
      contact: '+91 98765 43210',
      role: 'Lead Developer'
    },
    {
      name: 'Divya Chaudhary',
      email: 'member2@jansahayak.com',
      contact: '+91 98765 43211',
      role: 'AI Specialist'
    },
    {
      name: 'Advitiya Sharma',
      email: 'member3@jansahayak.com',
      contact: '+91 98765 43212',
      role: 'UI/UX Designer'
    },
    {
      name: 'Manya',
      email: 'member4@jansahayak.com',
      contact: '+91 98765 43213',
      role: 'Backend Developer'
    }
  ]

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        {/* Parallax Background */}
        <motion.div
          className="hero-background"
          style={{
            y: backgroundY,
            scale: backgroundScale,
            opacity: backgroundOpacity,
          }}
        >
          <div className="background-image-wrapper">
            <img src={backgroundImage} alt="Background" className="background-image" />
            <div className="background-overlay"></div>
          </div>
        </motion.div>
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('landing.welcome')} <span className="gradient-text">Jan Sahayak</span>
            </motion.h1>
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('landing.subtitle')}
            </motion.p>
            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {t('landing.description')}
            </motion.p>
            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link to="/govt-affidavits">
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('landing.getStarted')}
                </motion.button>
              </Link>
              <Link to="/about-us">
                <motion.button
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('landing.learnMore')}
                </motion.button>
              </Link>
              <Link to="/chatbot">
                <motion.button
                  className="btn btn-chatbot"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  💬 Chat with AI
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <AnimatedGirl />
            <motion.button
              className="voice-assistant-trigger"
              onClick={() => setIsVoiceAssistantActive(true)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="voice-icon">🎙️</span>
              <span className="voice-text">Voice Helper</span>
            </motion.button>
          </motion.div>
        </div>
        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span>↓</span>
        </motion.div>
      </section>

      {/* About Project Section */}
      <section className="about-project-section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('landing.aboutTitle')}
          </motion.h2>
          <motion.div
            className="about-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="about-card">
              <div className="card-icon">🤖</div>
              <h3>{t('landing.aboutCard1.title')}</h3>
              <p>
                {t('landing.aboutCard1.description')}
              </p>
            </div>
            <div className="about-card">
              <div className="card-icon">📄</div>
              <h3>{t('landing.aboutCard2.title')}</h3>
              <p>
                {t('landing.aboutCard2.description')}
              </p>
            </div>
            <div className="about-card">
              <div className="card-icon">⚡</div>
              <h3>{t('landing.aboutCard3.title')}</h3>
              <p>
                {t('landing.aboutCard3.description')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('landing.featuresTitle')}
          </motion.h2>
          <div className="features-grid">
            {[
              {
                title: t('landing.feature1.title'),
                description: t('landing.feature1.description'),
                icon: '📋',
                link: '/govt-affidavits'
              },
              {
                title: t('landing.feature2.title'),
                description: t('landing.feature2.description'),
                icon: '📝',
                link: '/custom-forms'
              },
              {
                title: t('landing.feature3.title'),
                description: t('landing.feature3.description'),
                icon: '📥',
                link: '/govt-affidavits'
              },
              {
                title: t('landing.feature4.title'),
                description: t('landing.feature4.description'),
                icon: '🔒',
                link: '/about-us'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link to={feature.link} className="feature-link">
                  Learn More →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="about-us" className="team-section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('landing.teamTitle')}
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('landing.teamSubtitle')}
          </motion.p>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="team-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="team-avatar">
                  <span>{member.name.charAt(0)}</span>
                </div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <div className="team-contact">
                  <p><strong>Email:</strong> {member.email}</p>
                  <p><strong>Contact:</strong> {member.contact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>{t('landing.footer')}</p>
        </div>
      </footer>

      {/* Voice Assistant */}
      <VoiceAssistant
        isActive={isVoiceAssistantActive}
        onClose={() => setIsVoiceAssistantActive(false)}
      />
    </div>
  )
}

export default LandingPage
