import mongoose from 'mongoose';
import { MONGO_URI } from '../config/config.js';
import { promises as dns } from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // exits the process with failure code to avoid running server without database connection
  }
};

export default connectDB;
