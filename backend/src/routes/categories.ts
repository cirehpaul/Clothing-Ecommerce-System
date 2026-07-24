import { Hono } from 'hono';
import { db } from '../db/index.js';
import { categories } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const categoriesApp = new Hono();

categoriesApp.get('/', async (c) => {
  try {
    const result = await db.query.categories.findMany({
      with: { products: true },
      orderBy: [categories.sortOrder],
    });
    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch categories' }, 500);
  }
});

categoriesApp.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const cat = await db.query.categories.findFirst({
      where: eq(categories.id, id as string),
      with: { products: true },
    });
    if (!cat) return c.json({ success: false, error: 'Category not found' }, 404);
    return c.json({ success: true, data: cat });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch category' }, 500);
  }
});

categoriesApp.post('/', authMiddleware, adminMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const slug = body.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
    const [newCat] = await db.insert(categories).values({
      name: body.name,
      slug,
      description: body.description || null,
      image: body.image || null,
      sortOrder: body.sortOrder || 0,
      isActive: body.isActive !== false,
    }).returning();
    return c.json({ success: true, data: newCat }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create category' }, 500);
  }
});

categoriesApp.put('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const updateData: any = {};
    if (body.name !== undefined) {
      updateData.name = body.name;
      updateData.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (body.description !== undefined) updateData.description = body.description;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const [updated] = await db.update(categories).set(updateData).where(eq(categories.id, id as string)).returning();
    if (!updated) return c.json({ success: false, error: 'Category not found' }, 404);
    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update category' }, 500);
  }
});

categoriesApp.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const [deleted] = await db.delete(categories).where(eq(categories.id, id as string)).returning();
    if (!deleted) return c.json({ success: false, error: 'Category not found' }, 404);
    return c.json({ success: true, data: { message: 'Category deleted' } });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to delete category' }, 500);
  }
});

export default categoriesApp;
