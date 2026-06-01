import mongoose from 'mongoose';

const directRequestSchema = new mongoose.Schema({
  hirerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workerProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkerProfile', required: true },
  hirerPhone: { type: String, required: true },
  hirerAddress: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
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
  }
});

export default mongoose.model('DirectRequest', directRequestSchema);
