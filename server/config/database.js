import mongoose from 'mongoose';
import config from './index.js';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(config.MONGO_URI);

    console.log(`MongoDB Connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
};

export default connectDB;