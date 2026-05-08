import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['warning', 'critical', 'info'], default: 'info' },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
});

export const Alert = mongoose.model('Alert', AlertSchema);
