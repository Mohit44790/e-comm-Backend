import express from 'express';
import {
  assignPromotionToProducts,
  createPromotion,
  getAllProductsWithPromotion,
  getAllPromotions,
  getActivePromotionProducts
} from '../controllers/TodaySaleController.js';

const router = express.Router();

router.post('/create', createPromotion);
router.post('/assign', assignPromotionToProducts);
router.get('/active/:type', getActivePromotionProducts); // ✅ dynamic
router.get('/all', getAllPromotions);
router.get('/assigned-products', getAllProductsWithPromotion);

export default router;
