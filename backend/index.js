import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ConnectDB from './config/db.js';
import serverless from 'serverless-http';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import suggestionsRoutes from './routes/suggestionRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import salesRoutes from './routes/TodaySale.js';
import giftcardsRoutes from './routes/giftCardRoutes.js';
import groceryRoutes from './routes/groceryRoutes.js';

dotenv.config();

const app = express();

// Optional: connect to DB inside an IIFE so top-level await isn't needed
(async () => {
  try {
    await ConnectDB();
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
})();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/suggestions', suggestionsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/giftcards', giftcardsRoutes);
app.use('/api/grocery', groceryRoutes);

// Optional test route
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API is working' });
});

// ❌ Do NOT use app.listen() in Vercel
// ✅ Export serverless handler
export const handler = serverless(app);
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});