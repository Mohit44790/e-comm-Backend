import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  
  getCategoryDetails,
} from "../controllers/categoryController.js";
import {  isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin routes
router.post("/", isAuthenticated, isAdmin, createCategory);
router.put("/:id", isAuthenticated, isAdmin, updateCategory);
router.delete("/:id", isAuthenticated, isAdmin, deleteCategory);

// Public routes
router.get("/filters/:slug", getCategoryDetails);
router.get("/allget", getAllCategories);
router.get("/get/:id", getCategoryById);

export default router;
