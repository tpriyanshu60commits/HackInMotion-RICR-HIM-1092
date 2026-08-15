Visit Website - https://hack-in-motion-ricr-him-1092.vercel.app/
dummy data = 
email = example123@gmail.com
password = example@123



# HackInMotion: AI-Powered Environmental & Health Monitoring

HackInMotion is a comprehensive full-stack application that monitors environmental conditions (AQI, weather) in real-time and uses AI to provide personalized health risk assessments, travel route analysis, and actionable insights.

## Project Architecture

The project is structured as a monorepo containing a React frontend and a Node.js/Express backend.

```text
HackInMotion-RICR-HIM-1092/
├── frontend/   # React + Vite + Tailwind CSS + Zustand
└── backend/    # Node.js + Express + MongoDB + AI Integration
```

### Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Zustand, Recharts, Leaflet, Framer Motion
- **Backend**: Node.js, Express, MongoDB, Mongoose, Passport (OAuth), Socket.io
- **AI Integration**: Groq SDK for fast LLM inference (health reports, chatbot)
- **Data Sources**: WAQI (World Air Quality Index), Open-Meteo, Geoapify

## Key Features

- **Personalized AI Health Reports**: Generates risk assessments based on local air quality and user medical conditions.
- **Route Risk Analysis**: Find the safest travel route avoiding highly polluted areas, along with amenities (hospitals, fuel stations).
- **City Comparison**: Real-time comparison of AQI and PM2.5 across multiple locations.
- **Real-Time Data**: WebSocket integration for live data updates without refreshing.
- **Privacy & Security**: Granular privacy controls, data export capabilities, and secure JWT + OAuth authentication.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- API Keys: Groq API Key, Geoapify Key (for maps), WAQI token

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env variables (MongoDB, JWT, API Keys)
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```

The application will be accessible at `http://localhost:5173`.

## Deployment

Both the frontend and backend are production-ready.

1. **Backend Deployment**:
   - Deploy as a Node.js application (Render, Heroku, AWS).
   - Set all production environment variables.
   - Configure `CLIENT_URL` to match your frontend domain to resolve CORS.

2. **Frontend Deployment**:
   - Run `npm run build` to generate the static files.
   - Deploy the `dist/` folder to a static host (Vercel, Netlify).
   - Ensure the `VITE_API_BASE_URL` points to your deployed backend.
   - Configure SPA routing fallbacks (rewrite rules to `index.html`).

## Troubleshooting

- **CORS Issues**: Ensure the backend `.env` `CLIENT_URL` matches the exact frontend origin.
- **API Errors**: Ensure your Groq API key and Geoapify key are properly injected into the backend and frontend `.env` respectively.
- **Missing Data**: Environmental APIs can rate-limit requests. Check backend logs for API call failures.
