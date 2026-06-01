import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkRequest', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hirerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agreedRate: { type: Number, required: true },
  status: { type: String, enum: ['ONGOING', 'COMPLETED'], default: 'ONGOING' },
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

export default mongoose.model('Job', jobSchema);
