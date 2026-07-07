import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema(
  {
    requestType: { 
      type: String, 
      enum: ['WorkRequest', 'DirectRequest', 'Order'], 
      required: true 
    },
    requestId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      refPath: 'requestType'
    },
    raisedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    againstUser: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User'
    },
    reason: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED'], 
      default: 'OPEN' 
    },
    adminNotes: { 
      type: String 
    },
    resolution: { 
      type: String 
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export default mongoose.model('Dispute', disputeSchema);
