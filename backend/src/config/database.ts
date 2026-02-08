import mongoose, { ConnectOptions } from 'mongoose';

import { logger } from '../utils/logger';
import { config } from './config';

const { mongo } = config;

const connectOptions: ConnectOptions = {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 100, // Increase pool for high concurrency
  minPoolSize: 10, // Keep warm connections
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4, // Faster IPv4 lookup
};

let isConnected = false;

export const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    logger.info('Using existing database connection');
    return;
  }

  try {
    logger.info('Connecting to MongoDB...');

    const uri = process.env.MONGO_URI || mongo.uri;
    await mongoose.connect(uri, connectOptions);

    isConnected = true;
    logger.info('Successfully connected to MongoDB');

    // Handle connection events
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected');
    });

    mongoose.connection.on('error', err => {
      logger.error(err, 'MongoDB connection error:');
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      isConnected = false;
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    const err = error as Error;
    logger.error(err, 'MongoDB connection error (Resilient Mode Active):');
    logger.warn('⚠️ SERVER STARTING WITHOUT DATABASE. SOME FEATURES WILL FAIL. ⚠️');
    // Do NOT exit process. Allow server to start for health check.
  }
};
