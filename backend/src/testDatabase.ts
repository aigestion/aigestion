import mongoose from 'mongoose';
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod: any = null;

export const startInMemoryMongo = async (): Promise<void> => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGO_URI = uri;
    await mongoose.connect(uri);
};

export const stopInMemoryMongo = async (): Promise<void> => {
    if (mongod) {
        await mongoose.disconnect();
        await mongod.stop();
        mongod = null;
    }
};
