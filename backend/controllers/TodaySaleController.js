import Product from "../model/Product.js";
import TodaySale from "../model/TodaySale.js";

// Create a new promotion
export const createPromotion = async (req, res) => {
  try {
    const { name, type, startDate, endDate } = req.body;

    if (!name || !type || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "End date must be after start date." });
    }

    const validTypes = ["Season Sale", "Today Deal"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid promotion type." });
    }

    const newPromo = new TodaySale({
      name,
      type,
      startDate,
      endDate,
      isActive: true,
    });

    const savedPromo = await newPromo.save();
    res.status(201).json(savedPromo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign a promotion to multiple products
export const assignPromotionToProducts = async (req, res) => {
  try {
    const { promotionId, productIds } = req.body;

    if (!promotionId || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "Promotion ID and product IDs are required." });
    }

    await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { promotion: promotionId } }
    );

    res.status(200).json({ message: "Products updated with promotion." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products for active promotion by type (dynamic route)
// Get Active Promotion Products
export const getActivePromotionProducts = async (req, res) => {
    try {
      const { type } = req.params;
      const validTypes = ['Season Sale', 'Today Deal'];
  
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid promotion type." });
      }
  
      const today = new Date();
      const promotion = await TodaySale.findOne({
        type,
        startDate: { $lte: today },
        endDate: { $gte: today },
        isActive: true,
      });
  
      if (!promotion) {
        return res.status(404).json({ message: `No active ${type} promotion.` });
      }
  
      const products = await Product.find({ promotion: promotion._id }).populate('promotion');
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Get all promotions
export const getAllPromotions = async (req, res) => {
  try {
    const promotions = await TodaySale.find().sort({ startDate: -1 });
    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products with any promotion assigned
export const getAllProductsWithPromotion = async (req, res) => {
  try {
    const products = await Product.find({ promotion: { $ne: null } })
      .populate("promotion")
      .exec();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
