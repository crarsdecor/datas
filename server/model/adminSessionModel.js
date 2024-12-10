import mongoose from 'mongoose';

const adminSessionSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  ipAddress: { type: String },
  deviceDetails: { type: String }, // Optional: Capture device/browser info
}, { timestamps: true });

export const AdminSession = mongoose.model('AdminSession', adminSessionSchema);
