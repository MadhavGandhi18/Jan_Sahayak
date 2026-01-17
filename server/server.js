import express from 'express'
import cors from 'cors'
import multer from 'multer'
import axios from 'axios'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only PNG, JPG, and PDF are allowed.'), false)
    }
  }
})

// Parse Aadhar card data from extracted text
const parseAadharData = (text) => {
  const data = {
    name: '',
    fatherName: '',
    dateOfBirth: '',
    aadharNumber: '',
    address: '',
    gender: ''
  }

  if (!text) return data

  // Clean the text
  const cleanText = text.replace(/\s+/g, ' ').trim()

  // Extract Aadhar Number (12 digits, may have spaces)
  const aadharMatch = cleanText.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/)
  if (aadharMatch) {
    data.aadharNumber = aadharMatch[0].replace(/\s/g, ' ')
  }

  // Extract Date of Birth (DD/MM/YYYY or DD-MM-YYYY format)
  const dobMatch = cleanText.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/)
  if (dobMatch) {
    data.dateOfBirth = dobMatch[1]
  }

  // Extract Gender (Male/Female/M/F)
  const genderMatch = cleanText.match(/\b(Male|Female|MALE|FEMALE|M|F)\b/)
  if (genderMatch) {
    data.gender = genderMatch[1]
  }

  // Try to extract name (usually appears before "S/O", "D/O", "W/O", "C/O")
  const namePatterns = [
    /(?:Name|NAME|नाम)[\s:]*([A-Z][A-Z\s]{10,40}?)(?:\s+(?:S\/O|D\/O|W\/O|C\/O|Son|Daughter))/i,
    /^([A-Z][A-Z\s]{10,40}?)(?:\s+(?:S\/O|D\/O|W\/O|C\/O))/i,
    /(?:Government of India|भारत सरकार)[\s\S]{0,200}?([A-Z][A-Z\s]{10,40}?)(?:\s+(?:S\/O|D\/O))/i
  ]

  for (const pattern of namePatterns) {
    const match = cleanText.match(pattern)
    if (match && match[1]) {
      data.name = match[1].trim()
      break
    }
  }

  // Extract Father's/Husband's Name (after S/O, D/O, W/O, C/O)
  const fatherPatterns = [
    /(?:S\/O|D\/O|W\/O|C\/O|Son of|Daughter of)[\s:]*([A-Z][A-Z\s]{10,40}?)(?:\s|$|,|Date|DOB)/i,
    /(?:Father|FATHER|पिता)[\s:]*([A-Z][A-Z\s]{10,40}?)(?:\s|$|,)/i
  ]

  for (const pattern of fatherPatterns) {
    const match = cleanText.match(pattern)
    if (match && match[1]) {
      data.fatherName = match[1].trim()
      break
    }
  }

  // Extract Address (usually after "Address" or at the end, before PIN)
  const addressPatterns = [
    /(?:Address|ADDRESS|पता)[\s:]*([A-Z0-9\s,]{20,200}?)(?:\d{6}|PIN|Pin)/i,
    /(?:Address|ADDRESS)[\s:]*([A-Z0-9\s,]{20,200}?)(?:\n|$)/i
  ]

  for (const pattern of addressPatterns) {
    const match = cleanText.match(pattern)
    if (match && match[1]) {
      data.address = match[1].trim()
      break
    }
  }

  // If name not found, try to get first line that looks like a name
  if (!data.name) {
    const lines = cleanText.split('\n').filter(line => line.trim().length > 5)
    for (const line of lines.slice(0, 5)) {
      if (/^[A-Z][A-Z\s]{5,40}$/.test(line.trim()) && !line.includes('GOVERNMENT') && !line.includes('INDIA')) {
        data.name = line.trim()
        break
      }
    }
  }

  return data
}

// Fetch extracted text from URL
const fetchExtractedText = async (url) => {
  try {
    const response = await axios.get(url)
    return typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
  } catch (error) {
    console.error('Error fetching extracted text:', error.message)
    return null
  }
}

