// models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, required: true },
  
  price: Number,
  colors: [String],
  sizes: [String],
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    phoneNumber: String,
    addressLine: String,
    city: String,
    state: String,
    pincode: String,
  },
  paymentMethod: { type: String, default: "COD" },
  totalAmount: Number,
  orderStatus: {
    type: String,
    enum: ["Processing", "Shipped", "Arriving", "Delivered", "Cancelled"],
    default: "Processing",
  },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  deliveredAt: Date,
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
