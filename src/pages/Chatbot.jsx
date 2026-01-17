import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import OnDemandClient from '../services/OnDemandClient'
import { useTranslation } from '../hooks/useTranslation'
import './Chatbot.css'

const Chatbot = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [chatClient, setChatClient] = useState(null)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  // Initialize chat session
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const apiKey = import.meta.env.VITE_ONDEMAND_API_KEY
        
        if (!apiKey) {
          setError('OnDemand API Key not configured. Please add VITE_ONDEMAND_API_KEY to your .env file.')
          return
        }

        const client = new OnDemandClient(apiKey)
        setChatClient(client)

        // Create a new session
        const userId = "user-" + Date.now()
        const sessionResp = await client.createSession(userId)
        setSessionId(sessionResp.data.id)

        // Add welcome message
        setMessages([
          {
            id: 'welcome',
            type: 'bot',
            content: 'Welcome to Jan Sahayak Chat! Ask me anything about our services, government affidavits, form filling, or any other assistance you need.'
          }
        ])
      } catch (err) {
        console.error('Failed to initialize chat:', err)
        setError('Failed to initialize chat. Please check your API configuration.')
      }
    }

    initializeChat()
  }, [])

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || !sessionId || !chatClient) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Add user message to chat
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage
    }])

    try {
      // Submit query to OnDemand API
      const response = await chatClient.submitQuery(
        sessionId,
        userMessage,
        'predefined-openai-gpt4o',
        'sync'
      )

      // Add bot response to chat
      setMessages(prev => [...prev, {
        id: response.data.id,
        type: 'bot',
        content: response.data.answer
      }])
    } catch (err) {
      console.error('Failed to send message:', err)
      setMessages(prev => [...prev, {
        id: 'error-' + Date.now(),
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        isError: true
      }])
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="chatbot-container">
        <div className="chatbot-header">
          <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
          <h1>{t('chatbot.title') || 'Jan Sahayak Chat'}</h1>
        </div>
        <div className="error-message">
          {error}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="chatbot-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="chatbot-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>{t('chatbot.title') || 'Jan Sahayak Chat'}</h1>
      </div>

      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            className={`message ${message.type} ${message.isError ? 'error' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="message-content">
              {message.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div
            className="message bot loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chatbot-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chatbot.placeholder') || 'Type your message...'}
          disabled={loading || !sessionId}
          className="chatbot-input"
        />
        <button
          type="submit"
          disabled={loading || !sessionId || !input.trim()}
          className="chatbot-send-btn"
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </motion.div>
  )
}

export default Chatbot
