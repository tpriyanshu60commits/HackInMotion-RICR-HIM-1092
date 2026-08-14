# VerdantX API Documentation

## Authentication & Users (MOCK)

_Currently using mock user ID `60d0fe4f5311236168a109ca` for device 3 demo integration._

---

## AI Assistant (`/api/ai`)

### `POST /api/ai/ask`

Submits a prompt to the Groq AI Environmental Agent.

**Request Body:**

```json
{
  "message": "What is the air quality in my city?",
  "contextData": {
    "aqi": 85,
    "pm2_5": 12.5,
    "temperature": 28,
    "humidity": 45
  }
}
```

**Response:**

```json
{
  "response": "The air quality in your city is currently Moderate with an AQI of 85..."
}
```

---

## Environmental Data (`/api/data`)

_Proxies requests to Open-Meteo free API._

### `GET /api/data/current`

Fetches current AQI, PM2.5, PM10, and Weather.

**Query Parameters:**

- `lat` (required): Latitude
- `lng` (required): Longitude

**Response:**

```json
{
  "aqi": 110,
  "pm2_5": 45.2,
  "pm10": 80.1,
  "temperature": 29.5,
  "humidity": 55,
  "windSpeed": 12.4,
  "timestamp": "2026-08-12T12:00:00Z"
}
```

### `GET /api/data/forecast`

Fetches 48-hour forecast for AQI and PM2.5.

**Query Parameters:**

- `lat` (required): Latitude
- `lng` (required): Longitude

---

## Community Reports (`/api/reports`)

### `POST /api/reports`

Submit a new environmental hazard report.

**Request Body:**

```json
{
  "type": "Smoke",
  "severity": "High",
  "description": "Thick black smoke from factory.",
  "lat": 28.6139,
  "lng": 77.209
}
```

### `GET /api/reports`

Fetch recent community reports.

**Response:**

```json
[
  {
    "_id": "report_id",
    "type": "Smoke",
    "severity": "High",
    "description": "Thick black smoke from factory.",
    "lat": 28.6139,
    "lng": 77.209,
    "createdAt": "2026-08-12T12:00:00Z"
  }
]
```
