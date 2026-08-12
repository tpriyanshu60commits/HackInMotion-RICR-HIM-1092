# API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication

All protected routes require a JWT token. The token is sent in an `HttpOnly` cookie by default when logging in. Alternatively, you can pass it in the `Authorization` header as a Bearer token.

### 1. Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "success": true,
    "data": { "_id": "...", "name": "John Doe", "email": "john@example.com", "token": "..." }
  }
  ```

### 2. Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200 OK`

### 3. Get/Update Profile
- **URL**: `/auth/profile`
- **Method**: `GET` / `PUT`
- **Protected**: Yes
- **PUT Body (optional fields)**:
  ```json
  {
    "name": "John Updated",
    "healthProfile": {
      "respiratoryCondition": true,
      "asthma": false
    },
    "alertPreferences": {
      "highRisk": true
    }
  }
  ```

---

## Locations

### 1. Get Saved Locations
- **URL**: `/locations`
- **Method**: `GET`
- **Protected**: Yes

### 2. Save a Location
- **URL**: `/locations`
- **Method**: `POST`
- **Protected**: Yes
- **Body**:
  ```json
  {
    "name": "Home",
    "city": "London",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "locationType": "home"
  }
  ```

### 3. Delete Location
- **URL**: `/locations/:id`
- **Method**: `DELETE`
- **Protected**: Yes

---

## Environment & Risk Engine

The risk engine automatically incorporates the authenticated user's `healthProfile` to adjust the `risk` severity.

### 1. Current Air Quality (by Coordinates)
- **URL**: `/environment/current?lat=51.5&lng=-0.1`
- **Method**: `GET`
- **Protected**: Yes
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "aqi": 120,
      "pm25": 45,
      "city": "London",
      "risk": {
        "riskLevel": "UNHEALTHY_SENSITIVE",
        "severity": 3,
        "personalRisk": "HIGHER",
        "explanation": "Respiratory conditions increase susceptibility.",
        "recommendations": ["Keep windows closed"]
      }
    }
  }
  ```

### 2. Historical Data
- **URL**: `/environment/history?lat=51.5&lng=-0.1&days=7`
- **Method**: `GET`
- **Protected**: Yes

### 3. Compare Cities
- **URL**: `/environment/compare?cities=London,Paris,Berlin`
- **Method**: `GET`
- **Protected**: Yes

---

## Alerts

### 1. Get User Alerts
- **URL**: `/alerts`
- **Method**: `GET`
- **Protected**: Yes

### 2. Mark Alert Read
- **URL**: `/alerts/:id/read`
- **Method**: `PUT`
- **Protected**: Yes

---

## Community Reports

### 1. Get Reports
- **URL**: `/community?lat=51.5&lng=-0.1&radius=10`
- **Method**: `GET`
- **Protected**: No

### 2. Create Report
- **URL**: `/community`
- **Method**: `POST`
- **Protected**: Yes
- **Body**:
  ```json
  {
    "category": "smoke",
    "description": "Thick black smoke from a factory",
    "latitude": 51.5,
    "longitude": -0.1,
    "city": "London"
  }
  ```

### 3. Upvote Report
- **URL**: `/community/:id/upvote`
- **Method**: `PUT`
- **Protected**: Yes

## Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "code": "400",
  "details": null
}
```
