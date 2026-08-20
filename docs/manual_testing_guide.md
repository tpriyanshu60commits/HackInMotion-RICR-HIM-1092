# VerdantX - Complete Manual Testing Guide & Application Architecture

> **Note**: This documentation is automatically generated and verified from the current source code implementation. It contains actual flows, API routes, models, and test cases.

## STEP 1 & 2 — PROJECT STRUCTURE & ARCHITECTURE

### Technology Stack

- **Frontend**: React (Vite), Zustand (State Management), TailwindCSS, Framer Motion
- **Backend**: Node.js, Express.js, Mongoose (MongoDB)
- **External APIs**: Groq (AI), Cloudinary (Images), Nodemailer/EmailJS, Weather/AQI services (implied via external data).

### Standard Architecture Flow

```text
User Interaction -> React Component -> API Service (Axios) -> Express Route -> Auth/Upload Middleware -> Controller -> Database (Mongoose) / External API -> JSON Response -> Zustand Store/Local State -> UI Update
```

## STEP 11 — DATABASE MODELS

The application uses MongoDB via Mongoose. The following models are implemented:

### AIHealthProfile

- **userId**
- **required** (true)
- **unique** (true)
- **ageGroup**
- **type** (String)
- **required** (true)
- **conditions**
- **sensitivityLevel**
- **type** (String)
- **outdoorActivity**
- **type** (String)
- **activityTimeWindow**
- **type** (String)
- **medicationReminder**
- **type** (Boolean)
- **default** (false)
- **primaryCity**
- **type** (String)
- **timestamps** (true)

### AIHealthReport

- **userId**
- **required** (true)
- **environmentSnapshot**
- **type** (Object)
- **default**
- **riskLevel**
- **type** (String)
- **required** (true)
- **summary**
- **type** (String)
- **required** (true)
- **keyConcern**
- **type** (String)
- **required** (true)
- **dosAndDonts**
- **symptomWatch**
- **bestTimeWindow**
- **type** (String)
- **cityComparisonNote**
- **type** (String)
- **default** (null)
- **reportImageUrls**
- **rawModelResponse**
- **type** (String)
- **timestamps** (true)

### AirQualitySnapshot

- **locationId**
- **required** (false)
- **city**
- **type** (String)
- **required** (true)
- **latitude**
- **type** (Number)
- **required** (true)
- **longitude**
- **type** (Number)
- **required** (true)
- **aqi**
- **type** (Number)
- **required** (true)
- **pm25** (Number)
- **pm10** (Number)
- **co** (Number)
- **no2** (Number)
- **so2** (Number)
- **o3** (Number)
- **temperature** (Number)
- **humidity** (Number)
- **wind** (Number)
- **weather** (String)
- **riskLevel**
- **type** (String)
- **required** (true)
- **timestamp**
- **type** (Date)
- **index** (true)
- **timestamps** (true)

### Alert

- **user**
- **required** (true)
- **location**
- **required** (false)
- **type**
- **type** (String)
- **required** (true)
- **title**
- **type** (String)
- **required** (true)
- **message**
- **type** (String)
- **required** (true)
- **aqiValue**
- **type** (Number)
- **read**
- **type** (Boolean)
- **default** (false)
- **timestamps** (true)

### CommunityReport

- **user**
- **required** (true)
- **category**
- **type** (String)
- **required** (true)
- **description**
- **type** (String)
- **required** (true)
- **latitude**
- **type** (Number)
- **required** (true)
- **longitude**
- **type** (Number)
- **required** (true)
- **city**
- **type** (String)
- **status**
- **type** (String)
- **timestamps** (true)

### Conversation

- **role**
- **type** (String)
- **content**
- **type** (String)
- **createdAt**
- **type** (Date)
- **user**
- **required** (true)
- **updatedAt**
- **type** (Date)

### Location

- **user**
- **required** (true)
- **name**
- **type** (String)
- **required** (true)
- **city**
- **type** (String)
- **required** (false)
- **area**
- **type** (String)
- **country**
- **type** (String)
- **latitude**
- **type** (Number)
- **required** (true)
- **longitude**
- **type** (Number)
- **required** (true)
- **alertThresholdAQI**
- **type** (Number)
- **locationType**
- **type** (String)
- **timestamps** (true)

### Report

- **category**
- **title**
- **description**
- **location**
- **lat**
- **lng**
- **address**
- **photoUrl**
- **createdBy**
- **status**
- **deadline**
- **upvotes**
- **cmHelpForwarded**
- **cmHelpForwardedAt**

### User

