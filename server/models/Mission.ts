import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  missionId: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  location: { type: String, required: true },
  victims: { type: Number, default: 0 },
  status: { type: String, enum: ['Completed', 'In Progress', 'Aborted'], default: 'Completed' },
  disasterType: { type: String, default: 'Search & Rescue' },
  successRate: { type: Number, default: 100 }
});

export const Mission = mongoose.model('Mission', missionSchema);
