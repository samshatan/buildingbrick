import mongoose from 'mongoose';

const workerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  displayName: { type: String, required: true },
  categoryId: { type: String, required: true },
  workerType: { type: String, required: true },
  location: { type: String, default: "Not specified" },
  locationCoordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
  },
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
  photo: { type: String, default: "" },
  // New Onboarding Fields
  address: { type: String, default: "" }, // Present Address
  homeAddress: { type: String, default: "" }, // Permanent/Home Address
  postalCode: { type: String, default: "" },
  homePostalCode: { type: String, default: "" },
  state: { type: String, default: "" },
  homeState: { type: String, default: "" },
  district: { type: String, default: "" },
  homeDistrict: { type: String, default: "" },
  fatherName: { type: String, default: "" },
  motherName: { type: String, default: "" },
  spouseName: { type: String, default: "" },
  alternateMobile: { type: String, default: "" },
  termsAccepted: { type: Boolean, default: false },
  aadharCard: { type: String, default: "" },
  panCard: { type: String, default: "" },
  bankPassbook: { type: String, default: "" },
  onboardingFeePaid: { type: Boolean, default: false }, // Legacy field, replaced by registrationFeePaid
  // New Role & Subscription Fields
  workerRole: { type: String, enum: ['LABOUR', 'CONTRACTOR', 'SELLER', 'OTHER'], default: 'LABOUR' },
  registrationFeePaid: { type: Boolean, default: false },
  registrationFeeAmount: { type: Number, default: 0 },
  subscriptionStatus: { type: String, enum: ['FREE_UNTIL_HIRED', 'TRIAL', 'ACTIVE', 'EXPIRED', 'NONE'], default: 'NONE' },
  trialEndDate: { type: Date, default: null },
  subscriptionValidUntil: { type: Date, default: null },
  
  paymentPreference: { type: String, enum: ['ONLINE', 'OFFLINE'], default: 'ONLINE' },
  cafePaymentReceipt: { type: String, default: "" },
  verificationStatus: { type: String, enum: ['INCOMPLETE', 'PENDING', 'VERIFIED', 'REJECTED'], default: 'INCOMPLETE' },
  insuranceStatus: { type: String, enum: ['NOT_ENROLLED', 'PENDING', 'ACTIVE'], default: 'NOT_ENROLLED' },
  insuranceOptInDate: { type: Date, default: null }
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

// Performance Indexes
workerProfileSchema.index({ locationCoordinates: '2dsphere' });
workerProfileSchema.index({ categoryId: 1 });
workerProfileSchema.index({ availabilityStatus: 1 });
workerProfileSchema.index({ rating: -1 });

export default mongoose.model('WorkerProfile', workerProfileSchema);