// Generate MongoDB ObjectId format session ID
const generateSessionId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0')
  const random1 = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0')
  const random2 = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')
  return (timestamp + random1 + random2).substring(0, 24)
}

// Create a session through OnDemand API
const createSession = async (apiKey) => {
  try {
    console.log('🔄 Creating session...')
    const sessionResponse = await axios.post(
      'https://api.on-demand.io/media/v1/public/session',
      {
        createdBy: 'Jan Sahayak',
        updatedBy: 'Jan Sahayak'
      },
      {
        headers: {
          'apikey': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    if (sessionResponse.data && sessionResponse.data.data && sessionResponse.data.data._id) {
      const sessionId = sessionResponse.data.data._id
      console.log('✅ Session created:', sessionId)
      return sessionId
    }
    return null
  } catch (error) {
    console.error('❌ Failed to create session:', error.response?.data || error.message)
    // If session creation fails, try generating one
    return generateSessionId()
  }
}

// API endpoint to extract Aadhar data
app.post('/api/extract-aadhar', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const ONDEMAND_API_KEY = process.env.ONDEMAND_API_KEY || 'cJP3spu2jknHr9XWzGEatDgKH3F4u2pL'

    console.log('📤 Starting extraction process...')
    console.log('File info:', {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    })

    // Step 1: Create or get a session ID
    console.log('🔑 Step 1: Getting session ID...')
    let sessionId = await createSession(ONDEMAND_API_KEY)

    if (!sessionId) {
      // Fallback: generate a session ID
      sessionId = generateSessionId()
      console.log('🔑 Using generated session ID:', sessionId)
    }

    // Step 2: Upload file with session ID
    const ONDEMAND_API_URL = 'https://api.on-demand.io/media/v1/public/file/raw'
    const FormData = (await import('form-data')).default
    const formData = new FormData()

    // Append file
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    })

    // Required fields
    formData.append('createdBy', 'Jan Sahayak')
    formData.append('updatedBy', 'Jan Sahayak')
    formData.append('name', req.file.originalname || 'Aadhar_Card')
    formData.append('sessionId', sessionId)
    formData.append('sizeBytes', req.file.size.toString())
    formData.append('responseMode', 'sync')

    console.log('📡 Step 2: Uploading file with session ID:', sessionId)
    console.log('📋 Request details:', {
      url: ONDEMAND_API_URL,
      filename: req.file.originalname,
      size: req.file.size,
      sessionId: sessionId
    })

    let response
    try {
      response = await axios.post(ONDEMAND_API_URL, formData, {
        headers: {
          'apikey': ONDEMAND_API_KEY,
          ...formData.getHeaders()
        },
        timeout: 120000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      })

      console.log('✅ Success! Response status:', response.status)
      console.log('📦 Response data keys:', Object.keys(response.data || {}))
    } catch (error) {
      console.error('❌ Upload failed:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data
      })

      // If session error, try creating a new session and retry once
      if (error.response?.status === 500 &&
        (error.response?.data?.message?.toLowerCase().includes('session') ||
          error.response?.data?.error?.toLowerCase().includes('session'))) {
        console.log('🔄 Session error detected. Creating new session and retrying...')

        sessionId = await createSession(ONDEMAND_API_KEY)
        if (!sessionId) {
          sessionId = generateSessionId()
        }

        // Retry with new session
        const retryFormData = new FormData()
        retryFormData.append('file', req.file.buffer, {
          filename: req.file.originalname,
          contentType: req.file.mimetype
        })
        retryFormData.append('createdBy', 'Jan Sahayak')
        retryFormData.append('updatedBy', 'Jan Sahayak')
        retryFormData.append('name', req.file.originalname || 'Aadhar_Card')
        retryFormData.append('sessionId', sessionId)
        retryFormData.append('sizeBytes', req.file.size.toString())
        retryFormData.append('responseMode', 'sync')

        try {
          response = await axios.post(ONDEMAND_API_URL, retryFormData, {
            headers: {
              'apikey': ONDEMAND_API_KEY,
              ...retryFormData.getHeaders()
            },
            timeout: 120000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
          })
          console.log('✅ Retry successful!')
        } catch (retryError) {
          console.error('❌ Retry also failed:', retryError.response?.data || retryError.message)
          throw retryError
        }
      } else {
        throw error
      }
    }

    if (!response || !response.data) {
      throw new Error('No response from OnDemand API')
    }

    // Handle different response formats
    let mediaData = null
    let extractedText = ''

    // Check response structure
    if (response.data.data) {
      mediaData = response.data.data
    } else if (response.data) {
      mediaData = response.data
    }

    console.log('📊 Response structure:', {
      hasData: !!response.data.data,
      hasDirectData: !!response.data,
      actionStatus: mediaData?.actionStatus,
      hasExtractedTextUrl: !!mediaData?.extractedTextUrl,
      hasExtractedText: !!mediaData?.extractedText
    })

    // If actionStatus exists, check it
    if (mediaData?.actionStatus) {
      if (mediaData.actionStatus === 'processing') {
        return res.json({
          success: false,
          message: 'Document is still being processed. Please try again in a few moments.',
          extractedData: {}
        })
      } else if (mediaData.actionStatus === 'failed') {
        return res.status(500).json({
          success: false,
          error: mediaData.failedReason || 'Extraction failed',
          extractedData: {}
        })
      }
    }

    // Try to get extracted text
    if (mediaData?.extractedTextUrl) {
      console.log('🔗 Fetching extracted text from URL:', mediaData.extractedTextUrl)
      extractedText = await fetchExtractedText(mediaData.extractedTextUrl) || ''
    }

    // Fallback to extractedText field
    if (!extractedText && mediaData?.extractedText) {
      extractedText = typeof mediaData.extractedText === 'string'
        ? mediaData.extractedText
        : JSON.stringify(mediaData.extractedText)
    }

    // Try to get text from response directly
    if (!extractedText && response.data.text) {
      extractedText = response.data.text
    }

    // If still no text, try to extract from any text fields
    if (!extractedText) {
      const textFields = ['text', 'content', 'ocrText', 'extractedContent']
      for (const field of textFields) {
        if (mediaData?.[field]) {
          extractedText = typeof mediaData[field] === 'string'
            ? mediaData[field]
            : JSON.stringify(mediaData[field])
          break
        }
      }
    }

    console.log('📝 Extracted text length:', extractedText?.length || 0)
    if (extractedText) {
      console.log('📄 First 200 chars:', extractedText.substring(0, 200))
    }

    // Parse the extracted text to find Aadhar information
    const parsedData = parseAadharData(extractedText || '')

    console.log('✅ Parsed data:', parsedData)

    // Check if we extracted any meaningful data
    const hasData = Object.values(parsedData).some(value => value && value.trim() !== '')

    // Always return the parsed data, even if empty
    return res.json({
      success: hasData,
      extractedData: parsedData,
      rawText: extractedText || '',
      message: hasData
        ? 'Data extracted successfully!'
        : 'Could not automatically extract information. Please enter details manually.'
    })
  } catch (error) {
    console.error('Extraction error:', error)

    let errorMessage = 'An error occurred during data extraction.'

    if (error.response) {
      const status = error.response.status
      const errorData = error.response.data

      errorMessage = `API Error (${status}): ${errorData?.message || error.response.statusText}`

      return res.status(status).json({
        success: false,
        error: errorMessage,
        extractedData: {},
        details: errorData
      })
    } else if (error.request) {
      errorMessage = 'Network error: Could not connect to OnDemand API.'
      return res.status(503).json({
        success: false,
        error: errorMessage,
        extractedData: {}
      })
    } else {
      errorMessage = error.message || 'Unknown error occurred'
      return res.status(500).json({
        success: false,
        error: errorMessage,
        extractedData: {}
      })
    }
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Jan Sahayak Server is running' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Jan Sahayak Server running on http://localhost:${PORT}`)
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/extract-aadhar`)
})
