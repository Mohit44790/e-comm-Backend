import GiftCard from '../model/GiftCard.js';
import User from '../model/User.js';
import mongoose from 'mongoose';

export const createGiftCard = async (req, res) => {
  try {
    const { code, balance, expirationDate } = req.body;

    if (req.user.role?.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const existing = await GiftCard.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Gift card code already exists' });
    }

    if (new Date(expirationDate) <= new Date()) {
      return res.status(400).json({ message: 'Expiration date must be in the future' });
    }

    const giftCard = await GiftCard.create({ code, balance, expirationDate });
    res.status(201).json({ message: 'Gift card created successfully', giftCard });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export const assignGiftCardToUser = async (req, res) => {
    try {
      const { userId, giftCardId } = req.body;
  
      console.log('Assigning Gift Card:', { userId, giftCardId, });
  
      if (!mongoose.Types.ObjectId.isValid(giftCardId)) {
        console.error('Invalid giftCardId format:', giftCardId);
        return res.status(400).json({ message: 'Invalid gift card ID format' });
      }
  
      const giftCardObjectId = new mongoose.Types.ObjectId(giftCardId);
  
      const giftCard = await GiftCard.findById(giftCardObjectId);
      if (!giftCard) {
        return res.status(404).json({ message: 'Gift card not found' });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.giftCards.includes(giftCardObjectId)) {
        return res.status(400).json({ message: 'Gift card already assigned to user' });
      }
  
      user.giftCards.push(giftCardObjectId);
      await user.save();
  
      res.status(200).json({ message: 'Gift card assigned to user', user });
    } catch (error) {
      console.error('Error during gift card assignment:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  

export const checkGiftCardBalance = async (req, res) => {
  try {
    const { code } = req.params;

    const giftCard = await GiftCard.findOne({ code });
    if (!giftCard) return res.status(404).json({ message: 'Gift card not found' });

    if (!giftCard.isActive || giftCard.expirationDate < Date.now()) {
      return res.status(400).json({ message: 'Gift card is inactive or expired' });
    }

    res.status(200).json({
      code: giftCard.code,
      balance: giftCard.balance,
      expirationDate: giftCard.expirationDate,
      isActive: giftCard.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const redeemGiftCard = async (req, res) => {
  try {
    const { code, amount } = req.body;

    const giftCard = await GiftCard.findOne({ code });
    if (!giftCard) return res.status(404).json({ message: 'Gift card not found' });

    if (!giftCard.isActive || giftCard.expirationDate < Date.now()) {
      return res.status(400).json({ message: 'Gift card is inactive or expired' });
    }

    if (giftCard.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance on gift card' });
    }

    if (!req.user.giftCards.includes(giftCard._id)) {
      return res.status(403).json({ message: 'You are not authorized to use this gift card' });
    }

    giftCard.balance -= amount;

    if (giftCard.balance === 0) {
      giftCard.isActive = false;
    }

    await giftCard.save();

    res.status(200).json({
      message: 'Gift card redeemed successfully',
      remainingBalance: giftCard.balance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const fetchGiftCards = async (req, res) => {
    try {
      const giftCards = await GiftCard.find();
      console.log(giftCards); // Log the fetched gift cards
      res.status(200).json(giftCards);
    } catch (error) {
      console.error(error); // Log any errors
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  export const getMyGiftCards = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate('giftCards');
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.status(200).json(user.giftCards);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };