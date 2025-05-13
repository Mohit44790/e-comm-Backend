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

const app = express();
dotenv.config();
ConnectDB();

// ✅ CORS Configuration
app.use(cors({
    origin: "https://amazon-e-commerce-psi.vercel.app",
    credentials: true, // Enable if you're using cookies or auth headers
  }));
app.use(express.json());
app.use(express.json());
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true }));
// Routes
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

export default function handler(req, res) {
  res.status(200).json({ message: "Hello from backend!" });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));