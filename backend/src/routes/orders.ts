import { Hono } from 'hono';
import { db } from '../db';
import { orders, orderItems } from '../db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const ordersApp = new Hono();

ordersApp.get('/', async (c) => {
  try {
    const result = await db.query.orders.findMany({
      orderBy: [desc(orders.createdAt)],
      with: { user: true, items: true, payments: true },
    });
    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch orders' }, 500);
  }
});

ordersApp.put('/:id/status', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    const [updated] = await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
    if (!updated) return c.json({ success: false, error: 'Order not found' }, 404);
    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update order' }, 500);
  }
});

ordersApp.put('/:id/tracking', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    return c.json({ success: true, data: { id, ...body } });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update tracking' }, 500);
  }
});

export default ordersApp;
