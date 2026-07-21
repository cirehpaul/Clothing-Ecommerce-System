import { serve } from '@hono/node-server';
import app from './src/index';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
console.log(`Local server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
