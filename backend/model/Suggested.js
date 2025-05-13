import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  keywords: [String],
  suggestedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  }],
}, { timestamps: true });

export default mongoose.model("Suggestion", suggestionSchema);
