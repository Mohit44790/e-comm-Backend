import mongoose from "mongoose";

const visitedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  visitedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model("Visited", visitedSchema);
