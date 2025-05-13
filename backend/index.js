import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ConnectDB from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from "./routes/categoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import suggestionsRoutes from "./routes/suggestionRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import salesRoutes from "./routes/TodaySale.js";
import giftcardsRoutes from "./routes/giftCardRoutes.js";
import groceryRoutes from "./routes/groceryRoutes.js";

import serverless from 'serverless-http';

dotenv.config();

const app = express();

try {
  await ConnectDB();
} catch (error) {
  console.error('❌ Database connection failed:', error);
  // Optionally send a response or exit early
}

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/suggestions", suggestionsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/giftcards", giftcardsRoutes);
app.use("/api/grocery", groceryRoutes);

// ✅ Correct export (no default export here)
export const handler = serverless(app);
