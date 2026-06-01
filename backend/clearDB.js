import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const clearDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
      console.log(`Collection ${collection.collectionName} dropped.`);
    }

    console.log('All data deleted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDb();
