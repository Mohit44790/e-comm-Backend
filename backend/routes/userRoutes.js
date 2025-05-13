import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  updateProfile,
  updateProfileImage,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  addToCart,
  removeFromCart,
  
  getCart,
  emptyCart,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  blockUser,
  unblockUser,
  updateCart,
  deleteUser,
  updateUserRole,
  addViewedItem
} from "../controllers/userController.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";
// import multer from "multer";
import upload from "../middlewares/multerMiddleware.js";

// const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// 🔐 Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/profile", isAuthenticated, getMyProfile);
// router.get('/getall', isAuthenticated, isAdmin, getAllUsers);
router.put("/me/update", isAuthenticated, updateProfile);
router.put("/me/update-image", isAuthenticated, upload.single("profileImage"), updateProfileImage);
router.post('/add-viewed-item', addViewedItem);

// ❤️ Wishlist
router.post("/wishlist/add/:productId", isAuthenticated, addToWishlist);
router.delete("/wishlist/remove/:productId", isAuthenticated, removeFromWishlist);
router.get("/wishlist", isAuthenticated, getWishlist);

// 🛒 Cart
router.post("/cart/add", isAuthenticated, addToCart);
router.put("/cart/update", isAuthenticated, updateCart);
router.delete("/cart/remove/:productId",isAuthenticated, removeFromCart);

router.get("/cart", isAuthenticated, getCart);
router.delete("/cart/empty", isAuthenticated, emptyCart);

// // 🏠 Address
router.post("/address/add", isAuthenticated, addAddress);
router.put("/address/update", isAuthenticated, updateAddress);
router.delete("/address/delete", isAuthenticated, deleteAddress);

// // 👑 Admin: Manage Users
router.get("/admin/all-users", isAuthenticated, isAdmin, getAllUsers);
router.put("/admin/block/:userId", isAuthenticated, isAdmin, blockUser);
router.put("/admin/unblock/:userId", isAuthenticated, isAdmin, unblockUser);
// 👇 Add these new ones
router.delete('/admin/delete-user/:id', isAuthenticated, isAdmin, deleteUser);
router.put('/admin/update-role/:id', isAuthenticated, isAdmin, updateUserRole);

export default router;
