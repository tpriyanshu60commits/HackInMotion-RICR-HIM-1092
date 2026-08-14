# BACKEND ROUTES AND APIS

## ai.js
- Method: POST
  Endpoint: /ask
- Method: GET
  Endpoint: /history
- Method: DELETE
  Endpoint: /history

## aiHealthRoutes.js
- Method: POST
  Endpoint: /report/generate
- Method: GET
  Endpoint: /report/latest

## alertRoutes.js

## authRoutes.js
- Method: POST
  Endpoint: /register
- Method: POST
  Endpoint: /login
- Method: POST
  Endpoint: /logout
- Method: GET
  Endpoint: /verify/:token
- Method: POST
  Endpoint: /forgot-password
- Method: POST
  Endpoint: /reset-password/:token
- Method: GET
  Endpoint: /google
- Method: GET
  Endpoint: /google/callback
- Method: PUT
  Endpoint: /profile
- Method: PUT
  Endpoint: /password

## communityRoutes.js

## data.js
- Method: GET
  Endpoint: /current
- Method: GET
  Endpoint: /forecast

## environmentRoutes.js
- Method: GET
  Endpoint: /current
- Method: GET
  Endpoint: /city
- Method: GET
  Endpoint: /history
- Method: GET
  Endpoint: /compare

## locationRoutes.js

## locations.js
- Method: POST
  Endpoint: /
- Method: GET
  Endpoint: /
- Method: DELETE
  Endpoint: /:id

## profileRoutes.js
- Method: GET
  Endpoint: /export

## reports.js
- Method: POST
  Endpoint: /
- Method: GET
  Endpoint: /
- Method: GET
  Endpoint: /mine/:userId
- Method: GET
  Endpoint: /:id
- Method: PATCH
  Endpoint: /:id/status
- Method: POST
  Endpoint: /:id/upvote
- Method: POST
  Endpoint: /:id/escalate
- Method: GET
  Endpoint: /:id/accept-escalation

## routeRoutes.js
- Method: POST
  Endpoint: /analyze

## snapshotRoutes.js
- Method: GET
  Endpoint: /:locationId

## userRoutes.js
- Method: PATCH
  Endpoint: /profile
- Method: POST
  Endpoint: /profile-image

