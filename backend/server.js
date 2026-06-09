import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import cafeRoutes from './routes/cafeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import directRequestRoutes from './routes/directRequestRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Load Env
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
// Set security HTTP headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter);

app.use(cors({ origin: '*' })); // Allow all origins for seamless development
app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

// Logger middleware for easy request tracking
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'BrickOurHouse backend service is healthy.' });
});

// API Routes mounting
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/workers', workerRoutes);
app.use('/api/v1/requests', requestRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/cafes', cafeRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/direct-requests', directRequestRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Handle API 404s specifically
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API Route not found: ${req.originalUrl}` });
});

// Root route for Render health checks
app.get('/', (req, res) => {
  res.status(200).send('BrickOurHouse API is running.');
});

// Global 404 Route handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Global Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    message: err.message || 'An unexpected server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
