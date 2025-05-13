import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  discount: Number,
  stock: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'TodaySale', default: null, index: true },

  images: [String], // Array of Cloudinary image URLs
  colors: [String],
  sizes: [String],
  sold: { type: Number, default: 0 },
  ratingsAverage: { type: Number, default: 0 },
  ratingsCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
