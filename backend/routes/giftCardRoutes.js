import express from 'express';
import {
  createGiftCard,
  assignGiftCardToUser,
  checkGiftCardBalance,
  redeemGiftCard,
  fetchGiftCards,
  getMyGiftCards,
} from '../controllers/giftCardController.js';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', isAuthenticated, isAdmin, createGiftCard);
router.post('/assign', isAuthenticated, isAdmin, assignGiftCardToUser);
router.post('/redeem', isAuthenticated, redeemGiftCard);
router.get('/check/:code', checkGiftCardBalance);
router.get('/my', isAuthenticated, getMyGiftCards);
router.get('/cards', fetchGiftCards);


export default router;
