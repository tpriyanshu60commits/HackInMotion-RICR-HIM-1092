import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from '../app.js';

let server;

function request(method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const req = http.request(
      {
        host: '127.0.0.1',
        port,
        method,
        path,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        });
      }
    );

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  const guestHeader = { Authorization: 'Bearer guest_token' };

  console.log('--- TESTING GUEST ACCESS (ALLOWED ENDPOINTS) ---');

  const tests = [
    { name: 'GET /api/v1/profile', method: 'GET', path: '/api/v1/profile', expected: 200 },
    {
      name: 'PUT /api/v1/profile',
      method: 'PUT',
      path: '/api/v1/profile',
      body: { name: 'Guest' },
      expected: 200,
    },
    {
      name: 'GET /api/v1/profile/health',
      method: 'GET',
      path: '/api/v1/profile/health',
      expected: 200,
    },
    {
      name: 'PUT /api/v1/profile/health',
      method: 'PUT',
      path: '/api/v1/profile/health',
      body: { age: 30 },
      expected: 200,
    },
    {
      name: 'GET /api/v1/profile/notifications',
      method: 'GET',
      path: '/api/v1/profile/notifications',
      expected: 200,
    },
    {
      name: 'PUT /api/v1/profile/notifications',
      method: 'PUT',
      path: '/api/v1/profile/notifications',
      body: { isMuted: true },
      expected: 200,
    },
    {
      name: 'GET /api/v1/profile/preferences',
      method: 'GET',
      path: '/api/v1/profile/preferences',
      expected: 200,
    },
    {
      name: 'PUT /api/v1/profile/preferences',
      method: 'PUT',
      path: '/api/v1/profile/preferences',
      body: { temperatureUnit: 'fahrenheit' },
      expected: 200,
    },
    {
      name: 'PATCH /api/users/profile',
      method: 'PATCH',
      path: '/api/users/profile',
      body: { phone: '123' },
      expected: 200,
    },
    { name: 'GET /api/locations', method: 'GET', path: '/api/locations', expected: 200 },
    {
      name: 'POST /api/locations',
      method: 'POST',
      path: '/api/locations',
      body: { name: 'Park', city: 'Delhi', latitude: 28.6, longitude: 77.2 },
      expected: 201,
    },
    {
      name: 'DELETE /api/locations/123',
      method: 'DELETE',
      path: '/api/locations/123',
      expected: 200,
    },
    { name: 'GET /api/alerts', method: 'GET', path: '/api/alerts', expected: 200 },
    {
      name: 'PUT /api/alerts/123/read',
      method: 'PUT',
      path: '/api/alerts/123/read',
      expected: 200,
    },
    { name: 'DELETE /api/alerts/123', method: 'DELETE', path: '/api/alerts/123', expected: 200 },
    { name: 'GET /api/ai/history', method: 'GET', path: '/api/ai/history', expected: 200 },
    { name: 'DELETE /api/ai/history', method: 'DELETE', path: '/api/ai/history', expected: 200 },
    {
      name: 'GET /api/ai-health/profile',
      method: 'GET',
      path: '/api/ai-health/profile',
      expected: 200,
    },
    {
      name: 'POST /api/ai-health/profile',
      method: 'POST',
      path: '/api/ai-health/profile',
      body: { ageGroup: 'adult', primaryCity: 'London' },
      expected: 200,
    },
    {
      name: 'POST /api/ai-health/report/generate',
      method: 'POST',
      path: '/api/ai-health/report/generate',
      body: { primaryCity: 'London' },
      expected: 201,
    },
    {
      name: 'GET /api/ai-health/report/latest',
      method: 'GET',
      path: '/api/ai-health/report/latest',
      expected: 200,
    },
    { name: 'GET /api/snapshots/123', method: 'GET', path: '/api/snapshots/123', expected: 200 },
    {
      name: 'POST /api/community',
      method: 'POST',
      path: '/api/community',
      body: { category: 'smoke', description: 'smoke seen', latitude: 28.6, longitude: 77.2 },
      expected: 201,
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const res = await request(t.method, t.path, guestHeader, t.body);
      if (res.status === t.expected) {
        console.log(`✅ [PASS] ${t.name} -> Status ${res.status}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${t.name} -> Expected ${t.expected}, got ${res.status}`, res.data);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [ERROR] ${t.name}:`, err.message);
      failed++;
    }
  }

  console.log('\n--- TESTING GUEST RESTRICTIONS (MUST RETURN 403) ---');
  const restrictedTests = [
    {
      name: 'GET /api/v1/profile/privacy',
      method: 'GET',
      path: '/api/v1/profile/privacy',
      expected: 403,
    },
    {
      name: 'PUT /api/v1/profile/privacy',
      method: 'PUT',
      path: '/api/v1/profile/privacy',
      body: { dataSharing: true },
      expected: 403,
    },
    {
      name: 'GET /api/v1/profile/export',
      method: 'GET',
      path: '/api/v1/profile/export',
      expected: 403,
    },
    { name: 'DELETE /api/v1/profile', method: 'DELETE', path: '/api/v1/profile', expected: 403 },
    { name: 'DELETE /api/users/me', method: 'DELETE', path: '/api/users/me', expected: 403 },
    {
      name: 'PUT /api/auth/password',
      method: 'PUT',
      path: '/api/auth/password',
      body: { currentPassword: '123', newPassword: '456' },
      expected: 403,
    },
  ];

  for (const t of restrictedTests) {
    try {
      const res = await request(t.method, t.path, guestHeader, t.body);
      if (res.status === t.expected) {
        console.log(
          `🔒 [PASS] Restricted: ${t.name} -> Blocked with ${res.status} (${res.data?.message})`
        );
        passed++;
      } else {
        console.error(
          `❌ [FAIL] Restricted: ${t.name} -> Expected ${t.expected}, got ${res.status}`,
          res.data
        );
        failed++;
      }
    } catch (err) {
      console.error(`❌ [ERROR] Restricted: ${t.name}:`, err.message);
      failed++;
    }
  }

  console.log(`\n================================`);
  console.log(`Summary: ${passed} passed, ${failed} failed`);
  console.log(`================================`);

  server.close();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Test runner fatal error:', err);
  if (server) server.close();
  process.exit(1);
});
