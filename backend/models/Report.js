import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['User', 'Job', 'Review', 'Other'],
      default: 'User'
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'targetModel'
    },
    targetModel: {
      type: String,
      required: true,
      enum: ['User', 'Job', 'Review', 'WorkerProfile']
    },
    targetName: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Resolved', 'Dismissed'],
      default: 'Pending'
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reporterName: {
      type: String,
      required: true
    },
    adminNotes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
