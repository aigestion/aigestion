const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Testing connection to MongoDB Atlas with provided API key...');
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('<db_password>')) {
      console.error('❌ MONGODB_URI not found or password not set in .env');
      process.exit(1);
    }
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB Atlas connection successful!');
    console.log('🚀 Database connected to:', mongoose.connection.name);
    await mongoose.disconnect();
    console.log('✅ Connection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();
