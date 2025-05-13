
import mongoose from "mongoose";

const grocerySchema = new mongoose.Schema({
  name: { type: String, required: true },
//   category: { type: String, required: true },
//   brand: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  size: { type: String, required: true },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  manufactureDate: { type: Date, required: true },
  isVeg: { type: Boolean, default: false },
  isNonVeg: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  isSugarFree: { type: Boolean, default: false },
  isDairyFree: { type: Boolean, default: false },
  isNutFree: { type: Boolean, default: false },
  isOrganic: { type: Boolean, default: false },
  
  images: [String],// New field
//   videoUrl: String, // New field
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true, min: 0, max: 5 },
      comment: { type: String, required: true },
    },
  ],
});

export default mongoose.model("Grocery", grocerySchema);