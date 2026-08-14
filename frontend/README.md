# HackInMotion Frontend

This is the React frontend for the HackInMotion project, an AI-powered environmental and health monitoring application.

## Architecture & Technologies

- **Framework**: React 19 + Vite 6
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Styling**: Tailwind CSS + Framer Motion (for animations)
- **Map Integration**: React Leaflet & Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React
- **Real-Time**: Socket.io-client

## Directory Structure

```text
frontend/
├── public/         # Static assets
└── src/
    ├── api/        # API configuration (if any)
    ├── assets/     # Images, icons
    ├── components/ # Reusable UI components (chat, health, common)
    ├── data/       # Mock data or constants
    ├── hooks/      # Custom React hooks
    ├── layouts/    # App layout wrappers (MainLayout)
    ├── locales/    # i18n translation files
    ├── pages/      # Page components mapped to routes
    ├── services/   # Axios API integrations
    ├── store/      # Zustand store definitions
    ├── utils/      # Helpers, Tailwind merge `cn`
    ├── App.jsx     # Route definitions
    └── main.jsx    # React rendering root
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your variables.
   ```bash
   cp .env.example .env
   ```

## Environment Variables

Make sure the following variables are set in your `.env` file:
- `VITE_API_BASE_URL`: The URL to the backend API (e.g., `http://localhost:5000/api`)
- `VITE_GEOAPIFY_MAP_KEY`: API Key for map tiles used in Route Risk.

## Running the App

**Development Mode:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm run preview
```

## Features

- **Dashboard**: Live overview of local AQI and environmental metrics.
- **Route Risk**: Calculates the safest route avoiding bad air quality zones.
- **City Comparison**: Compare environmental risk across multiple cities.
- **AI Health Profile**: Get personalized daily health reports based on environmental conditions and medical history.
- **AI Chatbot**: Context-aware chatbot for real-time queries.
- **Settings & Privacy**: Manage preferences, export data, and delete account securely.

## Deployment

The application is built as a static Single Page Application (SPA).
1. Build the app using `npm run build`.
2. Deploy the `dist/` directory to Vercel, Netlify, AWS S3, or any static hosting service.
3. Configure the hosting platform to redirect all 404s to `index.html` to support client-side routing.
4. Set the `VITE_API_BASE_URL` in the deployment environment to point to your live backend URL.
