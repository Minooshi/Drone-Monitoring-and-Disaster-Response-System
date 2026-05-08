import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Alert } from './models/Alert.ts';
import { Mission } from './models/Mission.ts';
import { User } from './models/User.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root directory if it exists
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/drone-system';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await seedData();
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

async function seedData() {
  try {
    const alertCount = await Alert.countDocuments();
    if (alertCount === 0) {
      console.log('🌱 Seeding demo alerts...');
      await Alert.insertMany([
        { title: 'Thermal Anomaly', message: 'Heat signature detected in Sector 7-G. Possible forest fire start.', type: 'critical' },
        { title: 'Battery Low', message: 'Drone RX-900 battery at 15%. Returning to base.', type: 'warning' },
        { title: 'Scan Complete', message: 'Search grid 44-A mapping finished. No victims found.', type: 'info' }
      ]);
    }

    const missionCount = await Mission.countDocuments();
    if (missionCount === 0) {
      console.log('🌱 Seeding demo missions...');
      await Mission.insertMany([
        { missionId: 'MSN-2026-001', location: 'Sector 4-B', victims: 12, status: 'Completed', successRate: 95 },
        { missionId: 'MSN-2026-002', location: 'Coastal Zone', victims: 8, status: 'Completed', successRate: 88 },
        { missionId: 'MSN-2026-003', location: 'Urban Center', victims: 24, status: 'In Progress', successRate: 92 },
        { missionId: 'MSN-2026-004', location: 'Mountain Ridge', victims: 15, status: 'Completed', successRate: 90 },
        { missionId: 'MSN-2026-005', location: 'Sector 9-F', victims: 21, status: 'Completed', successRate: 94 }
      ]);
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding demo user...');
      await User.create({
        name: 'OBSERVER',
        email: 'observer@gmail.com',
        password: 'password123', // In a real app, hash this!
        role: 'OBSERVER',
        lastLogin: new Date()
      });
    }
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Routes
app.get('/api/status', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: isConnected ? 'connected' : 'disconnected',
    database: isConnected ? 'MongoDB' : 'None',
    timestamp: new Date()
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      user.lastLogin = new Date();
      await user.save();
      res.json({ success: true, user: { name: user.name, email: user.email, role: user.role, lastLogin: user.lastLogin } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/user/profile', async (req, res) => {
  try {
    const user = await User.findOne({ email: 'observer@gmail.com' }); // Mocking current user
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

app.post('/api/user/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email: 'observer@gmail.com' }); // Mocking current user
    if (user && user.password === currentPassword) {
      user.password = newPassword;
      await user.save();
      res.json({ success: true, message: 'Password updated successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating password' });
  }
});

app.get('/api/missions', async (req, res) => {
  try {
    const missions = await Mission.find().sort({ date: -1 });
    res.json(missions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching missions', error });
  }
});

app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 });
    res.json(alerts);
  } catch (error) {
    console.warn('⚠️ Database fetch failed, returning mock data:', error.message);
    // Fallback mock data to keep UI functional
    res.json([
      { _id: 'mock1', type: 'critical', title: 'System Offline', message: 'Connecting to MongoDB Atlas... Check your connection string.', status: 'active', timestamp: new Date() },
      { _id: 'mock2', type: 'warning', title: 'Database Sync', message: 'Using local cache until cloud database is reachable.', status: 'active', timestamp: new Date() }
    ]);
  }
});


app.post('/api/alerts', async (req, res) => {
  try {
    const newAlert = new Alert(req.body);
    const savedAlert = await newAlert.save();
    res.status(201).json(savedAlert);
  } catch (error) {
    res.status(400).json({ message: 'Error creating alert', error });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});



