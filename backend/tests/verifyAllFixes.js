import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

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

async function runAllTests() {
  await mongoose.connect(process.env.MONGODB_URI);
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });

  // Create or get normal test user
  let user = await User.findOne({ email: 'test_normal_user@verdantx.com' });
  if (!user) {
    user = await User.create({
      name: 'Test Normal User',
      email: 'test_normal_user@verdantx.com',
      password: 'hashedPassword123',
    });
  }

  const normalToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  const normalHeader = { Authorization: `Bearer ${normalToken}` };
  const guestHeader = { Authorization: 'Bearer guest_token' };

  let passed = 0;
  let failed = 0;

  console.log('\n========================================');
  console.log('1. TESTING AUTHENTICATED USER AI REPORT');
  console.log('========================================');

  const authTests = [
    { name: 'Save AI Health Profile', method: 'POST', path: '/api/ai-health/profile', header: normalHeader, body: { primaryCity: 'Mumbai', ageGroup: 'adult', conditions: ['Asthma'] }, expected: 200 },
    { name: 'Generate AI Health Report', method: 'POST', path: '/api/ai-health/report/generate', header: normalHeader, body: { primaryCity: 'Mumbai', ageGroup: 'adult' }, expected: 201 },
    { name: 'Get Latest AI Health Report', method: 'GET', path: '/api/ai-health/report/latest', header: normalHeader, expected: 200 },
  ];

  for (const t of authTests) {
    try {
      const res = await request(t.method, t.path, t.header, t.body);
      if (res.status === t.expected) {
        console.log(`✅ [PASS] Auth User: ${t.name} -> Status ${res.status}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] Auth User: ${t.name} -> Expected ${t.expected}, got ${res.status}`, res.data);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [ERROR] Auth User: ${t.name}:`, err.message);
      failed++;
    }
  }

  console.log('\n========================================');
  console.log('2. TESTING GUEST USER AI REPORT (PRESERVED)');
  console.log('========================================');

  const guestTests = [
    { name: 'Guest Save AI Health Profile', method: 'POST', path: '/api/ai-health/profile', header: guestHeader, body: { primaryCity: 'Bhopal', ageGroup: 'senior', conditions: ['COPD'] }, expected: 200 },
    { name: 'Guest Generate AI Health Report', method: 'POST', path: '/api/ai-health/report/generate', header: guestHeader, body: { primaryCity: 'Bhopal' }, expected: 201 },
    { name: 'Guest Get Latest AI Health Report', method: 'GET', path: '/api/ai-health/report/latest', header: guestHeader, expected: 200 },
  ];

  for (const t of guestTests) {
    try {
      const res = await request(t.method, t.path, t.header, t.body);
      if (res.status === t.expected) {
        console.log(`✅ [PASS] Guest User: ${t.name} -> Status ${res.status}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] Guest User: ${t.name} -> Expected ${t.expected}, got ${res.status}`, res.data);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [ERROR] Guest User: ${t.name}:`, err.message);
      failed++;
    }
  }

  console.log('\n========================================');
  console.log('3. TESTING ENVIRONMENT CITY API');
  console.log('========================================');

  const envTests = [
    { name: 'GET /api/environment/city?city=Mumbai', method: 'GET', path: '/api/environment/city?city=Mumbai', header: normalHeader, expected: 200 },
    { name: 'GET /api/environment/city?city=Bhopal', method: 'GET', path: '/api/environment/city?city=Bhopal', header: normalHeader, expected: 200 },
    { name: 'GET /api/environment/compare?cities=Mumbai,Bhopal', method: 'GET', path: '/api/environment/compare?cities=Mumbai,Bhopal', header: normalHeader, expected: 200 },
    { name: 'GET /api/environment/city (missing city -> 400)', method: 'GET', path: '/api/environment/city', header: normalHeader, expected: 400 },
  ];

  for (const t of envTests) {
    try {
      const res = await request(t.method, t.path, t.header, t.body);
      if (res.status === t.expected) {
        console.log(`✅ [PASS] Environment: ${t.name} -> Status ${res.status}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] Environment: ${t.name} -> Expected ${t.expected}, got ${res.status}`, res.data);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [ERROR] Environment: ${t.name}:`, err.message);
      failed++;
    }
  }

  console.log('\n========================================');
  console.log('4. TESTING LOCATION SEARCH PROXY API');
  console.log('========================================');

  const searchTests = [
    { name: 'GET /api/locations/search?q=Mumbai', method: 'GET', path: '/api/locations/search?q=Mumbai', header: {}, expected: 200 },
    { name: 'GET /api/locations/search?q=Bhopal', method: 'GET', path: '/api/locations/search?q=Bhopal', header: {}, expected: 200 },
    { name: 'GET /api/location/search?q=Delhi', method: 'GET', path: '/api/location/search?q=Delhi', header: {}, expected: 200 },
  ];

  for (const t of searchTests) {
    try {
      const res = await request(t.method, t.path, t.header, t.body);
      if (res.status === t.expected && Array.isArray(res.data?.data) && res.data.data.length > 0) {
        console.log(`✅ [PASS] Location Search: ${t.name} -> Status ${res.status} (${res.data.data.length} results: ${res.data.data[0].display_name})`);
        passed++;
      } else {
        console.error(`❌ [FAIL] Location Search: ${t.name} -> Expected ${t.expected} with array, got ${res.status}`, res.data);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [ERROR] Location Search: ${t.name}:`, err.message);
      failed++;
    }
  }

  console.log('\n========================================');
  console.log(`TOTAL SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('========================================');

  server.close();
  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runAllTests().catch(async (err) => {
  console.error('Fatal error running tests:', err);
  if (server) server.close();
  await mongoose.disconnect();
  process.exit(1);
});
