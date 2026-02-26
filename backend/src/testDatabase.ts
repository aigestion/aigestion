import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: InstanceType<typeof MongoMemoryServer> | undefined;
let isConnected = false;

export const startInMemoryMongo = async (): Promise<void> => {
  if (isConnected) return;

  try {
    // Create an actual in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    console.log(`🔧 [TEST] Connecting to MongoMemoryServer at ${uri}`);

    // propagate to env for other services (containers, DI, etc)
    process.env.MONGODB_URI = uri;
    process.env.DATABASE_URL = uri;

    // Use standard connect with stable options
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      family: 4,
    });

    isConnected = true;
    console.log('✅ [TEST] Connected to MongoMemoryServer successfully');
  } catch (error: any) {
    console.error('❌ [TEST] Failed to start MongoMemoryServer:', error);

    // Fallback if MongoMemoryServer fails (e.g., binaries missing)
    const fallbackUri = 'mongodb://127.0.0.1:27017/aigestion-test-jest';
    process.env.MONGODB_URI = fallbackUri;
    process.env.DATABASE_URL = fallbackUri;

    console.warn(`⚠️ [TEST] Using local fallback at ${fallbackUri}`);

    try {
      await mongoose.connect(fallbackUri, {
        serverSelectionTimeoutMS: 5000,
      });
      isConnected = true;
    } catch (fallbackError) {
      console.error('❌ [TEST] Global MongoDB connection failure');
      throw error;
    }
  }
};

export const stopInMemoryMongo = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  isConnected = false;
  console.log('🔧 [TEST] MongoDB connection and server closed');
};
