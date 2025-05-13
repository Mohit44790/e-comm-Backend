import express from "express";
import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  getBrandsByCategory,
  productsByBrandSlug
} from "../controllers/brandController.js";
import upload from "../middlewares/multerMiddleware.js";
import {  isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, isAdmin, upload.single("logo"), createBrand);
router.get("/get", getBrands);
router.get('/category/:categoryId', getBrandsByCategory);
router.get("/:id", getBrandById);
router.put("/:id", isAuthenticated, isAdmin, upload.single("logo"), updateBrand);
router.delete("/:id", isAuthenticated, isAdmin, deleteBrand);
router.get("/slug/:brandSlug/products", productsByBrandSlug);
  
export default router;
