import { Hono } from 'hono';
import { db } from '../db';
import { products, productVariants } from '../db/schema';
import { eq } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const inventoryApp = new Hono();

inventoryApp.get('/', async (c) => {
  try {
    const result = await db.query.products.findMany({
      with: { variants: true, images: true },
    });
    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch inventory' }, 500);
  }
});

inventoryApp.post('/adjust', authMiddleware, adminMiddleware, async (c) => {
  try {
    const { productId, variantId, change, reason } = await c.req.json();
    if (variantId) {
      const variant = await db.query.productVariants.findFirst({ where: eq(productVariants.id, variantId) });
      if (variant) {
        await db.update(productVariants).set({ stock: variant.stock + change }).where(eq(productVariants.id, variantId));
      }
    } else {
      const product = await db.query.products.findFirst({ where: eq(products.id, productId) });
      if (product) {
        await db.update(products).set({ totalStock: product.totalStock + change }).where(eq(products.id, productId));
      }
    }
    return c.json({ success: true, data: { message: 'Inventory adjusted' } });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to adjust inventory' }, 500);
  }
});

export default inventoryApp;
