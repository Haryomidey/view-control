import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { rateLimit } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/projects.routes.js';
import controlRoutes from './routes/controls.routes.js';
import bannerRoutes from './routes/banners.routes.js';
import runtimeRoutes from './routes/runtime.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const runtimeDistPath = path.resolve(__dirname, '../..', 'packages/runtime/dist');

const corsOptionsDelegate = (req, callback) => {
  const isRuntimeRequest = req.path.startsWith('/api/runtime') || req.path.startsWith('/cdn');

  callback(null, {
    origin(origin, originCallback) {
      if (!origin) {
        return originCallback(null, true);
      }

      if (isRuntimeRequest || env.dashboardOrigins.includes(origin) || env.nodeEnv !== 'production') {
        return originCallback(null, true);
      }

      return originCallback(null, false);
    },
    credentials: !isRuntimeRequest,
  });
};

export const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(compression());
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
  app.use(express.json({ limit: '200kb' }));
  app.use(express.urlencoded({ extended: true, limit: '200kb' }));

  app.use(cors(corsOptionsDelegate));

  app.get('/health', (req, res) => {
    res.json({ ok: true, data: { service: 'viewcontrol-api', status: 'healthy' } });
  });

  app.use('/cdn', express.static(runtimeDistPath, {
    immutable: true,
    maxAge: '5m',
    setHeaders(res) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    },
  }));

  app.use('/api', rateLimit({ max: 900 }));
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/controls', controlRoutes);
  app.use('/api/banners', bannerRoutes);
  app.use('/api/runtime', runtimeRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
