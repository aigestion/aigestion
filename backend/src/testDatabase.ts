import mongoose from 'mongoose';

let mongod: any = null;

export const startInMemoryMongo = async (): Promise<void> => {
    // Mock implementation for now - skip actual MongoDB setup
    console.log('🔧 [TEST] Mock MongoDB setup - skipping actual connection');
    process.env.MONGO_URI = 'mongodb://localhost:27017/test-db';
};

export const stopInMemoryMongo = async (): Promise<void> => {
    console.log('🔧 [TEST] Mock MongoDB teardown - skipping actual disconnection');
    mongod = null;
};
