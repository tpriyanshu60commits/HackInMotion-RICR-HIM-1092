import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

dotenv.config();

connectDB();

import { initCronJobs } from './services/alertService.js';
initCronJobs();

import { startSampleAirQualityJob } from './jobs/sampleAirQuality.js';
startSampleAirQualityJob();

import http from 'http';
import { initSocket } from './utils/socket.js';

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);
initSocket(httpServer);

const server = httpServer.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
