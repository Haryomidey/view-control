import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

const app = createApp();

const start = async () => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`[api] ViewControl API listening on http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  console.error('[api] Failed to start server', error);
  process.exit(1);
});
