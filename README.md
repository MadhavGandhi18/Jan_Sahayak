# Jan Sahayak - AI Document Assistant

A modern web application for generating government affidavits and filling custom forms using AI technology.

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
