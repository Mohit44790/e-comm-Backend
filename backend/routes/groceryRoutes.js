
import express from "express";
import { createGrocery, deleteGrocery, getAllGroceries, getGroceryById, updateGrocery } from "../controllers/groceryController.js";
import upload from "../middlewares/multerMiddleware.js";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/", isAuthenticated, isAdmin, upload.array('images', 5), createGrocery);
router.get("/", isAuthenticated, isAdmin, getAllGroceries);
router.get("/:id",  getGroceryById);
router.put("/:id", isAuthenticated, isAdmin, upload.array("images", 5), updateGrocery);
router.delete("/:id", isAuthenticated, isAdmin, deleteGrocery);

export default router;