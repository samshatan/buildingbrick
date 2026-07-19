import mongoose from "mongoose";

const vBankRequestSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  workerName: { type: String, required: true },
  workerPhone: { type: String, default: "" },
  workerEmail: { type: String, default: "" },
  aadhaarNumber: { type: String, required: true },
  panNumber: { type: String, default: "" },
  bankPreference: { type: String, default: "No Preference" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  adminNotes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
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
  toObject: { virtuals: true }
});

vBankRequestSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("VBankRequest", vBankRequestSchema);
