Write-Host "Running Frontend Checks..."
cd d:\verdantX\HackInMotion-RICR-HIM-1092\frontend
npm run lint
npm run build

Write-Host "Running Backend Checks..."
cd d:\verdantX\HackInMotion-RICR-HIM-1092\backend
npm run lint
# Backend build just runs node --check server.js
npm run build
