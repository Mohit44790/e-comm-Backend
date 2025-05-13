import Suggestion from "../model/Suggested.js";
import Product from "../model/Product.js";
import Brand from "../model/Brand.js"; // Make sure it's imported
import Category from "../model/Category.js";

// Save search keyword and get suggestions
export const handleSearch = async (req, res) => {
  try {
    const { keyword } = req.body;
    const userId = req.user?._id;

    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const trimmedKeyword = keyword.trim().toLowerCase();
    const regexStart = new RegExp(`^${trimmedKeyword}`, 'i');  // begins with
    const regexAnywhere = new RegExp(trimmedKeyword, 'i');     // anywhere

    // Match brands, categories
    const matchingBrandsStart = await Brand.find({ name: regexStart });
    const matchingBrandsAnywhere = await Brand.find({ name: regexAnywhere });

    const matchingCategoriesStart = await Category.find({ name: regexStart });
    const matchingCategoriesAnywhere = await Category.find({ name: regexAnywhere });

    const brandIds = [
      ...new Set([...matchingBrandsStart, ...matchingBrandsAnywhere].map(b => b._id)),
    ];
    const categoryIds = [
      ...new Set([...matchingCategoriesStart, ...matchingCategoriesAnywhere].map(c => c._id)),
    ];

    // Match products: priority on name first
    const productMatches = await Product.find({
      $or: [
        { name: regexStart },
        { name: regexAnywhere },
        { description: regexAnywhere },
        { brand: { $in: brandIds } },
        { category: { $in: categoryIds } },
      ],
    })
      .populate("brand category")
      .limit(15);

    // Save user's keyword
    if (userId) {
      const existing = await Suggestion.findOne({ user: userId });

      if (existing) {
        if (!existing.keywords.includes(trimmedKeyword)) {
          existing.keywords.push(trimmedKeyword);
        }
        existing.suggestedProducts = productMatches.map((p) => p._id);
        await existing.save();
      } else {
        await Suggestion.create({
          user: userId,
          keywords: [trimmedKeyword],
          suggestedProducts: productMatches.map((p) => p._id),
        });
      }
    }

    res.json({
      products: productMatches,
      brands: matchingBrandsStart.concat(matchingBrandsAnywhere),
      categories: matchingCategoriesStart.concat(matchingCategoriesAnywhere),
    });
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};

// Get user suggestions
export const getUserSuggestions = async (req, res) => {
  try {
    const suggestion = await Suggestion.findOne({ user: req.user._id }).populate("suggestedProducts");

    if (!suggestion) return res.status(404).json({ message: "No suggestions found" });

    res.json(suggestion);
  } catch (err) {
    res.status(500).json({ message: "Failed to get suggestions", error: err.message });
  }
};

// New API for live suggestions only
export const getLiveSuggestions = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) return res.status(400).json({ message: "Keyword is required" });

    const regex = new RegExp(keyword, "i");

    const matchingBrands = await Brand.find({ name: regex }).limit(5);
    const matchingCategories = await Category.find({ name: regex }).limit(5);
    const brandIds = matchingBrands.map(b => b._id);
    const categoryIds = matchingCategories.map(c => c._id);

    const matchingProducts = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
        { brand: { $in: brandIds } },
        { category: { $in: categoryIds } },
      ],
    }).limit(5);

    res.json({
      products: matchingProducts,
      brands: matchingBrands,
      categories: matchingCategories,
    });
  } catch (err) {
    res.status(500).json({ message: "Live suggestion failed", error: err.message });
  }
};

