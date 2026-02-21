import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Debug Log
console.log('Starting Server...');

import { supabase } from './config/supabase.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import adminRoutes from './routes/admin.js';
import categoryRoutes from './routes/categories.js';
import tagRoutes from './routes/tags.js';
import bookmarkRoutes from './routes/bookmarks.js';
import uploadRoutes from './routes/upload.js';
import webhookRoutes from './routes/webhooks.js';
import settingsRoutes from './routes/settings.js';
import analyticsRoutes from './routes/analytics.js';
import newsletterRoutes from './routes/newsletter.js';
import { apiLimiter } from './middleware/rateLimiter.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Localtunnel/ngrok/Rate Limiting
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5178',
      'http://127.0.0.1:5178'
    ].map(u => u?.replace(/\/$/, ''));

    if (
      !origin ||
      allowed.includes(origin) ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      origin.endsWith('.vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use('/api', apiLimiter);

// API Routes
app.use('/api/webhooks', webhookRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/newsletter', newsletterRoutes);


// Routes
app.get('/', (req, res) => {
  res.json({ message: 'TechScribe API is running', timestamp: new Date() });
});

// Health Check & DB Connection Test
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) throw error;
    res.json({ status: 'ok', database: 'connected', timestamp: new Date() });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed', error: error.message });
  }
});

// Start Server (only when running locally, not on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
