import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async () => {
  mongoose.set('strictQuery', true);

  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== 'production',
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 8000,
  });

  console.log(`[api] MongoDB connected: ${mongoose.connection.name}`);
};
