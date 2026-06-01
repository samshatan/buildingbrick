import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  identifier: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true
  },
  otp: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 300 // Document automatically deleted after 5 minutes (300 seconds)
  }
});

export default mongoose.model('Otp', otpSchema);
