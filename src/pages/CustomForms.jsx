import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import axios from 'axios'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import VoiceAssistant from '../components/VoiceAssistant'
import './CustomForms.css'

const CustomForms = () => {
  const [step, setStep] = useState('upload') // upload, form, download
  const [aadharFile, setAadharFile] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const [formTemplate, setFormTemplate] = useState('')
  const [formData, setFormData] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionStatus, setExtractionStatus] = useState('')
  const [extractionError, setExtractionError] = useState(null)
  const [isVoiceAssistantActive, setIsVoiceAssistantActive] = useState(false)

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setAadharFile(acceptedFiles[0])
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  })

  // Parse extracted text to find Aadhar card information
  // Improved Parser for Aadhar card information
  const parseAadharData = (text) => {
    const data = {
      name: '',
      fatherName: '',
      dateOfBirth: '',
      aadharNumber: '',
      address: '',
      gender: ''
    }

    if (!text) return data;

    // 1. Extract Aadhar Number (12 digits, handling spaces/hyphens)
    const aadharMatch = text.match(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/);
    if (aadharMatch) {
      data.aadharNumber = aadharMatch[0].replace(/[\s-]/g, ' ');
    }

    // 2. Extract Date of Birth (handles common OCR misreads of '/' as '|' or 'l')
    const dobMatch = text.match(/(\d{2}[\/\-l|]\d{2}[\/\-l|]\d{4})/);
    if (dobMatch) {
      data.dateOfBirth = dobMatch[0].replace(/[l|]/g, '/');
    }

    // 3. Extract Gender (Case-insensitive check)
    if (/Male|MALE|M\b/i.test(text)) data.gender = 'Male';
    else if (/Female|FEMALE|F\b/i.test(text)) data.gender = 'Female';

    // 4. Extract Name & Father's Name
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3);
    for (let i = 0; i < Math.min(lines.length, 12); i++) {
      const line = lines[i];
      // Search for names: usually ALL CAPS and not "Government" or "India"
      if (/^[A-Z\s]{5,35}$/.test(line) && !/GOVERNMENT|INDIA|INCOME|UNIQUE/i.test(line)) {
        if (!data.name) {
          data.name = line;
          // Usually Father's name is on the next few lines after an S/O or D/O tag
          const nextLines = lines.slice(i + 1, i + 5).join(' ');
          const fatherMatch = nextLines.match(/(?:S\/O|D\/O|W\/O|C\/O|Son of|Daughter of)[\s:]*([A-Z\s]{3,30})/i);
          if (fatherMatch) data.fatherName = fatherMatch[1].trim();
        }
      }
    }

    // 5. Extract Address (Grabs text between "Address" and the 6-digit PIN code)
    const addressMatch = text.match(/(?:Address|पता|ADDRESS)[:\s]+([\s\S]{15,250}?\d{6})/i);
    if (addressMatch) {
      data.address = addressMatch[1].replace(/\n/g, ' ').trim();
    }

    return data;
  }

  // Note: Text fetching is now handled by the backend server
  // Keeping this for reference but it's not used anymore
  const fetchExtractedText = async (url) => {
    try {
      const response = await axios.get(url)
      return response.data
    } catch (error) {
      console.error('Error fetching extracted text:', error)
      return null
    }
  }

  const extractAadharData = async () => {
    if (!aadharFile) return

    setIsExtracting(true)
    setExtractionError(null)
    setExtractionStatus('Uploading file to server...')

    try {
      // Use our backend server instead of calling OnDemand API directly
      // Try using proxy first, then fallback to direct URL
      const API_URL = import.meta.env.VITE_API_URL || '/api/extract-aadhar'

      // Create FormData for file upload to our backend
      const formData = new FormData()
      formData.append('file', aadharFile)

      setExtractionStatus('Extracting text from document...')

      // Upload file to our backend server
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 120000 // 120 second timeout
      })

      console.log('Server Response:', response.data)

      // Handle new response format
      const extractedData = response.data.extractedData || response.data.data || {}
      const success = response.data.success !== false // Default to true if not specified

      // Check if we extracted any meaningful data
      const hasData = Object.values(extractedData).some(value => value && value.trim() !== '')

      if (hasData) {
        setExtractedData(extractedData)
        setFormData(extractedData)
        setExtractionStatus('Extraction completed successfully!')
        setStep('form')
      } else {
        // If no data was extracted, still allow manual entry
        setExtractionError(response.data.message || 'Could not automatically extract information. Please enter details manually.')
        const emptyData = {
          name: '',
          fatherName: '',
          dateOfBirth: '',
          aadharNumber: '',
          address: '',
          gender: ''
        }
        setExtractedData(null)
        setFormData(emptyData)
        setStep('form')
      }
    } catch (error) {
      console.error('Extraction error:', error)

      let errorMessage = 'An error occurred during data extraction.'

      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data
        const status = error.response.status

        errorMessage = errorData?.error || errorData?.message || `Server Error (${status})`

        if (status === 503) {
          errorMessage += '\n\n⚠️ Server is unavailable. Please make sure the backend server is running on port 5000.'
        } else if (status === 400) {
          errorMessage += '\n\n⚠️ Invalid file. Please check:\n1. File format is supported (PNG, JPG, PDF)\n2. File is not corrupted\n3. File size is under 10MB'
        } else {
          errorMessage += '\n\n⚠️ Please check:\n1. Backend server is running\n2. File format is correct\n3. Try again in a moment'
        }

        console.error('Server Error Response:', errorData)
      } else if (error.request) {
        // Request was made but no response
        errorMessage = 'Network error: Could not connect to server. Please make sure the backend server is running on http://localhost:5000'
      } else {
        // Something else happened
        errorMessage = `Error: ${error.message}`
      }

      setExtractionError(errorMessage)

      // Still allow manual entry
      const emptyData = {
        name: '',
        fatherName: '',
        dateOfBirth: '',
        aadharNumber: '',
        address: '',
        gender: ''
      }
      setExtractedData(null)
      setFormData(emptyData)
      setStep('form')
    } finally {
      setIsExtracting(false)
      setTimeout(() => {
        setExtractionStatus('')
      }, 3000)
    }
  }

  const handleFormInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle voice assistant form data updates
  const handleVoiceFormUpdate = (voiceFormData) => {
    setFormData(prev => ({
      ...prev,
      ...voiceFormData
    }))
    setExtractedData(voiceFormData)
  }

  const handleFormTemplateChange = (e) => {
    setFormTemplate(e.target.value)
  }

  const generatePDF = () => {
    setIsProcessing(true)

    // Create PDF
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text('Custom Form', 105, 20, { align: 'center' })

    // Add form data in a table
    const tableData = Object.entries(formData).map(([key, value]) => [
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      value || 'N/A'
    ])

    doc.autoTable({
      startY: 30,
      head: [['Field', 'Value']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { fontSize: 10 }
    })

    // Add custom form template if provided
    if (formTemplate) {
      const pageHeight = doc.internal.pageSize.height
      const finalY = doc.lastAutoTable.finalY + 20

      if (finalY > pageHeight - 40) {
        doc.addPage()
      }

      doc.setFontSize(14)
      doc.text('Additional Information:', 20, finalY)
      doc.setFontSize(10)
      const splitText = doc.splitTextToSize(formTemplate, 170)
      doc.text(splitText, 20, finalY + 10)
    }

    // Save PDF
    doc.save('custom_form.pdf')

    setIsProcessing(false)
    setStep('upload')
    setAadharFile(null)
    setExtractedData(null)
    setFormData({})
    setFormTemplate('')
  }

  return (
    <div className="custom-forms-page">
      <div className="page-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Custom Forms
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Upload your Aadhar card and fill custom forms automatically
        </motion.p>
      </div>

      <div className="forms-container">
        {step === 'upload' && (
          <motion.div
            className="upload-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="upload-card">
              <h2>Upload Aadhar Card</h2>
              <p>Upload your Aadhar card image or PDF to extract information automatically</p>

              <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'active' : ''}`}
              >
                <input {...getInputProps()} />
                {aadharFile ? (
                  <div className="file-preview">
                    <div className="file-icon">📄</div>
                    <p className="file-name">{aadharFile.name}</p>
                    <button
                      className="remove-file"
                      onClick={(e) => {
                        e.stopPropagation()
                        setAadharFile(null)
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="dropzone-content">
                    <div className="upload-icon">📤</div>
                    <p className="dropzone-text">
                      {isDragActive
                        ? 'Drop the file here...'
                        : 'Drag & drop your Aadhar card here, or click to select'}
                    </p>
                    <p className="dropzone-hint">Supports: PNG, JPG, PDF</p>
                  </div>
                )}
              </div>

              {aadharFile && (
                <div className="extract-section">
                  <motion.button
                    className="extract-btn"
                    onClick={extractAadharData}
                    disabled={isExtracting}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isExtracting ? 'Extracting Data...' : 'Extract Data from Aadhar'}
                  </motion.button>

                  {isExtracting && extractionStatus && (
                    <motion.p
                      className="extraction-status"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {extractionStatus}
                    </motion.p>
                  )}

                  {extractionError && (
                    <motion.p
                      className="error-message"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      ⚠ {extractionError}
                    </motion.p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 'form' && (
          <motion.div
            className="form-section"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="form-card">
              <div className="form-header">
                <button
                  className="back-btn"
                  onClick={() => {
                    setStep('upload')
                    setAadharFile(null)
                    setExtractedData(null)
                    setFormData({})
                  }}
                >
                  ← Back
                </button>
                <h2>Fill Custom Form</h2>
                {extractedData ? (
                  <p className="success-message">
                    ✓ Data extracted from Aadhar card. Please verify and fill additional details.
                  </p>
                ) : extractionError ? (
                  <p className="error-message">
                    ⚠ {extractionError}
                  </p>
                ) : (
                  <p className="info-message">
                    ℹ Please enter your details below.
                  </p>
                )}
              </div>

              <div className="form-container">
                <div className="form-fields">
                  <h3>Personal Information</h3>

                  {['name', 'fatherName', 'dateOfBirth', 'aadharNumber', 'address', 'gender'].map((field) => (
                    <div key={field} className="form-field">
                      <label>
                        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} *
                      </label>
                      <input
                        type="text"
                        value={formData[field] || ''}
                        onChange={(e) => handleFormInputChange(field, e.target.value)}
                        placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                        required
                      />
                    </div>
                  ))}

                  <div className="form-field">
                    <label>Custom Form Template (Optional)</label>
                    <textarea
                      value={formTemplate}
                      onChange={handleFormTemplateChange}
                      placeholder="Enter any additional form fields or information that needs to be included in the PDF..."
                      rows="6"
                      className="form-textarea"
                    />
                  </div>
                </div>

                <motion.button
                  className="generate-pdf-btn"
                  onClick={generatePDF}
                  disabled={isProcessing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isProcessing ? 'Generating PDF...' : 'Generate & Download PDF'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Voice Assistant */}
      {step === 'form' && (
        <motion.button
          className="voice-helper-btn"
          onClick={() => setIsVoiceAssistantActive(true)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>🎙️</span>
          <span>Voice Helper</span>
        </motion.button>
      )}

      <VoiceAssistant
        isActive={isVoiceAssistantActive}
        onClose={() => setIsVoiceAssistantActive(false)}
        onFormDataUpdate={handleVoiceFormUpdate}
      />
    </div>
  )
}

export default CustomForms
