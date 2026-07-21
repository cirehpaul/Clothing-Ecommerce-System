import { Hono } from 'hono';
import { db } from '../db';
import { coupons } from '../db/schema';
import { eq } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const couponsApp = new Hono();

couponsApp.get('/', async (c) => {
  try {
    const result = await db.query.coupons.findMany();
    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch coupons' }, 500);
  }
});

couponsApp.post('/', authMiddleware, adminMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const [newCoupon] = await db.insert(coupons).values({
      code: body.code,
      description: body.description || null,
      type: body.type || 'percentage',
      value: body.value?.toString() || '0',
      minPurchase: body.minPurchase?.toString() || null,
      maxDiscount: body.maxDiscount?.toString() || null,
      usageLimit: body.usageLimit || null,
      startsAt: body.startsAt ? new Date(body.startsAt) : null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      isActive: body.isActive !== false,
    }).returning();
    return c.json({ success: true, data: newCoupon }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create coupon' }, 500);
  }
});

export default couponsApp;
