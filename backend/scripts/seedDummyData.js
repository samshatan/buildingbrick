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

const TARGET_PHONE = '7903516362';

const seedDummyData = async () => {
  try {
    // 1. Connect to MongoDB
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/brickourhouse');
    console.log('Connected to MongoDB.');

    // 2. Find the target user
    const targetUser = await User.findOne({ phone: TARGET_PHONE });
    if (!targetUser) {
      console.error(`User with phone ${TARGET_PHONE} not found. Cannot assign dummy jobs.`);
      process.exit(1);
    }
    console.log(`Found target user: ${targetUser.name} (${targetUser._id})`);

    // 3. Create Dummy Workers
    console.log('Creating dummy workers...');
    const workerData = [
      { name: '[DUMMY] John the Plumber', email: 'dummy_john@example.com', category: 'utilities', role: 'LABOUR', skills: 'Plumbing, Piping' },
      { name: '[DUMMY] Mike the Mason', email: 'dummy_mike@example.com', category: 'construction', role: 'LABOUR', skills: 'Bricklaying, Cement' },
      { name: '[DUMMY] Sarah the Painter', email: 'dummy_sarah@example.com', category: 'interior', role: 'LABOUR', skills: 'Painting, Texturing' }
    ];

    const dummyWorkers = [];
    for (const w of workerData) {
      // Check if exists to avoid duplicates if run multiple times
      let user = await User.findOne({ email: w.email });
      if (!user) {
        user = await User.create({
          name: w.name,
          email: w.email,
          password: 'hashed_dummy_password', // Doesn't matter, won't log in
          accountType: 'worker',
          avatarUrl: 'https://i.pravatar.cc/150?u=' + w.email
        });

        await WorkerProfile.create({
          userId: user._id,
          displayName: w.name,
          categoryId: w.category,
          workerType: w.category,
          workerRole: w.role,
          registrationFeePaid: true,
          registrationFeeAmount: 19,
          subscriptionStatus: 'ACTIVE',
          dailyRate: 800,
          experienceYears: 5,
          bio: 'This is a dummy worker generated for testing.',
          skills: w.skills
        });
      }
      dummyWorkers.push(user);
    }
    console.log(`Created ${dummyWorkers.length} dummy workers.`);

    // 4. Create Dummy Jobs (assigned to the target user)
    console.log('Creating dummy jobs for target user...');
    
    // Create a REQUESTED job
    let request1 = await WorkRequest.create({
      hirerUserId: targetUser._id,
      title: '[DUMMY] Fix Kitchen Pipes',
      description: 'The sink is leaking and needs pipe replacement.',
      location: '123 Main St, New Delhi',
      categoryId: 'utilities',
      workerType: 'Plumber',
      buildingType: 'Residential',
      status: 'OPEN',
      images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=500&auto=format&fit=crop']
    });
    // For requested jobs, we often don't have a Job document yet, it sits in WorkRequest.
    // Wait, the frontend code maps `status === 'REQUESTED'`. So let's create a Job that is REQUESTED.
    // Wait, the Job schema only allows 'ONGOING' or 'COMPLETED'. We will map WorkRequest directly if needed, but let's just make 'ONGOING' and 'COMPLETED'.

    const job1 = await Job.create({
      requestId: request1._id,
      workerId: dummyWorkers[0]._id,
      hirerUserId: targetUser._id,
      agreedRate: 1500,
      status: 'ONGOING'
    });

    // Create a COMPLETED job
    let request2 = await WorkRequest.create({
      hirerUserId: targetUser._id,
      title: '[DUMMY] Paint Living Room',
      description: 'Need the entire living room painted white.',
      location: '123 Main St, New Delhi',
      categoryId: 'interior',
      workerType: 'Painter',
      buildingType: 'Residential',
      status: 'CLOSED',
      images: ['https://images.unsplash.com/photo-1562184552-997c461abbe6?q=80&w=500&auto=format&fit=crop']
    });
    const job2 = await Job.create({
      requestId: request2._id,
      workerId: dummyWorkers[2]._id,
      hirerUserId: targetUser._id,
      agreedRate: 4000,
      status: 'COMPLETED'
    });

    console.log('Created dummy jobs.');

    // 5. Create Dummy Materials
    console.log('Creating dummy materials...');
    const materialsCount = await Material.countDocuments({ name: { $regex: '^\\[DUMMY\\]' } });
    if (materialsCount === 0) {
      const dummyMaterials = [
        {
          name: '[DUMMY] Premium Red Bricks (Pallet)',
          category: 'BRICKS',
          image: 'https://images.unsplash.com/photo-1584857448839-a9a304895682?q=80&w=500&auto=format&fit=crop',
          description: 'High quality fired red clay bricks for construction. One pallet contains 500 bricks.',
          retailers: [
            { name: 'BuildMart', price: 3500, stock: 'In Stock', distance: '2.5 km' },
            { name: 'Local Supplier', price: 3400, stock: 'Low Stock', distance: '5.0 km' }
          ]
        },
        {
          name: '[DUMMY] Portland Cement (50kg Bag)',
          category: 'CEMENT',
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop',
          description: 'Standard grade Portland cement for general masonry and concrete work.',
          retailers: [
            { name: 'BuildMart', price: 420, stock: 'In Stock', distance: '2.5 km' },
            { name: 'City Hardware', price: 450, stock: 'In Stock', distance: '1.2 km' }
          ]
        },
        {
          name: '[DUMMY] Concrete Sand (Ton)',
          category: 'SAND',
          image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=500&auto=format&fit=crop',
          description: 'Washed concrete sand, ideal for mixing with cement.',
          retailers: [
            { name: 'River Supplies', price: 1200, stock: 'In Stock', distance: '8.0 km' }
          ]
        }
      ];
      await Material.insertMany(dummyMaterials);
      console.log('Created dummy materials.');
    } else {
      console.log('Dummy materials already exist. Skipping.');
    }

    console.log('\n--- SEEDING COMPLETE ---');
    console.log('You can now refresh your app to see the dummy data!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedDummyData();
