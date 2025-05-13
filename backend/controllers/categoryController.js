import slugify from "slugify";
import Category from "../model/Category.js"
import Brand from "../model/Brand.js";


const createSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};
// Create category
export const createCategory = async (req, res) => {
  try {
    const { name, description, parent, type } = req.body;
    const slug = slugify(name, { lower: true });

    const existing = await Category.findOne({ slug });
    if (existing) return res.status(400).json({ message: 'Category already exists' });

    const category = await Category.create({ name, slug, description, parent, type });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error });
  }
};




// Controller
export const getCategoryDetails = async (req, res) => {
  try {
    const { slug } = req.params;
    const mainCategory = await Category.findOne({ slug }).populate('parent');
    if (!mainCategory) return res.status(404).json({ message: "Category not found" });

    const subcategories = await Category.find({ parent: mainCategory._id });
    const subSubcategories = await Category.find({ parent: { $in: subcategories.map(cat => cat._id) } });
    const brands = await Brand.find({ categories: mainCategory._id, isActive: true });

    res.json({ mainCategory, subcategories, subSubcategories, brands });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category details", error });
  }
};


// Get single category
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to get category", error });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug: slugify(name), description },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error });
  }
};
