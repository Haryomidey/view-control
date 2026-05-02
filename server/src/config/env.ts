import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/viewcontrol';
const mongodbDnsServers = process.env.MONGODB_DNS_SERVERS
  ? process.env.MONGODB_DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean)
  : mongoUri.startsWith('mongodb+srv://')
    ? ['1.1.1.1', '8.8.8.8']
    : [];

const requiredInProduction = ['MONGODB_URI', 'JWT_SECRET'];

for (const key of requiredInProduction) {
  if (process.env.NODE_ENV === 'production' && !process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri,
  mongodbDnsServers,
  jwtSecret: process.env.JWT_SECRET || 'dev-viewcontrol-secret-change-me',
  dashboardOrigin: process.env.DASHBOARD_ORIGIN || 'http://localhost:5173',
  dashboardOrigins: (process.env.DASHBOARD_ORIGINS || process.env.DASHBOARD_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  publicApiUrl: process.env.PUBLIC_API_URL || 'http://localhost:4000',
  runtimeCdnUrl: process.env.RUNTIME_CDN_URL || 'http://localhost:4000/cdn/viewcontrol.js',
};
