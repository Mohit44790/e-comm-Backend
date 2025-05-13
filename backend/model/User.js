import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  pincode: { type: String, required: true },
  addressLine: { type: String, required: true },
  landmark: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
  },

  profileImage: {
    type: String, // Cloudinary URL
    default: "https://res.cloudinary.com/default-user-image.png"
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  addresses: [addressSchema],

  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      name:{type:String},
      description:{type:String},
      colors: [String],
      sizes: [String],
      price: { type: Number, required: true },
      images:[String],
    },
  ],
  viewedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

  giftCards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "GiftCard",
  }],

  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    }

  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
