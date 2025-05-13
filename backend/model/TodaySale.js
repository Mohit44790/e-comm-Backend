import mongoose from 'mongoose';

const todaySaleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Season Sale', 'Today Deal'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('TodaySale', todaySaleSchema);
