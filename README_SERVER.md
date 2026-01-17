# Jan Sahayak Backend Server

Node.js backend server for handling Aadhar card data extraction using OnDemand Media API.

## Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` and add your OnDemand API key:
```
PORT=5000
ONDEMAND_API_KEY=your_ondemand_api_key_here
```

5. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### POST `/api/extract-aadhar`
Extract data from Aadhar card image/PDF.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `file` (image or PDF file)

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "fatherName": "Father Name",
    "dateOfBirth": "01/01/1990",
    "aadharNumber": "1234 5678 9012",
    "address": "123 Main Street",
    "gender": "Male"
  },
  "rawText": "extracted text from document..."
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Jan Sahayak Server is running"
}
```

## Frontend Configuration

Update your frontend `.env` file (or `vite.config.js`) to point to the backend:

```env
VITE_API_URL=http://localhost:5000/api/extract-aadhar
```

Or update `src/pages/CustomForms.jsx` line 147:
```javascript
const API_URL = 'http://localhost:5000/api/extract-aadhar'
```

## Features

- ✅ File upload handling (PNG, JPG, PDF)
- ✅ OnDemand Media API integration
- ✅ Automatic text extraction
- ✅ Aadhar card data parsing
- ✅ Error handling and logging
- ✅ CORS enabled for frontend access
