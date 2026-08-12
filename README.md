# VerdantX - Environmental Risk & Air Quality Monitoring Platform

## Project Overview
VerdantX is a premium, modern, and data-driven platform designed to provide Environmental Intelligence rather than just raw numbers. It helps users understand real-time environmental hazards, plan safer routes, compare city conditions, and query a specialized AI assistant.

### Problem
As urbanization and industrialization increase, communities are exposed to fluctuating environmental risks (high AQI, PM2.5, extreme weather). Traditional weather apps just provide raw numbers without context, leaving users unsure of how it affects their daily lives, health, or outdoor activities.

### Solution
VerdantX provides contextual, actionable environmental intelligence. Through intuitive visualizations, a strict-scoped AI Assistant, and community-driven hazard reporting, users can make informed decisions to protect their health and reduce exposure to pollutants.

## Features
- **Real-Time Environmental Dashboard**: Displays AQI, PM2.5, Temperature, and Wind using user geolocation.
- **Verdant AI Assistant**: A specialized Llama-powered AI agent focused *strictly* on environmental topics, CleanTech, and risk mitigation.
- **City Comparison**: Compare environmental data across multiple cities simultaneously.
- **Route Risk Planner**: Estimate the environmental exposure along a planned journey.
- **Community Reports**: View and submit local hazards (smoke, dust, waste burning).
- **Theming System**: 4 immersive visual modes (Light, Dark, Nature, Ocean).

## Tech Stack & Architecture
- **Frontend (Device 2 & 3)**: React 19, Tailwind CSS v4, Zustand (State), Recharts, React Router.
- **Backend (Device 1 & 3)**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ORM).
- **AI Integration**: Groq SDK (Llama 3 8B model).
- **External Data APIs**: Open-Meteo (Free, no-auth weather & AQI).

### Architecture Diagram
*See `docs/architecture-diagram.png` (Placeholder for real diagram).*

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/verdantx
GROQ_API_KEY=gsk_your_groq_api_key
FRONTEND_URL=http://localhost:5173
```

## Setup Instructions

### Local Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` file and populate it with `MONGODB_URI` and `GROQ_API_KEY`.
4. `npm start` (Runs on http://localhost:5000)

### Local Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on http://localhost:5173)

## Deployment Preparation
- **Frontend**: Prepared for deployment on Vercel/Netlify. Ensure `npm run build` succeeds and environment variables are set.
- **Backend**: Prepared for Render/Railway. Ensure CORS allows the production frontend URL.
- **Database**: MongoDB Atlas. Ensure network access IP whitelist is configured for the backend deployment provider.

## Known Limitations
- The Route Risk Planner uses a simplified straight-line mock coordinate logic due to the absence of a configured Google Maps/Mapbox API key in this demo.
- Community reports are temporarily tied to a mock User ID until the full JWT authentication flow from Device 1 is integrated.
