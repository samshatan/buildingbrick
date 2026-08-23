import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  googleSubject: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true, trim: true },
  password: { type: String, required: true },
  accountType: { type: String, enum: ['worker', 'hirer', 'cafe', 'admin'], required: true },
  avatarUrl: { type: String, default: "" },
  coverImageUrl: { type: String, default: "" },
  // Cafe Location Fields (Used when accountType === 'cafe')
  address: { type: String, default: "" },
  state: { type: String, default: "" },
  district: { type: String, default: "" },
  postalCode: { type: String, default: "" },
  preferences: {
    pushNotifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false },
    biometricLogin: { type: Boolean, default: false }
  },
  pushToken: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

// Ensure at least one contact method exists
userSchema.pre('save', function(next) {
  if (!this.email && !this.phone) {
    next(new Error('Either email or phone must be provided.'));
  } else {
    next();
  }
});

export default mongoose.model('User', userSchema);
