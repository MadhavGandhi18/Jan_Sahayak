# Jan Sahayak - AI Document Assistant

A modern web application for generating government affidavits and filling custom forms using AI technology.
<img width="1365" height="621" alt="Screenshot 2026-01-17 072208" src="https://github.com/user-attachments/assets/270a562e-b560-4e32-a824-9c1266c77a42" />


## Features

- **Government Affidavits**: Generate various government affidavits with AI assistance
- **Custom Forms**: Fill custom forms using Aadhar card data extraction
- **PDF Generation**: Download professionally formatted PDF documents
- **Modern UI**: Beautiful 3D animations and illustrations
- **Responsive Design**: Works seamlessly on all devices

## Tech Stack

- React 18
- React Router DOM
- Framer Motion (Animations)
- Three.js & React Three Fiber (3D Graphics)
- jsPDF (PDF Generation)
- Axios (API Calls)
- React Dropzone (File Uploads)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Configuration

### OnDemand Media API

To use the Aadhar card extraction feature, you need to configure the OnDemand Media API:

1. Get your API key from [OnDemand](https://www.ondemand.com/)
2. Update the API key in `src/pages/CustomForms.jsx`:
   ```javascript
   'Authorization': 'Bearer YOUR_API_KEY'
   ```

### LLM Integration

For the affidavit generation, you'll need to integrate with your LLM service. Update the API endpoints in `src/pages/GovtAffidavits.jsx` to connect to your LLM backend.

## Project Structure

```
jan-sahayak/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ThreeScene.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── GovtAffidavits.jsx
│   │   ├── CustomForms.jsx
│   │   └── AboutUs.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Usage

### Government Affidavits

1. Navigate to "Govt Affidavits" from the navigation bar
2. Select the type of affidavit you need
3. Fill in the required details as prompted by the AI
4. Generate and download your PDF

### Custom Forms

1. Navigate to "Custom Forms" from the navigation bar
2. Upload your Aadhar card (image or PDF)
3. The system will extract information automatically
4. Verify and fill any additional details
5. Generate and download your filled form PDF

## Team

- Team Member 1 - Lead Developer
- Team Member 2 - AI Specialist
- Team Member 3 - UI/UX Designer
- Team Member 4 - Backend Developer

## License

MIT License
=======
# 🇮🇳 Jan-Sahayak: AI for the Next Billion

> **The "TurboTax" for Rural India.** A voice-first WhatsApp agent that helps illiterate users generate official government affidavits for ₹0.

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95+-green.svg)
![Ollama](https://img.shields.io/badge/AI-Ollama%20(Local)-orange.svg)
![Twilio](https://img.shields.io/badge/WhatsApp-Twilio-red.svg)

## 🚨 The Problem
In rural India, getting a simple **Income Certificate** or **Gap Year Affidavit** is a nightmare:
1.  **High Cost:** Agents charge ₹200-₹500 to type a simple form.
2.  **Barrier:** Illiteracy prevents users from filling forms themselves.
3.  **Access:** Government offices are far, costing daily wages in travel.

## 💡 The Solution: Jan-Sahayak
Jan-Sahayak is a **WhatsApp Bot** that acts as a free digital agent.
* **Voice First:** Users just say *"Mera naam Ramu hai, income certificate chahiye"* (My name is Ramu, I need an income certificate).
* **Agentic AI:** The bot extracts details, asks for missing info, and **generates the actual PDF affidavit** instantly.
* **Offline/Private:** Uses **Local LLMs (Ollama)** running on the edge, ensuring user data privacy and zero API costs.

**Impact:** Reduces documentation cost from **₹500 → ₹5** (Print cost only).

---

## 🛠️ Tech Stack

* **Interface:** WhatsApp (via Twilio Sandbox)
* **Backend:** Python (FastAPI)
* **Brain (LLM):** Ollama (Llama 3.2) - *Local & Offline capable*
* **Ears (ASR):** OpenAI Whisper (Speech-to-Text)
* **Hands (Action):** ReportLab (Dynamic PDF Generation)
* **Tunneling:** Ngrok (Exposing localhost to WhatsApp)

---

## ⚡ Features (Hackathon Track: AI for Next Billion)

### 1. Multi-Lingual / Hinglish Support
Handles code-mixed languages typical of rural India (e.g., *"Meri age 25 hai"*).

### 2. Supported Documents (Agentic Workflows)
The bot currently generates valid legal drafts for:
* ✅ **Income Certificate Affidavit**
* ✅ **Caste Certificate Declaration**
* ✅ **Domicile / Residence Proof**
* ✅ **Gap Year Affidavit** (for students)
* ✅ **Character Certificate**
* ✅ **MNREGA Job Application** (100 days work)

### 3. Graceful Failure & Privacy
* Runs locally via Ollama (No data leaves the server).
* Robust error handling: If the AI misunderstands, it politely asks again.

<img width="3861" height="2860" alt="image" src="https://github.com/user-attachments/assets/928ea208-54c0-4136-810f-68cb4e4db22c" />

---

## 🚀 Installation & Setup

### Prerequisites
* Python 3.10+
* [Ollama](https://ollama.com/) (installed and running)
* [Ngrok](https://ngrok.com/) (for tunneling)
* Twilio Account (for WhatsApp Sandbox)

### Step 1: Clone & Install Dependencies
```bash
git clone [https://github.com/yourusername/jan-sahayak.git](https://github.com/yourusername/jan-sahayak.git)
cd jan-sahayak
pip install fastapi uvicorn twilio python-multipart reportlab python-dotenv openai-whisper ollama aiohttp
>>>>>>> 1127366cff2ea768da891972fb1e1dd355fd3183
