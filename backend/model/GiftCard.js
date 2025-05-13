import mongoose from "mongoose";

const giftCardSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true, // Ensures uniqueness for each gift card code
    trim: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model("GiftCard", giftCardSchema);
