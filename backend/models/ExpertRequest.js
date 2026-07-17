import mongoose from 'mongoose';

const expertRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  projectDetails: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
  },
  adminNotes: {
    type: String,
  }
}, { timestamps: true });

export default mongoose.model('ExpertRequest', expertRequestSchema);
