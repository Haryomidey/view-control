import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './env.js';

export const connectDatabase = async () => {
  if (env.mongodbDnsServers.length > 0) {
    dns.setServers(env.mongodbDnsServers);
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== 'production',
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 8000,
  });

  console.log(`[api] MongoDB connected: ${mongoose.connection.name}`);
};
