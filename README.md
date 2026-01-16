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
