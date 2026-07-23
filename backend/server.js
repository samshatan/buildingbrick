import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db.js';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import http from 'http';
import { Server } from 'socket.io';

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
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import disputeRoutes from './routes/disputeRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import bulkOrderRoutes from './routes/bulkOrderRoutes.js';
import expertRequestRoutes from './routes/expertRequestRoutes.js';
import vbankRoutes from './routes/vbankRoutes.js';

// Load Env
dotenv.config();

// Ensure critical environment variables exist
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

// Connect to Database
connectDB();

const app = express();

// Disable express version header
app.disable('x-powered-by');

// Middlewares
app.use(helmet()); // Security headers
app.use(compression()); // Gzip/Brotli compression for responses

const allowedOrigins = [
  'http://localhost:5173', // Vite local
  'http://localhost:8081', // Expo local
  'https://www.brickourhouse.com', 
  'https://brickourhouse.com', 
  'https://buildingbrick-hg9k.onrender.com', // Render domain
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // Or allow if it's in the allowedOrigins list, or if we are in development
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Reduced payload limits to prevent DOS attacks
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { message: "Too many requests from this IP, please try again after 15 minutes" }
});

// Apply rate limiter to all API routes
app.use('/api/', apiLimiter);

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
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/materials', materialRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/disputes', disputeRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/bulk-orders', bulkOrderRoutes);
app.use('/api/v1/expert-requests', expertRequestRoutes);
app.use('/api/v1/vbank', vbankRoutes);

// Handle API 404s specifically
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API Route not found: ${req.originalUrl}` });
});

// Data Deletion Route for Google Play Console Compliance
app.get('/delete-account', (req, res) => {
  res.status(200).send(`
    <html>
      <head>
        <title>Account Deletion Request</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
          .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          h1 { color: #333; }
          p { font-size: 16px; color: #666; line-height: 1.5; }
          a { color: #cc4518; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Request Account Deletion</h1>
          <p>If you would like to delete your BrickOurHouse account and all associated data, please send an email to our support team.</p>
          <p>Email: <a href="mailto:support@brickourhouse.com">support@brickourhouse.com</a></p>
          <p>Please include the phone number or email address associated with your account in your email so we can process your request promptly.</p>
        </div>
      </body>
    </html>
  `);
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

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Attach io to req object so controllers can use it
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // User joins their own room based on their userId
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
