import mongoose from 'mongoose';

const workerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  displayName: { type: String, required: true },
  categoryId: { type: String, required: true },
  workerType: { type: String, required: true },
  location: { type: String, default: "Not specified" },
  dailyRate: { type: Number, default: 0 },
  experienceYears: { type: Number, default: 0 },
  bio: { type: String, default: "" },
  skills: { type: String, default: "" },
  availabilityStatus: { type: String, enum: ['AVAILABLE', 'BUSY'], default: 'AVAILABLE' },
  verified: { type: Boolean, default: false },
  verifiedByCafeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  verifiedAt: { type: Date, default: null },
  cafePaymentStatus: { type: String, enum: ['PENDING_ADMIN_COLLECTION', 'COLLECTED_BY_ADMIN', 'COLLECTED_OFFLINE_BY_ADMIN', 'PAID_ONLINE_BY_CAFE', 'NONE'], default: 'NONE' },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 0.0 },
  jobsCompleted: { type: Number, default: 0 },
  photo: { type: String, default: "" }
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

export default mongoose.model('WorkerProfile', workerProfileSchema);
