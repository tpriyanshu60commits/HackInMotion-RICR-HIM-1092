import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import environmentRoutes from './routes/environmentRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import aiRoutes from './routes/ai.js';
import dataRoutes from './routes/data.js';
import reportRoutes from './routes/reports.js';
import myLocationRoutes from './routes/locations.js';
import snapshotRoutes from './routes/snapshotRoutes.js';
import routeRoutes from './routes/routeRoutes.js';        // ← feature/SS06
import profileRoutes from './routes/profileRoutes.js';    // ← master
import userRoutes from './routes/userRoutes.js';
import aiHealthRoutes from './routes/aiHealthRoutes.js';

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'https://hack-in-motion-ricr-him-1092.vercel.app'
    ].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Environmental API is running...');
});

// ─── Device 1 Routes ──────────────────────────────────────────────────────────
import { authLimiter } from './middleware/authLimiter.js';
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/environment', environmentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/v1/profile', profileRoutes);      // ← master

// ─── Device 3 Routes ──────────────────────────────────────────────────────────
app.use('/api/ai', aiRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/my-locations', myLocationRoutes);
app.use('/api/snapshots', snapshotRoutes);
app.use('/api/route', routeRoutes);             // ← feature/SS06
app.use('/api/users', userRoutes);
app.use('/api/ai-health', aiHealthRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;

