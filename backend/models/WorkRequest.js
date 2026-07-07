import mongoose from 'mongoose';

const workRequestSchema = new mongoose.Schema({
  hirerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  categoryId: { type: String, required: true },
  workerType: { type: String, required: true },
  buildingType: { type: String, enum: ['Corporate', 'Residential', 'High Rise'], required: true },
  location: { type: String, default: "Not specified" },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  budgetMin: { type: Number, default: 0 },
  budgetMax: { type: Number, default: 0 },
  description: { type: String, default: "" },
  status: { type: String, enum: ['OPEN', 'ACCEPTED', 'CLOSED'], default: 'OPEN' },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export default mongoose.model('WorkRequest', workRequestSchema);
