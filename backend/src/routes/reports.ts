import { Hono } from 'hono';
import { db } from '../db/index.js';
import { orders, products } from '../db/schema.js';
import { desc, sql } from 'drizzle-orm';

const reportsApp = new Hono();

reportsApp.get('/sales', async (c) => {
  try {
    return c.json({ success: true, data: [] });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch sales' }, 500);
  }
});

reportsApp.get('/top-products', async (c) => {
  try {
    const topProducts = await db.query.products.findMany({
      orderBy: [desc(products.totalReviews)],
      limit: 10,
      with: { images: true },
    });
    return c.json({ success: true, data: topProducts });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch top products' }, 500);
  }
});

export default reportsApp;
