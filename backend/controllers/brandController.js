import slugify from 'slugify';
import { uploadToCloudinaryDirect } from '../middlewares/cloudinaryMiddleware.js';
import Brand from '../model/Brand.js';


const createSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

// Create brand
export const createBrand = async (req, res) => {
  try {
    const { name, categories, logo } = req.body;
    const slug = slugify(name, { lower: true });

    const existing = await Brand.findOne({ slug });
    if (existing) return res.status(400).json({ message: 'Brand already exists' });

    const brand = await Brand.create({ name, slug, categories, logo });
    res.status(201).json({ brand });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create brand', error });
  }
};

// Get all brands
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).populate('categories');
    res.status(200).json(brands);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch brands" });
  }
};

// Get single brand
export const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id).populate('categories');
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.status(200).json(brand);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch brand" });
  }
};

// Get brands by category
export const getBrandsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const brands = await Brand.find({ categories: categoryId }).populate('categories');
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch brands', error });
  }
};
// Update brand
export const updateBrand = async (req, res) => {
  try {
    const { name, slug, categories } = req.body;
    const brandId = req.params.id;

    const updateData = {
      name,
      slug,
      categories: JSON.parse(categories), // if categories sent as JSON string
    };

    if (req.file) {
      updateData.logo = req.file.path; // or uploaded URL if using Cloudinary
    }

    const updated = await Brand.findByIdAndUpdate(brandId, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete brand
export const deleteBrand = async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) return res.status(404).json({ message: 'Brand not found' });
    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete brand" });
  }
};
export const productsByBrandSlug = async (req, res) => {
  const { brandSlug } = req.params;
  const brand = await Brand.findOne({ slug: brandSlug });
  if (!brand) return res.status(404).json({ message: "Brand not found" });

  const products = await Product.find({ brand: brand._id }).populate('category');
  res.json({ success: true, products });
};


