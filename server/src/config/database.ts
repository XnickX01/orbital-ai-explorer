import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.DATABASE_URL;
    
    if (!mongoUrl) {
      throw new Error('DATABASE_URL environment variable is not defined');
    }

    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
    throw error;
  }
};
