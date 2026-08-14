# HackInMotion Backend

This is the Node.js / Express backend for the HackInMotion project, an AI-powered environmental and health monitoring application.

## Architecture

- **Framework**: Express.js (Node.js)
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT & Passport (Google OAuth)
- **Real-Time**: Socket.io
- **AI Integration**: Groq SDK for generating health reports and analyzing environmental data
- **Security**: Helmet, CORS, Express-Rate-Limit

## Directory Structure

```text
backend/
├── config/         # Database and Passport config
├── controllers/    # Route controllers
├── jobs/           # Cron jobs (e.g., fetching air quality)
├── middleware/     # Error handlers, auth guards
├── models/         # Mongoose schemas
├── routes/         # Express routes mapping
├── scripts/        # Helper scripts
├── services/       # Core business logic and external API integrations
├── utils/          # Helpers and socket initialization
└── server.js       # App entry point
```

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your secrets.
   ```bash
   cp .env.example .env
   ```

## Environment Variables

Make sure the following variables are set in your `.env` file:

- `PORT`: (default 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for signing tokens
- `ENVIRONMENT_API_KEY`: API token for Waqi/Open-Meteo
- `GROQ_API_KEY`: Groq AI Key for health analysis
- `CLIENT_URL`: URL of the frontend (e.g., http://localhost:5173)

_(See `.env.example` for the full list of supported variables)_

## Running the Server

**Development Mode (Nodemon):**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

## API Routes Overview

- **Auth**: `/api/auth` - Login, registration, Google OAuth, Token validation
- **Users/Profile**: `/api/users`, `/api/v1/profile` - Profile management, settings, preferences
- **Environment Data**: `/api/environment`, `/api/data` - Fetch AQI, weather, historical snapshots
- **AI Health Reports**: `/api/ai-health`, `/api/ai` - AI chatbot, generate health reports based on conditions
- **Routing Risk**: `/api/route` - Analyze safety and AQI of a route between two points

## Deployment

1. Ensure `NODE_ENV=production`.
2. Define all secrets in your deployment platform (Vercel, Render, AWS, Heroku, etc.).
3. The server starts on the specified `$PORT`. Make sure `CLIENT_URL` matches your deployed frontend URL so CORS requests are allowed.

## Troubleshooting

- **MongoDB Timeout**: Make sure your IP address is whitelisted in MongoDB Atlas.
- **CORS Errors**: Ensure `CLIENT_URL` exactly matches the frontend URL, including `http`/`https` and without a trailing slash.
- **Groq API Errors**: Make sure your `GROQ_API_KEY` is valid and has sufficient quota.
