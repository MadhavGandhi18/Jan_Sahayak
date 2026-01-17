import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'
import VoiceAssistant from '../components/VoiceAssistant'
import './GovtAffidavits.css'

const GovtAffidavits = () => {
  const [selectedAffidavit, setSelectedAffidavit] = useState(null)
  const [formData, setFormData] = useState({})
  const [currentStep, setCurrentStep] = useState('select') // select, fill, generate
  const [requiredFields, setRequiredFields] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isVoiceAssistantActive, setIsVoiceAssistantActive] = useState(false)

  const affidavitTypes = [
    {
      id: 'income',
      name: 'Income Certificate Affidavit',
      description: 'For income verification purposes'
    },
    {
      id: 'residence',
      name: 'Residence Certificate Affidavit',
      description: 'Proof of residence documentation'
    },
    {
      id: 'caste',
      name: 'Caste Certificate Affidavit',
      description: 'Caste verification affidavit'
    },
    {
      id: 'domicile',
      name: 'Domicile Certificate Affidavit',
      description: 'Domicile status verification'
    },
    {
      id: 'marriage',
      name: 'Marriage Certificate Affidavit',
      description: 'Marriage verification document'
    },
    {
      id: 'death',
      name: 'Death Certificate Affidavit',
      description: 'Death certificate verification'
    }
  ]

  // Simulate LLM response for required fields
  const getRequiredFields = (affidavitType) => {
    const fieldMap = {
      income: ['Full Name', 'Father\'s Name', 'Date of Birth', 'Address', 'Annual Income', 'Occupation', 'PAN Number'],
      residence: ['Full Name', 'Father\'s Name', 'Date of Birth', 'Current Address', 'Permanent Address', 'Duration of Residence'],
      caste: ['Full Name', 'Father\'s Name', 'Date of Birth', 'Caste Category', 'Sub-caste', 'Address'],
      domicile: ['Full Name', 'Father\'s Name', 'Date of Birth', 'Place of Birth', 'Current Address', 'Duration of Stay'],
      marriage: ['Husband Name', 'Wife Name', 'Date of Marriage', 'Place of Marriage', 'Witness 1 Name', 'Witness 2 Name'],
      death: ['Deceased Name', 'Date of Death', 'Place of Death', 'Cause of Death', 'Informant Name', 'Relation to Deceased']
    }
    return fieldMap[affidavitType] || []
  }

  // Listen for voice assistant affidavit selection
  useEffect(() => {
    const handleAffidavitSelect = (event) => {
      const { id, name, fields } = event.detail
      const affidavit = affidavitTypes.find(a => a.id === id)
      if (affidavit) {
        setSelectedAffidavit(affidavit)
        setRequiredFields(fields)
        setFormData({})
        setCurrentStep('fill')
      }
    }

    window.addEventListener('selectAffidavit', handleAffidavitSelect)
    return () => window.removeEventListener('selectAffidavit', handleAffidavitSelect)
  }, [])

  const handleAffidavitSelect = (affidavit) => {
    setSelectedAffidavit(affidavit)
    const fields = getRequiredFields(affidavit.id)
    setRequiredFields(fields)
    setFormData({})
    setCurrentStep('fill')
  }

  const handleInputChange = (field, value) => {
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
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    
    // Simulate API call to LLM
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate PDF
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(20)
    doc.text('AFFIDAVIT', 105, 20, { align: 'center' })
    
    // Add content
    doc.setFontSize(12)
    let yPos = 40
    
    // Extract values to avoid template literal syntax issues
    const name = formData[requiredFields[0]] || 'N/A'
    const fatherName = formData[requiredFields[1]] || 'N/A'
    const address = formData['Address'] || formData['Current Address'] || 'N/A'
    
    doc.text(`I, ${name}, son/daughter of ${fatherName},`, 20, yPos)
    yPos += 10
    
    doc.text(`hereby solemnly affirm and declare as under:`, 20, yPos)
    yPos += 15
    
    doc.text(`1. That I am a resident of ${address}.`, 20, yPos)
    yPos += 10
    
    doc.text(`2. That the information provided by me is true and correct to the best of my knowledge.`, 20, yPos)
    yPos += 10
    
    // Add form data
    requiredFields.forEach((field, index) => {
      if (formData[field]) {
        doc.text(`${index + 3}. ${field}: ${formData[field]}`, 20, yPos)
        yPos += 10
      }
    })
    
    yPos += 10
    doc.text(`I hereby declare that the above statements are true and correct.`, 20, yPos)
    yPos += 20
    
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos)
    yPos += 10
    doc.text(`Signature: _________________`, 20, yPos)
    
    // Save PDF
    doc.save(`${selectedAffidavit.name.replace(/\s+/g, '_')}.pdf`)
    
    setIsGenerating(false)
    setCurrentStep('select')
    setFormData({})
    setSelectedAffidavit(null)
  }

  const allFieldsFilled = requiredFields.every(field => formData[field] && formData[field].trim() !== '')

  return (
    <div className="govt-affidavits-page">
      <div className="page-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Government Affidavits
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Select an affidavit type and let our AI guide you through the process
        </motion.p>
      </div>

      {currentStep === 'select' && (
        <div className="affidavit-selection">
          <div className="affidavit-grid">
            {affidavitTypes.map((affidavit, index) => (
              <motion.div
                key={affidavit.id}
                className="affidavit-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => handleAffidavitSelect(affidavit)}
              >
                <div className="affidavit-icon">📄</div>
                <h3>{affidavit.name}</h3>
                <p>{affidavit.description}</p>
                <button className="select-btn">Select</button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {currentStep === 'fill' && selectedAffidavit && (
        <motion.div
          className="form-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-header">
            <button 
              className="back-btn"
              onClick={() => {
                setCurrentStep('select')
                setSelectedAffidavit(null)
                setFormData({})
              }}
            >
              ← Back
            </button>
            <h2>{selectedAffidavit.name}</h2>
            <p className="form-instruction">
              Please fill in all the required details. Our AI will generate your affidavit based on this information.
            </p>
          </div>

          <div className="form-container">
            {requiredFields.map((field, index) => (
              <motion.div
                key={field}
                className="form-field"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <label>{field} *</label>
                <input
                  type="text"
                  value={formData[field] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  placeholder={`Enter ${field.toLowerCase()}`}
                  required
                />
              </motion.div>
            ))}

            <motion.button
              className="generate-btn"
              onClick={handleGeneratePDF}
              disabled={!allFieldsFilled || isGenerating}
              whileHover={allFieldsFilled ? { scale: 1.05 } : {}}
              whileTap={allFieldsFilled ? { scale: 0.95 } : {}}
            >
              {isGenerating ? 'Generating PDF...' : 'Generate PDF'}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Voice Assistant */}
      {currentStep === 'fill' && (
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

export default GovtAffidavits
