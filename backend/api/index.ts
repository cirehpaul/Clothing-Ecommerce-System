import { handle } from 'hono/vercel';
import { Hono } from 'hono';

let appToHandle;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { default: app } = require('../src/index');
  appToHandle = app;
} catch (error: any) {
  appToHandle = new Hono();
  appToHandle.all('*', (c: any) => c.json({
    success: false,
    error: 'Failed to initialize app',
    details: error.message,
    stack: error.stack
  }, 500));
}

export default handle(appToHandle);
