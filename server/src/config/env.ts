import dotenv from 'dotenv';

dotenv.config();

const requiredInProduction = ['MONGODB_URI', 'JWT_SECRET'];

for (const key of requiredInProduction) {
  if (process.env.NODE_ENV === 'production' && !process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/viewcontrol',
  jwtSecret: process.env.JWT_SECRET || 'dev-viewcontrol-secret-change-me',
  dashboardOrigin: process.env.DASHBOARD_ORIGIN || 'http://localhost:5173',
  publicApiUrl: process.env.PUBLIC_API_URL || 'http://localhost:4000',
  runtimeCdnUrl: process.env.RUNTIME_CDN_URL || 'http://localhost:4000/cdn/viewcontrol.js',
};
