import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './VoiceAssistant.css'

const VoiceAssistant = ({ onFormDataUpdate, isActive, onClose }) => {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [conversation, setConversation] = useState([])
  const [currentStep, setCurrentStep] = useState('greeting')
  const [formData, setFormData] = useState({})
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0)
  const [language, setLanguage] = useState('en') // 'en' or 'hi'
  const recognitionRef = useRef(null)
  const audioRef = useRef(null)
  const navigate = useNavigate()

  const ONDEMAND_API_KEY = import.meta.env.VITE_ONDEMAND_API_KEY || 'cJP3spu2jknHr9XWzGEatDgKH3F4u2pL'
  const TTS_API_URL = 'https://api.on-demand.io/services/v1/public/service/execute/text_to_speech'

  // Income Certificate fields
  const incomeFields = [
    { key: 'name', en: 'Full Name', hi: 'पूरा नाम' },
    { key: 'fatherName', en: "Father's Name", hi: 'पिता का नाम' },
    { key: 'dateOfBirth', en: 'Date of Birth', hi: 'जन्म तिथि' },
    { key: 'address', en: 'Address', hi: 'पता' },
    { key: 'annualIncome', en: 'Annual Income', hi: 'वार्षिक आय' },
    { key: 'occupation', en: 'Occupation', hi: 'व्यवसाय' },
    { key: 'panNumber', en: 'PAN Number', hi: 'PAN नंबर' }
  ]

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US,hi-IN'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        handleUserInput(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        const errorMsg = language === 'hi'
          ? "क्षमा करें, मैं आपको सुन नहीं पाई। कृपया फिर से कोशिश करें।"
          : "Sorry, I couldn't hear you. Please try again."
        speakText(errorMsg)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [language])

  // Start conversation when component becomes active
  useEffect(() => {
    if (isActive && currentStep === 'greeting' && conversation.length === 0) {
      startConversation()
    }
  }, [isActive])

  // Detect if input is in Hindi
  const isHindiInput = (text) => {
    return /[\u0900-\u097F]/.test(text)
  }

  // Text to Speech using OnDemand API
  const speakText = async (text) => {
    if (!text) return

    setIsSpeaking(true)
    addToConversation('assistant', text)

    try {
      const response = await axios.post(
        TTS_API_URL,
        {
          input: text,
          voice: 'nova',
          model: 'tts-1-hd'
        },
        {
          headers: {
            'apikey': ONDEMAND_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data?.data?.audioUrl) {
        const audio = new Audio(response.data.data.audioUrl)
        audioRef.current = audio
        audio.onended = () => setIsSpeaking(false)
        audio.onerror = () => {
          setIsSpeaking(false)
          fallbackTTS(text)
        }
        audio.play()
      } else {
        fallbackTTS(text)
      }
    } catch (error) {
      console.error('TTS Error:', error)
      fallbackTTS(text)
    }
  }

  // Fallback to browser TTS
  const fallbackTTS = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US'
      utterance.voice = speechSynthesis.getVoices().find(voice =>
        (language === 'hi' && voice.lang.includes('hi')) ||
        (language === 'en' && (voice.name.includes('Female') || voice.name.includes('Zira')))
      ) || speechSynthesis.getVoices()[0]
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    } else {
      setIsSpeaking(false)
    }
  }

  // Start listening for user input
  const startListening = () => {
    if (isSpeaking) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel()
      }
      setIsSpeaking(false)
    }

    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US'
      recognitionRef.current.start()
    }
  }

  // Handle user input
  const handleUserInput = (userText) => {
    addToConversation('user', userText)

    // Detect language and set it
    if (isHindiInput(userText)) {
      setLanguage('hi')
    }

    processCommand(userText.trim())
  }

  // Process user commands
  const processCommand = (command) => {
    const lowerCommand = command.toLowerCase()

    // Check if we're filling the form
    if (currentStep === 'fillingForm') {
      handleFormInput(command)
      return
    }

    // Detect income certificate requests
    if (lowerCommand.includes('income') || lowerCommand.includes('income tax') ||
      lowerCommand.includes('income certificate') || lowerCommand.includes('आय') ||
      lowerCommand.includes('इनकम')) {
      startIncomeForm()
      return
    }

    // Help or intro
    if (lowerCommand.includes('help') || lowerCommand.includes('what') ||
      lowerCommand.includes('क्या') || lowerCommand.includes('मदद')) {
      const helpMsg = language === 'hi'
        ? "मैं आपकी आवाज सहायक हूं। मैं आय प्रमाणपत्र फॉर्म भरने में आपकी मदद कर सकती हूं। 'आय प्रमाणपत्र' या 'income certificate' कहें।"
        : "I'm your voice assistant. I can help you fill out an income certificate form. Just say 'income certificate' to get started."
      speakText(helpMsg)
      return
    }

    // Default greeting response
    const defaultMsg = language === 'hi'
      ? "नमस्ते! मैं आपकी आवाज सहायक हूं। आय प्रमाणपत्र फॉर्म भरने के लिए 'आय प्रमाणपत्र' कहें।"
      : "Hello! I'm your voice assistant. Say 'income certificate' to fill out an income certificate form."
    speakText(defaultMsg)
  }

  // Start conversation
  const startConversation = () => {
    const greeting = language === 'hi'
      ? "नमस्ते! मैं आपकी आवाज सहायक हूं। मैं आय प्रमाणपत्र फॉर्म भरने में आपकी मदद कर सकती हूं। 'आय प्रमाणपत्र' कहें।"
      : "Hello! I'm your voice assistant. I can help you fill out an income certificate form. Just say 'income certificate' to get started."
    speakText(greeting)
  }

  // Start income form filling
  const startIncomeForm = () => {
    navigate('/govt-affidavits')
    setCurrentStep('fillingForm')
    setCurrentFieldIndex(0)
    setFormData({})

    setTimeout(() => {
      // Trigger form selection
      window.dispatchEvent(new CustomEvent('selectAffidavit', {
        detail: {
          id: 'income',
          name: 'Income Certificate Affidavit',
          fields: incomeFields.map(f => f.en)
        }
      }))

      // Ask first question
      const firstField = incomeFields[0]
      const question = language === 'hi'
        ? `बढ़िया! आय प्रमाणपत्र फॉर्म भरना शुरू करते हैं। ${firstField.hi} क्या है?`
        : `Great! Let's fill out the income certificate form. What is your ${firstField.en.toLowerCase()}?`
      speakText(question)
    }, 800)
  }

  // Handle form input
  const handleFormInput = (input) => {
    if (currentFieldIndex >= incomeFields.length) {
      // All fields filled
      generatePDF()
      return
    }

    const currentField = incomeFields[currentFieldIndex]
    const newFormData = { ...formData, [currentField.key]: input }
    setFormData(newFormData)

    // Update parent if callback provided
    if (onFormDataUpdate) {
      onFormDataUpdate(newFormData)
    }

    const nextIndex = currentFieldIndex + 1

    if (nextIndex >= incomeFields.length) {
      // All fields filled
      const completeMsg = language === 'hi'
        ? "बढ़िया! मेरे पास सभी जानकारी है। अब मैं आपका PDF बनाती हूं।"
        : "Perfect! I have all the information. Let me generate your PDF now."
      speakText(completeMsg)
      setTimeout(() => {
        generatePDF()
      }, 1500)
    } else {
      // Ask next question
      const nextField = incomeFields[nextIndex]
      const question = language === 'hi'
        ? `${nextField.hi} क्या है?`
        : `What is your ${nextField.en.toLowerCase()}?`
      setCurrentFieldIndex(nextIndex)
      speakText(question)
    }
  }

  // Generate PDF
  const generatePDF = () => {
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF()

      doc.setFontSize(20)
      doc.text('INCOME CERTIFICATE AFFIDAVIT', 105, 20, { align: 'center' })

      doc.setFontSize(12)
      let yPos = 40

      const name = formData.name || 'N/A'
      const fatherName = formData.fatherName || 'N/A'
      const address = formData.address || 'N/A'

      doc.text(`I, ${name}, son/daughter of ${fatherName},`, 20, yPos)
      yPos += 10
      doc.text(`hereby solemnly affirm and declare as under:`, 20, yPos)
      yPos += 15
      doc.text(`1. That I am a resident of ${address}.`, 20, yPos)
      yPos += 10
      doc.text(`2. That the information provided by me is true and correct.`, 20, yPos)
      yPos += 15

      incomeFields.forEach((field, index) => {
        if (formData[field.key]) {
          doc.text(`${index + 3}. ${field.en}: ${formData[field.key]}`, 20, yPos)
          yPos += 10
        }
      })

      yPos += 10
      doc.text(`I hereby declare that the above statements are true and correct.`, 20, yPos)
      yPos += 20
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos)
      yPos += 10
      doc.text(`Signature: _________________`, 20, yPos)

      doc.save('Income_Certificate_Affidavit.pdf')

      setCurrentStep('greeting')
      setFormData({})
      setCurrentFieldIndex(0)

      const successMsg = language === 'hi'
        ? "आपका PDF बन गया है और डाउनलोड हो गया है! क्या आप कुछ और चाहते हैं?"
        : "Your PDF has been generated and downloaded! Is there anything else you need?"
      speakText(successMsg)
    })
  }

  // Add message to conversation
  const addToConversation = (role, text) => {
    setConversation(prev => [...prev, { role, text, timestamp: new Date() }])
  }

  if (!isActive) return null

  return (
    <motion.div
      className="voice-assistant"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="voice-assistant-header">
        <h3>Voice Assistant</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="voice-assistant-body">
        <div className="conversation-container">
          <AnimatePresence>
            {conversation.map((msg, index) => (
              <motion.div
                key={index}
                className={`message ${msg.role}`}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="message-content">{msg.text}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="voice-controls">
          <motion.button
            className={`voice-button ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}
            onClick={startListening}
            disabled={isSpeaking}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isListening ? (
              <>
                <span className="pulse-ring"></span>
                <span>{language === 'hi' ? 'सुन रही हूं...' : 'Listening...'}</span>
              </>
            ) : isSpeaking ? (
              language === 'hi' ? 'बोल रही हूं...' : 'Speaking...'
            ) : (
              language === 'hi' ? '🎤 बोलने के लिए टैप करें' : '🎤 Tap to Speak'
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default VoiceAssistant
