import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const testDb = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/brickourhouse');
  const users = await User.find({});
  console.log('All Users in DB:');
  users.forEach(u => console.log(`- ${u.name} (${u.email}) | Type: ${u.accountType}`));
  process.exit();
};

testDb();
