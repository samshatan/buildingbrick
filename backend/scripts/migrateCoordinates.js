import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import WorkerProfile from '../models/WorkerProfile.js';
import { geocodeAddress } from '../utils/geocode.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const migrateCoordinates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    const workers = await WorkerProfile.find({});
    console.log(`Found ${workers.length} workers to check/migrate.`);

    let updatedCount = 0;

    for (const worker of workers) {
      if (worker.location && worker.location.trim() !== '' && worker.location.toLowerCase() !== 'not specified') {
        
        // Check if coordinates are already set differently from default [0,0]
        const hasRealCoords = worker.locationCoordinates 
          && worker.locationCoordinates.coordinates 
          && worker.locationCoordinates.coordinates[0] !== 0 
          && worker.locationCoordinates.coordinates[1] !== 0;

        if (!hasRealCoords) {
          console.log(`Geocoding location for worker: ${worker.displayName} (${worker.location})`);
          const coords = await geocodeAddress(worker.location);
          if (coords) {
            worker.locationCoordinates = {
              type: 'Point',
              coordinates: [coords.lng, coords.lat]
            };
            await worker.save();
            console.log(` - Successfully updated coordinates for ${worker.displayName}`);
            updatedCount++;
            
            // Sleep for a second to avoid hitting Nominatim rate limits (1 request per second max)
            await new Promise(resolve => setTimeout(resolve, 1500));
          } else {
            console.log(` - Could not find coordinates for location: ${worker.location}`);
          }
        } else {
          console.log(`Worker ${worker.displayName} already has valid coordinates.`);
        }
      }
    }

    console.log(`Migration completed. Updated ${updatedCount} worker profiles.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateCoordinates();
