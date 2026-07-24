import { Hono } from 'hono';
import { db } from '../db/index.js';
import { payments } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const paymentsApp = new Hono();

paymentsApp.get('/pending', async (c) => {
  try {
    const result = await db.query.payments.findMany({
      where: eq(payments.status, 'pending'),
      with: { order: true },
    });
    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch payments' }, 500);
  }
});

paymentsApp.put('/:id/verify', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const [updated] = await db.update(payments).set({ status: 'verified', verifiedAt: new Date() }).where(eq(payments.id, id)).returning();
    if (!updated) return c.json({ success: false, error: 'Payment not found' }, 404);
    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to verify payment' }, 500);
  }
});

paymentsApp.put('/:id/reject', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const [updated] = await db.update(payments).set({ status: 'rejected' }).where(eq(payments.id, id)).returning();
    if (!updated) return c.json({ success: false, error: 'Payment not found' }, 404);
    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to reject payment' }, 500);
  }
});

export default paymentsApp;
