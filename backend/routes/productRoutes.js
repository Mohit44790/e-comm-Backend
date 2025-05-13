// routes/productRoutes.js
import express from 'express';
import upload from '../middlewares/multerMiddleware.js'; // ✅ use this
import { categoryName, createProduct, deleteProduct, getAdminStats, getAllProducts, getFeaturedProducts, getFilteredProducts, getProductById, updateProduct } from '../controllers/productController.js';
// import { uploadToCloudinary } from '../middlewares/cloudinaryMiddleware.js';
import { isAdmin, isAuthenticated } from '../middlewares/authMiddleware.js';
import { createOrUpdateReview, deleteReview, getReviewsByProduct } from '../controllers/reviewController.js';

const router = express.Router();

// Public Routes
router.get("/", getAllProducts);
router.get("/filter", getFilteredProducts);
router.get("/:id", getProductById);
router.get("/featured", getFeaturedProducts);
router.get("/category/:categoryName", categoryName);

// Protected Routes
router.post('/create', isAuthenticated, isAdmin, upload.array('images',5), createProduct);
router.put("/:id", isAuthenticated, isAdmin, upload.single("images"), updateProduct);
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);
router.get("/admin/stats", getAdminStats);

// Review Routes
router.post("/", isAuthenticated, createOrUpdateReview); 
router.get("/:productId", getReviewsByProduct);
router.delete("/:id", isAuthenticated, deleteReview);

export default router;
