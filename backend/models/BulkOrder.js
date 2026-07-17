import mongoose from 'mongoose';

const bulkOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  materialsRequested: {
    type: String,
    required: true,
  },
  quantityDescription: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: String,
  },
  status: {
    type: String,
    enum: ['PENDING', 'QUOTED', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING',
  },
  adminNotes: {
    type: String,
  }
}, { timestamps: true });

export default mongoose.model('BulkOrder', bulkOrderSchema);
