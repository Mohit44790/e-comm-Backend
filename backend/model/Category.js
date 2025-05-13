import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive: { type: Boolean, default: true },
  type: { type: String, enum: ['main', 'parent', 'child'], default: 'main' },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
