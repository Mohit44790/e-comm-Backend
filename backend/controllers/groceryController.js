import { uploadToCloudinaryDirect, uploadVideoToCloudinary } from "../middlewares/cloudinaryMiddleware.js";
// import Brand from "../model/Brand.js";
// import Category from "../model/Category.js";
import Grocery from "../model/Grocery.js";
// import slugify from "slugify";


export const createGrocery = async (req, res) => {
  try {
    const {
      name,
      price,
      discount,
      size,
    //   category,
    //   brand,
      unit,
      quantity,
      expiryDate,
      manufactureDate,
      description,
      stock,
      isVeg,
      isNonVeg,
      isGlutenFree,
      isSugarFree,
      isDairyFree,
      isNutFree,
      isOrganic,
    } = req.body;
// Validate category and brand before use
    // const categoryDoc = await Category.findById(category);
    // const brandDoc = await Brand.findById(brand);
    
    // if (!categoryDoc || !brandDoc) {
    //     return res.status(400).json({ message: "Invalid category or brand name" });
    // }

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
       for (const file of req.files) {
  const uploaded = await uploadToCloudinaryDirect(file, 'grocery');
imageUrls.push({ url: uploaded.secure_url, public_id: uploaded.public_id });
}
    }

    
   

  const grocery = new Grocery({
  name,
  price: Number(price),
  discount: Number(discount),
  size,
  unit,
  quantity: Number(quantity),
  expiryDate: expiryDate ? new Date(expiryDate) : null,
  manufactureDate: manufactureDate ? new Date(manufactureDate) : null,
  description,
  stock: Number(stock),
  isVeg: isVeg === 'true',
  isNonVeg: isNonVeg === 'true',
  isGlutenFree: isGlutenFree === 'true',
  isSugarFree: isSugarFree === 'true',
  isDairyFree: isDairyFree === 'true',
  isNutFree: isNutFree === 'true',
  isOrganic: isOrganic === 'true',
  images: imageUrls,
});


    
    
    await grocery.save();
    res.status(201).json(grocery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const updateGrocery = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const updateData = { name, price, description };

    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const uploaded = await uploadToCloudinaryDirect(file, 'grocery');
        imageUrls.push(uploaded.secure_url);
      }
      updateData.images = imageUrls;
    }

    const updatedGrocery = await Grocery.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedGrocery) return res.status(404).json({ error: 'Grocery not found' });

    res.json(updatedGrocery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const getAllGroceries = async (req, res) => {
  try {
    const groceries = await Grocery.find();
    res.json(groceries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGroceryById = async (req, res) => {
  try {
    const grocery = await Grocery.findById(req.params.id);
    if (!grocery) {
      return res.status(404).json({ message: 'Grocery item not found' });
    }
    res.json(grocery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteGrocery = async (req, res) => {
  try {
    const deleted = await Grocery.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Grocery not found" });
    res.json({ message: "Grocery deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

