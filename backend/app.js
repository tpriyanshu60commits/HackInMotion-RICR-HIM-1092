import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes (to be created)
import authRoutes from './routes/authRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import environmentRoutes from './routes/environmentRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import aiRoutes from './routes/ai.js';
import dataRoutes from './routes/data.js';
import reportRoutes from './routes/reports.js';
import myLocationRoutes from './routes/locations.js';
import routeRoutes from './routes/routeRoutes.js';

const app = express();

// Security and middleware
app.use(helmet()); // Set security HTTP headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies
  })
);
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')); // Request logging
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

// API Routes
app.get('/', (req, res) => {
  res.send('Environmental API is running...');
});

// Device 1 routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes); // Device 1
app.use('/api/environment', environmentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/community', communityRoutes);

// Device 3 routes (Ensuring frontend doesn't break if it relies on these specific paths)
app.use('/api/ai', aiRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/my-locations', myLocationRoutes);
app.use('/api/route', routeRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
