import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from backend/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User.js';
import WorkerProfile from '../models/WorkerProfile.js';
import WorkRequest from '../models/WorkRequest.js';
import Job from '../models/Job.js';
import Material from '../models/Material.js';

const removeDummyData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/brickourhouse');
    console.log('Connected to MongoDB.');

    // 1. Delete Dummy Materials
    const matResult = await Material.deleteMany({ name: { $regex: '^\\[DUMMY\\]' } });
    console.log(`Deleted ${matResult.deletedCount} dummy materials.`);

    // 2. Find Dummy Workers
    const dummyWorkers = await User.find({ email: { $regex: '^dummy_' } });
    const dummyWorkerIds = dummyWorkers.map(w => w._id);

    if (dummyWorkerIds.length > 0) {
      // 3. Delete Worker Profiles for these dummy workers
      const wpResult = await WorkerProfile.deleteMany({ userId: { $in: dummyWorkerIds } });
      console.log(`Deleted ${wpResult.deletedCount} dummy worker profiles.`);

      // 4. Delete Jobs associated with these dummy workers
      const jobResult = await Job.deleteMany({ workerId: { $in: dummyWorkerIds } });
      console.log(`Deleted ${jobResult.deletedCount} dummy jobs.`);

      // 5. Delete Dummy Workers
      const userResult = await User.deleteMany({ _id: { $in: dummyWorkerIds } });
      console.log(`Deleted ${userResult.deletedCount} dummy users.`);
    } else {
      console.log('No dummy workers found to delete.');
    }

    // 6. Delete Work Requests with [DUMMY] in title
    const wrResult = await WorkRequest.deleteMany({ title: { $regex: '^\\[DUMMY\\]' } });
    console.log(`Deleted ${wrResult.deletedCount} dummy work requests.`);

    console.log('\n--- CLEANUP COMPLETE ---');
    console.log('All dummy data has been removed from the database.');

  } catch (error) {
    console.error('Error removing dummy data:', error);
  } finally {
    mongoose.disconnect();
  }
};

removeDummyData();
