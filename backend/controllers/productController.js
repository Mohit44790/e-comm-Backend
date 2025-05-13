import mongoose from 'mongoose';
import { uploadToCloudinaryDirect } from "../middlewares/cloudinaryMiddleware.js";
import Order from "../model/Order.js";

import Product from "../model/Product.js";
import slugify from "slugify";
import User from "../model/User.js";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";


export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      brand,
      discount,
      stock,
      colors,
      sizes,
      isFeatured,
    } = req.body;

    // Find category and brand by name
    // const categoryDoc = await Category.findOne({ name: category});
    // const brandDoc = await Brand.findOne({ name: brand });
    const categoryDoc = await Category.findById(category);
const brandDoc = await Brand.findById(brand);

    if (!categoryDoc || !brandDoc) {
      return res.status(400).json({ message: "Invalid category or brand name" });
    }

    const slug = slugify(name);
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadToCloudinaryDirect(file, 'products');
        imageUrls.push(uploaded.secure_url);
      }
    }

    const product = new Product({
      name,
      slug,
      price,
      description,
      category: categoryDoc._id,
      brand: brandDoc._id,
      discount,
      stock,
      colors,
      sizes,
      isFeatured,
      images: imageUrls,
    });

    await product.save();
    res.status(201).json({ success: true, product });

  } catch (error) {
    console.error("Create product error:", error);
    res.status(400).json({
      success: false,
      message: "Product creation failed",
      error: error.message,
    });
  }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("brand")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch products", error });
  }
};





// Fetch filtered products by category hierarchy and filters
export const getFilteredProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, colors, sizes, main, parent } = req.query;
    const filter = {};
    const query = {};

    if (filter.category) {
      if (Array.isArray(filter.category)) {
        query.category = { $in: filter.category };
      } else {
        query.category = filter.category;
      }
    }
    
    
    
    // CATEGORY
    // if (category) {
    //   const cat = await Category.findOne({ slug: category });
    //   if (cat) filter.category = cat._id;
    //   else console.log("Category not found for slug:", category);
    // }

    if (category) {
  const categorySlugs = category.split(','); // convert "women-fashion,women-clothes" → ["women-fashion", "women-clothes"]
  const categories = await Category.find({ slug: { $in: categorySlugs } });

  if (categories.length > 0) {
    const categoryIds = categories.map(cat => cat._id);
    filter.category = { $in: categoryIds };
  } else {
    console.log("No categories found for slugs:", categorySlugs);
  }
}


    // BRAND
    if (brand) {
      query.brand = { $regex: new RegExp(brand.trim(), 'i') };

      const br = await Brand.findOne({ slug: brand });
      if (br) filter.brand = br._id;
      else console.log("Brand not found for slug:", brand);
    }

    // CATEGORY TYPE (main/parent/child)
    if (main) {
      const cats = await Category.find({ type: main });
      const ids = cats.map(c => c._id);
      filter.category = { $in: ids };
    }

    // PARENT CATEGORY
    if (parent) {
      const parentCat = await Category.findOne({ slug: parent });
      if (parentCat) {
        const cats = await Category.find({ parent: parentCat._id });
        const ids = cats.map(c => c._id);
        if (filter.category) {
          // Merge with existing category filter
          filter.category.$in = [...(filter.category.$in || []), ...ids];
        } else {
          filter.category = { $in: ids };
        }
      }
    }

    // PRICE RANGE
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // COLORS
    if (colors) filter.colors = { $in: colors.split(',') };

    // SIZES
    if (sizes) filter.sizes = { $in: sizes.split(',') };

    console.log("Final Filter Used:", filter);

    const products = await Product.find(filter)
      .populate("brand")
      .populate("category");

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    res.status(500).json({ error: error.message });
  }
};





// GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("brand")
      .populate("promotion");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log incoming request body
    console.log("Request file:", req.file); // Log incoming file

    const updates = req.body;
    if (updates.name) {
      updates.slug = slugify(updates.name);
    }

    let imageUrl = "";
    if (req.imageUrl) {
      updates.images = [req.imageUrl]; // Replace with new image
    }
    if (req.file) {
      console.log("Uploading image to Cloudinary...");
      const upload = await uploadToCloudinaryDirect(req.file, 'products');
      console.log("Image uploaded:", upload.secure_url);
      imageUrl = upload.secure_url;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    console.log("Updated product:", product); // Log the updated product
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Failed to update product", error: error.message });
  }
};


// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to delete product", error });
  }
};

// FEATURED PRODUCTS
export const getFeaturedProducts = async (req, res) => {
  try {
    const featured = await Product.find({ isFeatured: true }).limit(10);
    res.status(200).json({ success: true, featured });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};


export const getAdminStats = async (req, res) => {
  try {
    // Fetch all orders
    const orders = await Order.find();

    // Calculate total sales
    const totalSales = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
    

    const totalOrders = orders.length;
   
    const dispatchedOrders = orders.filter(order =>
      ['Shipped', 'Delivered', 'Arriving'].includes(order.orderStatus)
    ).length;
    const pendingOrders = orders.filter(order =>
      order.orderStatus === 'Processing'
    ).length;

    // Users and Products count
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    return res.status(200).json({
      totalSales,
      totalOrders,
      pendingOrders,
      dispatchedOrders,
      totalUsers,
      totalProducts,
    });
  } catch (error) {
    console.error('Error getting admin stats:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};


// controller for category name search
export const categoryName = async (req, res) => {
  try {
    const { categoryName } = req.params;
    console.log("Searching for category:", categoryName);

    // Find the category document by slug
    const category = await Category.findOne({ slug: categoryName.toLowerCase() });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Find products with that category ID
    const products = await Product.find({ category: category._id })
      .populate('category') // populate the category details
      .populate('brand')     // if you want brand info also
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



