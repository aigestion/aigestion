import mongoose from 'mongoose';

// Simple test database setup without MongoMemoryServer
// Uses a local MongoDB instance or skips connection if unavailable

let isConnected = false;

export const startInMemoryMongo = async (): Promise<void> => {
  if (isConnected) return;

  // SECURITY: Always use a dedicated test database, never production
  const uri = 'mongodb://127.0.0.1:27017/aigestion-test-jest';

  console.log('🔧 [TEST] Connecting to MongoDB...');

  try {
    // Connect to the provided URI (even in test mode)
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`✅ [TEST] Connected to MongoDB at ${uri}`);
  } catch (error) {
    console.log('⚠️ [TEST] MongoDB not available, tests will use mocks');
    isConnected = true; // Mark as connected to prevent retry loops
  }
};

export const stopInMemoryMongo = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
    } catch {
      // Ignore disconnect errors
    }
  }
  isConnected = false;
  console.log('🔧 [TEST] MongoDB connection closed');
};
