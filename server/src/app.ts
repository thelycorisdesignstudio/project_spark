import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// Security headers
app.use(helmet());

// CORS — accept any localhost port in dev, strict in production
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow server-to-server / same-origin proxy
    if (process.env.NODE_ENV === 'production') {
      const allowed = process.env.CLIENT_URL || 'http://localhost:5173';
      return callback(origin === allowed ? null : new Error('CORS'), origin === allowed);
    }
    // In development, allow any localhost origin
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
    callback(new Error('CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Cookie parser
app.use(cookieParser());

// Body parsing — stripe webhook needs raw body
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 200 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', globalLimiter);

// Health check
app.get('/api/health', async (_req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbState,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// Routes
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import projectRoutes from './routes/project.routes';
import progressRoutes from './routes/progress.routes';
import aiRoutes from './routes/ai.routes';
import badgeRoutes from './routes/badge.routes';
import parentRoutes from './routes/parent.routes';
import stripeRoutes from './routes/stripe.routes';
import intelligenceRoutes from './routes/intelligence.routes';

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/intelligence', intelligenceRoutes);

// Error handling
app.use(errorMiddleware);

export default app;
