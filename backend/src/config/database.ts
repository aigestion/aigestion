import mongoose, { ConnectOptions } from 'mongoose';

import { logger } from '../utils/logger';
import { config } from './config';

const { mongo } = config;

const connectOptions: ConnectOptions = {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '150'), // Increased for high concurrency
  minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '20'), // Keep more warm connections
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  waitQueueTimeoutMS: 10000,
  heartbeatFrequencyMS: 10000,
  maxIdleTimeMS: 30000,
  family: 4, // Faster IPv4 lookup
};

let isConnected = false;

export const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    logger.info('Using existing database connection');
    return;
  }

  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || mongo.uri;

    if (!uri) {
      if (process.env.NODE_ENV === 'production') {
        logger.error('CRITICAL: MONGODB_URI/MONGO_URI is missing in PRODUCTION environment.');
        throw new Error('CRITICAL_DB_URI_MISSING_PROD');
      }
      logger.warn(
        '⚠️ No MongoDB URI provided. Using local development default if available or failing.'
      );
    }

    console.error(
      `[DEBUG_DB] Attempting connection with URI: ${uri?.replace(/:([^@]+)@/, ':****@') || 'UNDEFINED'}`
    );

    if (!uri) {
      throw new Error('CORE_DB_URI_UNDEF');
    }

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
