import express from 'express';
import { createOrUpdateReview, deleteReview, getReviewsByProduct } from '../controllers/reviewController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';


const router = express.Router();


  router.post("/create", isAuthenticated, createOrUpdateReview);
  router.get("/:productId", getReviewsByProduct);
  router.delete("/:id",isAuthenticated, deleteReview);
  

  export default router;
