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

async function testNormalUser() {
  await mongoose.connect(process.env.MONGODB_URI);
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });

  // Find or create test registered user
  let user = await User.findOne({ email: 'test_normal_user@verdantx.com' });
  if (!user) {
    user = await User.create({
      name: 'Test Normal User',
      email: 'test_normal_user@verdantx.com',
      password: 'hashedPassword123',
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  const authHeader = { Authorization: `Bearer ${token}` };

  console.log('--- TESTING NORMAL USER ACCESS ---');

  const tests = [
    { name: 'GET /api/v1/profile', method: 'GET', path: '/api/v1/profile', expected: 200 },
    {
      name: 'GET /api/v1/profile/privacy',
      method: 'GET',
      path: '/api/v1/profile/privacy',
      expected: 200,
    },
    {
      name: 'GET /api/v1/profile/health',
      method: 'GET',
      path: '/api/v1/profile/health',
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
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const res = await request(t.method, t.path, authHeader, t.body);
      if (res.status === t.expected) {
        console.log(`✅ [PASS] Normal User: ${t.name} -> Status ${res.status}`);
        passed++;
      } else {
        console.error(
          `❌ [FAIL] Normal User: ${t.name} -> Expected ${t.expected}, got ${res.status}`,
          res.data
        );
        failed++;
      }
    } catch (err) {
      console.error(`❌ [ERROR] Normal User: ${t.name}:`, err.message);
      failed++;
    }
  }

  console.log(`\nNormal User Summary: ${passed} passed, ${failed} failed`);
  server.close();
  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

testNormalUser().catch(async (err) => {
  console.error('Fatal error:', err);
  if (server) server.close();
  await mongoose.disconnect();
  process.exit(1);
});