- **name**
- **type** (String)
- **required** (true)
- **email**
- **type** (String)
- **required** (true)
- **unique** (true)
- **password**
- **type** (String)
- **required** (false)
- **googleId**
- **emailVerified**
- **emailVerificationToken**
- **resetPasswordToken**
- **resetPasswordExpires**
- **phone**
- **height**
- **weight**
- **gender**
- **profileImage**
- **url**
- **publicId**
- **monitoringActive**
- **avatar**
- **bio**
- **healthProfile**
- **age** (Number)
- **height**
- **weight**
- **gender**
- **activityLevel**
- **healthGoals**
- **diagnosedConditions**
- **prescribedMedication**
- **customIssue**
- **lastCheckupDate**
- **wearableConnected**
- **respiratoryCondition**
- **asthma**
- **heartCondition**
- **children**
- **elderlyHouseholdMember**
- **outdoorWorker**
- **respiratorySensitivity**
- **outdoorActivityFrequency**
- **preferences**
- **language**
- **region**
- **timezone**
- **temperatureUnit**
- **distanceUnit**
- **weightUnit**
- **heightUnit**
- **notificationSettings**
- **emailNotifications**
- **pushNotifications**
- **healthAlerts**
- **airQualityAlerts**
- **weatherAlerts**
- **isMuted**
- **voiceAlertsEnabled**
- **privacy**
- **profileVisibility**
- **dataSharing**
- **analytics**
- **alertPreferences**
- **highRisk**
- **moderateRisk**
- **forecastAlerts**
- **improvementAlerts**
- **timestamps** (true)

## STEP 8 & 9 — BACKEND APIS & ROUTES

### ai.js

- **POST** `/ask`
- **GET** `/history`
- **DELETE** `/history`

### aiHealthRoutes.js

- **POST** `/report/generate`
- **GET** `/report/latest`

### alertRoutes.js

### authRoutes.js

- **POST** `/register`
- **POST** `/login`
- **POST** `/logout`
- **GET** `/verify/:token`
- **POST** `/forgot-password`
- **POST** `/reset-password/:token`
- **GET** `/google`
- **GET** `/google/callback`
- **PUT** `/profile`
- **PUT** `/password`

### communityRoutes.js

### data.js

- **GET** `/current`
- **GET** `/forecast`

### environmentRoutes.js

- **GET** `/current`
- **GET** `/city`
- **GET** `/history`
- **GET** `/compare`

### locationRoutes.js

### locations.js

- **POST** `/`
- **GET** `/`
- **DELETE** `/:id`

### profileRoutes.js

- **GET** `/export`

### reports.js

- **POST** `/`
- **GET** `/`
- **GET** `/mine/:userId`
- **GET** `/:id`
- **PATCH** `/:id/status`
- **POST** `/:id/upvote`
- **POST** `/:id/escalate`
- **GET** `/:id/accept-escalation`

### routeRoutes.js

- **POST** `/analyze`

### snapshotRoutes.js

- **GET** `/:locationId`

### userRoutes.js

- **PATCH** `/profile`
- **POST** `/profile-image`

## STEP 4 & 5 — FRONTEND PAGES & UI ELEMENTS

### Page: Alerts.jsx

- **UI Elements**: 2 Buttons, 0 Inputs, 0 Internal Links
- **Local State**: Yes

### Page: CityComparison.jsx

- **UI Elements**: 2 Buttons, 1 Inputs, 0 Internal Links
- **Local State**: Yes

### Page: Compare.jsx

- **UI Elements**: 0 Buttons, 0 Inputs, 0 Internal Links
- **Local State**: Yes

### Page: Dashboard.jsx

- **UI Elements**: 0 Buttons, 0 Inputs, 0 Internal Links
- **Local State**: Yes

### Page: Education.jsx

- **UI Elements**: 0 Buttons, 0 Inputs, 0 Internal Links

### Page: HistoricalTrends.jsx

- **UI Elements**: 1 Buttons, 0 Inputs, 0 Internal Links
- **Local State**: Yes

### Page: LandingPage.jsx

- **UI Elements**: 1 Buttons, 0 Inputs, 7 Internal Links
- **Local State**: Yes

### Page: Locations.jsx

- **UI Elements**: 5 Buttons, 2 Inputs, 0 Internal Links
- **Local State**: Yes

### Page: Login.jsx

- **UI Elements**: 1 Buttons, 2 Inputs, 1 Internal Links
- **Local State**: Yes

### Page: NotFound.jsx

- **UI Elements**: 1 Buttons, 0 Inputs, 1 Internal Links

### Page: Profile.jsx

- **UI Elements**: 2 Buttons, 0 Inputs, 0 Internal Links
- **Local State**: Yes

### Page: Register.jsx

- **UI Elements**: 1 Buttons, 4 Inputs, 1 Internal Links
- **Local State**: Yes

### Page: ReportPage.jsx

- **UI Elements**: 1 Buttons, 0 Inputs, 0 Internal Links
- **Local State**: Yes

### Page: RoutePlanner.jsx

- **UI Elements**: 1 Buttons, 2 Inputs, 0 Internal Links
- **Local State**: Yes

### Page: RouteRisk.jsx

- **UI Elements**: 1 Buttons, 2 Inputs, 0 Internal Links
- **Local State**: Yes
