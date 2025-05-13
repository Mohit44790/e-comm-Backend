import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  markOrderPaid,
  getOrderStatusById,
} from "../controllers/orderController.js";
import {  isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/create", isAuthenticated, createOrder);
router.get("/getorder", isAuthenticated, getMyOrders);
router.get("/:id", isAuthenticated, getOrderById);
router.put("/:id/pay", isAuthenticated, markOrderPaid);
router.get("/status/:id", isAuthenticated, getOrderStatusById);

// Admin routes
router.get("/", isAuthenticated, isAdmin, getAllOrders);
router.put("/:id/status", isAuthenticated, isAdmin, updateOrderStatus);

export default router;
