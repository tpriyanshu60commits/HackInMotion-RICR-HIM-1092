$ErrorActionPreference = "Continue"

Write-Host "Running Frontend Checks..."
cd d:\verdantX\HackInMotion-RICR-HIM-1092\frontend
npm run lint > d:\verdantX\HackInMotion-RICR-HIM-1092\frontend-lint.log 2>&1
npm run build > d:\verdantX\HackInMotion-RICR-HIM-1092\frontend-build.log 2>&1
npm audit > d:\verdantX\HackInMotion-RICR-HIM-1092\frontend-audit.log 2>&1
npx knip > d:\verdantX\HackInMotion-RICR-HIM-1092\frontend-knip.log 2>&1
npx prettier --check . > d:\verdantX\HackInMotion-RICR-HIM-1092\frontend-prettier.log 2>&1

Write-Host "Running Backend Checks..."
cd d:\verdantX\HackInMotion-RICR-HIM-1092\backend
npm run lint > d:\verdantX\HackInMotion-RICR-HIM-1092\backend-lint.log 2>&1
npm run build > d:\verdantX\HackInMotion-RICR-HIM-1092\backend-build.log 2>&1
npm audit > d:\verdantX\HackInMotion-RICR-HIM-1092\backend-audit.log 2>&1
npx knip > d:\verdantX\HackInMotion-RICR-HIM-1092\backend-knip.log 2>&1
npx prettier --check . > d:\verdantX\HackInMotion-RICR-HIM-1092\backend-prettier.log 2>&1

Write-Host "Done!"
