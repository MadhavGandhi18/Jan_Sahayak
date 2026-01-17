// OnDemand API Usage Examples
// This file demonstrates how to use the OnDemandClient in your project

import OnDemandClient from '../services/OnDemandClient'

// ============================================
// 1. BASIC SETUP
// ============================================

// Get API key from environment
const apiKey = import.meta.env.VITE_ONDEMAND_API_KEY

// Initialize the client
const chatClient = new OnDemandClient(apiKey)

// ============================================
// 2. CREATE A SESSION
// ============================================

async function createNewSession() {
  try {
    // Generate unique user ID
    const userId = "user-" + Date.now()
    
    // Create session
    const response = await chatClient.createSession(userId)
    
    // Extract session ID
    const sessionId = response.data.id
    
    console.log('Session created:', sessionId)
    return sessionId
  } catch (error) {
    console.error('Failed to create session:', error)
  }
}

// ============================================
// 3. SEND A MESSAGE
// ============================================

async function sendMessage(sessionId, userMessage) {
  try {
    const response = await chatClient.submitQuery(
      sessionId,
      userMessage,
      'predefined-openai-gpt4o', // Model endpoint
      'sync'                       // Response mode
    )
    
    const answer = response.data.answer
    console.log('Bot response:', answer)
    return answer
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}

// ============================================
// 4. GET MESSAGE HISTORY
// ============================================

async function getHistory(sessionId) {
  try {
    const response = await chatClient.getAllMessages(
      sessionId,
      10  // Limit to 10 messages
    )
    
    const messages = response.data
    console.log('Message history:', messages)
    return messages
  } catch (error) {
    console.error('Failed to get history:', error)
  }
}

// ============================================
// 5. GET SPECIFIC MESSAGE
// ============================================

async function getSpecificMessage(sessionId, messageId) {
  try {
    const response = await chatClient.getMessage(sessionId, messageId)
    console.log('Message:', response.data)
    return response.data
  } catch (error) {
    console.error('Failed to get message:', error)
  }
}

// ============================================
// 6. GET SESSION DETAILS
// ============================================

async function getSessionDetails(sessionId) {
  try {
    const response = await chatClient.getSession(sessionId)
    console.log('Session details:', response.data)
    return response.data
  } catch (error) {
    console.error('Failed to get session:', error)
  }
}

// ============================================
// 7. GET ALL SESSIONS
// ============================================

async function getAllSessions() {
  try {
    const response = await chatClient.getAllSessions(
      10,   // Limit
      'asc' // Sort order
    )
    console.log('All sessions:', response.data)
    return response.data
  } catch (error) {
    console.error('Failed to get sessions:', error)
  }
}

// ============================================
// 8. COMPLETE WORKFLOW EXAMPLE
// ============================================

async function completeWorkflow() {
  try {
    console.log('=== Starting Chatbot Workflow ===')
    
    // Step 1: Create session
    console.log('\n1. Creating new session...')
    const sessionId = await createNewSession()
    
    // Step 2: Send first message
    console.log('\n2. Sending first message...')
    const answer1 = await sendMessage(
      sessionId,
      'What is the capital of France?'
    )
    
    // Step 3: Send second message
    console.log('\n3. Sending second message...')
    const answer2 = await sendMessage(
      sessionId,
      'Tell me more about Paris'
    )
    
    // Step 4: Get message history
    console.log('\n4. Retrieving message history...')
    const history = await getHistory(sessionId)
    
    // Step 5: Get session details
    console.log('\n5. Retrieving session details...')
    const sessionDetails = await getSessionDetails(sessionId)
    
    console.log('\n=== Workflow Complete ===')
    
  } catch (error) {
    console.error('Workflow failed:', error)
  }
}

// ============================================
// 9. ERROR HANDLING EXAMPLE
// ============================================

async function sendMessageWithErrorHandling(sessionId, message) {
  try {
    if (!sessionId) {
      throw new Error('Session ID is required')
    }
    
    if (!message || message.trim() === '') {
      throw new Error('Message cannot be empty')
    }
    
    const response = await chatClient.submitQuery(
      sessionId,
      message,
      'predefined-openai-gpt4o',
      'sync'
    )
    
    if (!response.data || !response.data.answer) {
      throw new Error('Invalid response format')
    }
    
    return response.data.answer
    
  } catch (error) {
    if (error.response) {
      // Server error
      console.error('Server error:', error.response.status, error.response.data)
      return `Error: ${error.response.status}`
    } else if (error.request) {
      // Request made but no response
      console.error('Network error:', error.request)
      return 'Network error - please check your connection'
    } else {
      // Validation or other error
      console.error('Error:', error.message)
      return `Error: ${error.message}`
    }
  }
}

// ============================================
// 10. REACT COMPONENT EXAMPLE
// ============================================

/*
import { useState, useEffect } from 'react'
import OnDemandClient from '../services/OnDemandClient'

export function ChatExample() {
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      const apiKey = import.meta.env.VITE_ONDEMAND_API_KEY
      const client = new OnDemandClient(apiKey)
      
      const userId = "user-" + Date.now()
      const sessionResp = await client.createSession(userId)
      setSessionId(sessionResp.data.id)
    }
    
    initSession()
  }, [])

  // Send message handler
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || !sessionId) return

    setLoading(true)
    const apiKey = import.meta.env.VITE_ONDEMAND_API_KEY
    const client = new OnDemandClient(apiKey)

    try {
      const response = await client.submitQuery(
        sessionId,
        input,
        'predefined-openai-gpt4o',
        'sync'
      )

      setMessages(prev => [
        ...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: response.data.answer }
      ])
      
      setInput('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div>
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.role}:</strong> {msg.content}
          </p>
        ))}
      </div>
      
      <form onSubmit={handleSendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          disabled={loading || !sessionId}
        />
        <button type="submit" disabled={loading || !sessionId}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
*/

// ============================================
// EXPORT FOR USE IN OTHER FILES
// ============================================

export {
  createNewSession,
  sendMessage,
  getHistory,
  getSpecificMessage,
  getSessionDetails,
  getAllSessions,
  completeWorkflow,
  sendMessageWithErrorHandling
}

// ============================================
// USAGE IN YOUR PROJECT
// ============================================

/*
// In your component:
import { sendMessage } from '../examples/api-examples'

// Call the function:
const response = await sendMessage(sessionId, userMessage)
*/

// ============================================
// API RESPONSE EXAMPLES
// ============================================

/*
// createSession Response:
{
  "data": {
    "id": "session_123abc",
    "externalUserId": "user-1234567890",
    "pluginIds": [],
    "createdAt": "2024-01-17T10:30:00Z"
  }
}

// submitQuery Response:
{
  "data": {
    "id": "msg_456def",
    "sessionId": "session_123abc",
    "query": "What is the capital of France?",
    "answer": "The capital of France is Paris.",
    "model": "openai-gpt4o",
    "createdAt": "2024-01-17T10:31:00Z"
  }
}

// getAllMessages Response:
{
  "data": [
    {
      "id": "msg_456def",
      "content": "The capital of France is Paris.",
      "role": "assistant"
    },
    {
      "id": "msg_789ghi",
      "content": "What is the capital of France?",
      "role": "user"
    }
  ]
}
*/
