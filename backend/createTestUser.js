import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const createTestUser = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const testEmail = 'google-review@brickourhouse.app';
    const testPassword = 'Password123!';
    const testPhone = '9999999999';

    // Check if user already exists
    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      console.log('Test user already exists:', testEmail);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testPassword, salt);

    const newUser = new User({
      name: 'Google Reviewer',
      email: testEmail,
      phone: testPhone,
      password: hashedPassword,
      accountType: 'hirer', // They can test as a hirer or we can make one for worker too if needed
    });

    await newUser.save();
    console.log('Successfully created test user!');
    console.log(`Email: ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    console.log(`Phone: ${testPhone}`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();
