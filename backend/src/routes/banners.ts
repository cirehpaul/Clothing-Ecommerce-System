import { Hono } from 'hono';
import { db } from '../db/index.js';
import { banners } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const bannersApp = new Hono();

bannersApp.get('/', async (c) => {
  try {
    const activeOnly = c.req.query('active');
    const result = activeOnly === 'true'
      ? await db.query.banners.findMany({ where: eq(banners.isActive, true), orderBy: [banners.sortOrder] })
      : await db.query.banners.findMany({ orderBy: [banners.sortOrder] });
    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch banners' }, 500);
  }
});

bannersApp.post('/', authMiddleware, adminMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const [newBanner] = await db.insert(banners).values({
      title: body.title, subtitle: body.subtitle || null, imageUrl: body.imageUrl,
      linkUrl: body.linkUrl || null, buttonText: body.buttonText || null,
      type: body.type || 'hero', sortOrder: body.sortOrder || 0, isActive: body.isActive !== false,
    }).returning();
    return c.json({ success: true, data: newBanner }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create banner' }, 500);
  }
});

bannersApp.put('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const [updated] = await db.update(banners).set({ ...body }).where(eq(banners.id, id as string)).returning();
    if (!updated) return c.json({ success: false, error: 'Banner not found' }, 404);
    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update banner' }, 500);
  }
});

bannersApp.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const [deleted] = await db.delete(banners).where(eq(banners.id, id as string)).returning();
    if (!deleted) return c.json({ success: false, error: 'Banner not found' }, 404);
    return c.json({ success: true, data: { message: 'Banner deleted' } });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to delete banner' }, 500);
  }
});

export default bannersApp;
