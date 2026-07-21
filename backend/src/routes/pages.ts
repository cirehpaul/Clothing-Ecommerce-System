import { Hono } from 'hono';
import { db } from '../db';
import { contentPages } from '../db/schema';
import { eq } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const pagesApp = new Hono();

pagesApp.get('/', async (c) => {
  try {
    const result = await db.query.contentPages.findMany();
    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch pages' }, 500);
  }
});

pagesApp.get('/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    const page = await db.query.contentPages.findFirst({ where: eq(contentPages.slug, slug) });
    if (!page) return c.json({ success: false, error: 'Page not found' }, 404);
    return c.json({ success: true, data: page });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch page' }, 500);
  }
});

pagesApp.post('/', authMiddleware, adminMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const slug = body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `page-${Date.now()}`;
    const [newPage] = await db.insert(contentPages).values({
      title: body.title,
      slug,
      content: body.content || '',
      isPublished: body.isPublished !== false,
    }).returning();
    return c.json({ success: true, data: newPage }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create page' }, 500);
  }
});

pagesApp.put('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const updateData: any = { updatedAt: new Date() };
    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.isPublished !== undefined) updateData.isPublished = body.isPublished;
    const [updated] = await db.update(contentPages).set(updateData).where(eq(contentPages.id, id)).returning();
    if (!updated) return c.json({ success: false, error: 'Page not found' }, 404);
    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update page' }, 500);
  }
});

pagesApp.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const [deleted] = await db.delete(contentPages).where(eq(contentPages.id, id)).returning();
    if (!deleted) return c.json({ success: false, error: 'Page not found' }, 404);
    return c.json({ success: true, data: { message: 'Page deleted' } });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to delete page' }, 500);
  }
});

export default pagesApp;
