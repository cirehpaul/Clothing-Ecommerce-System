import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';
import productsRoutes from './routes/products';
import categoriesRoutes from './routes/categories';
import bannersRoutes from './routes/banners';
import dashboardRoutes from './routes/dashboard';
import ordersRoutes from './routes/orders';
import pagesRoutes from './routes/pages';
import couponsRoutes from './routes/coupons';
import customersRoutes from './routes/customers';
import paymentsRoutes from './routes/payments';
import reportsRoutes from './routes/reports';
import inventoryRoutes from './routes/inventory';
import storeRoutes from './routes/store';

const app = new Hono();

app.use('*', logger());
app.use(
  '*',
  cors({
    origin: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'https://admin-cms-vert.vercel.app',
      'https://timeless-selection.vercel.app',
      'https://public-web-ten-brown.vercel.app',
    ],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  })
);

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes
app.route('/api/auth', authRoutes);
app.route('/api/products', productsRoutes);
app.route('/api/categories', categoriesRoutes);
app.route('/api/banners', bannersRoutes);
app.route('/api/store', storeRoutes);

// Admin routes
app.route('/api/admin/upload', uploadRoutes);
app.route('/api/dashboard', dashboardRoutes);
app.route('/api/orders', ordersRoutes);
app.route('/api/pages', pagesRoutes);
app.route('/api/coupons', couponsRoutes);
app.route('/api/customers', customersRoutes);
app.route('/api/payments', paymentsRoutes);
app.route('/api/reports', reportsRoutes);
app.route('/api/inventory', inventoryRoutes);

export default app;
