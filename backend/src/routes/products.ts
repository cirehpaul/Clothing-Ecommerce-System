import { Hono } from 'hono';
import { db } from '../db';
import { products, productImages, categories } from '../db/schema';
import { eq, desc, ilike, and, sql } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const productsApp = new Hono();

// GET /api/products — Public: list all visible products
productsApp.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const search = c.req.query('search');
    const category = c.req.query('category');
    const featured = c.req.query('featured');
    const newArrivals = c.req.query('new_arrivals');
    const bestSellers = c.req.query('best_sellers');
    const offset = (page - 1) * limit;

    const conditions: any[] = [eq(products.isArchived, false)];

    if (search) {
      conditions.push(ilike(products.name, `%${search}%`));
    }
    if (category) {
      conditions.push(eq(products.categoryId, category));
    }
    if (featured === 'true') {
      conditions.push(eq(products.isFeatured, true));
    }
    if (newArrivals === 'true') {
      conditions.push(eq(products.isNewArrival, true));
    }
    if (bestSellers === 'true') {
      conditions.push(eq(products.isBestSeller, true));
    }

    const where = conditions.length > 1 ? and(...conditions) : conditions[0];

    const allProducts = await db.query.products.findMany({
      where,
      with: {
        images: true,
        category: true,
      },
      orderBy: [desc(products.createdAt)],
      limit,
      offset,
    });

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(products).where(where);
    const total = Number(countResult[0]?.count || 0);

    return c.json({
      success: true,
      data: allProducts,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return c.json({ success: false, error: 'Failed to fetch products' }, 500);
  }
});

// GET /api/products/featured
productsApp.get('/featured', async (c) => {
  try {
    const result = await db.query.products.findMany({
      where: and(eq(products.isFeatured, true), eq(products.isArchived, false)),
      with: { images: true, category: true },
      orderBy: [desc(products.createdAt)],
      limit: 10,
    });
    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch featured products' }, 500);
  }
});

// GET /api/products/new-arrivals
productsApp.get('/new-arrivals', async (c) => {
  try {
    const result = await db.query.products.findMany({
      where: and(eq(products.isNewArrival, true), eq(products.isArchived, false)),
      with: { images: true, category: true },
      orderBy: [desc(products.createdAt)],
      limit: 10,
    });
    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch new arrivals' }, 500);
  }
});

// GET /api/products/best-sellers
productsApp.get('/best-sellers', async (c) => {
  try {
    const result = await db.query.products.findMany({
      where: and(eq(products.isBestSeller, true), eq(products.isArchived, false)),
      with: { images: true, category: true },
      orderBy: [desc(products.createdAt)],
      limit: 10,
    });
    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch best sellers' }, 500);
  }
});

// GET /api/products/:slug — Public: get single product by slug or ID
productsApp.get('/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    let product = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: { images: true, category: true, variants: true, reviews: true },
    });
    if (!product) {
      product = await db.query.products.findFirst({
        where: eq(products.id, slug as string),
        with: { images: true, category: true, variants: true, reviews: true },
      });
    }
    if (!product) {
      return c.json({ success: false, error: 'Product not found' }, 404);
    }
    return c.json({ success: true, data: product });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch product' }, 500);
  }
});

// POST /api/products — Admin: create product
productsApp.post('/', authMiddleware, adminMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const slug = body.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `product-${Date.now()}`;

    const [newProduct] = await db.insert(products).values({
      name: body.name,
      slug,
      description: body.description || '',
      categoryId: body.categoryId || null,
      brand: body.brand || null,
      material: body.material || null,
      price: body.price?.toString() || '0',
      salePrice: body.salePrice?.toString() || null,
      discount: body.discount || 0,
      sku: body.sku || `SKU-${Date.now()}`,
      totalStock: body.totalStock || 0,
      isFeatured: body.isFeatured || false,
      isBestSeller: body.isBestSeller || false,
      isNewArrival: body.isNewArrival || false,
      isVisible: body.isVisible !== false,
    }).returning();

    // Insert images
    if (body.images && Array.isArray(body.images) && body.images.length > 0) {
      const imageValues = body.images.map((img: any, i: number) => ({
        productId: newProduct.id,
        url: typeof img === 'string' ? img : img.url,
        altText: typeof img === 'string' ? body.name : (img.altText || body.name),
        sortOrder: i,
        isPrimary: i === 0,
      }));
      await db.insert(productImages).values(imageValues);
    }

    const result = await db.query.products.findFirst({
      where: eq(products.id, newProduct.id),
      with: { images: true, category: true },
    });

    return c.json({ success: true, data: result }, 201);
  } catch (error) {
    console.error('Create product error:', error);
    return c.json({ success: false, error: 'Failed to create product' }, 500);
  }
});

// PUT /api/products/:id — Admin: update product
productsApp.put('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();

    const updateData: any = { updatedAt: new Date() };
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.brand !== undefined) updateData.brand = body.brand;
    if (body.material !== undefined) updateData.material = body.material;
    if (body.price !== undefined) updateData.price = body.price.toString();
    if (body.salePrice !== undefined) updateData.salePrice = body.salePrice?.toString() || null;
    if (body.discount !== undefined) updateData.discount = body.discount;
    if (body.sku !== undefined) updateData.sku = body.sku;
    if (body.totalStock !== undefined) updateData.totalStock = body.totalStock;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.isBestSeller !== undefined) updateData.isBestSeller = body.isBestSeller;
    if (body.isNewArrival !== undefined) updateData.isNewArrival = body.isNewArrival;
    if (body.isVisible !== undefined) updateData.isVisible = body.isVisible;
    if (body.isArchived !== undefined) updateData.isArchived = body.isArchived;

    if (body.name && !body.slug) {
      updateData.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const [updated] = await db.update(products).set(updateData).where(eq(products.id, id as string)).returning();

    if (!updated) {
      return c.json({ success: false, error: 'Product not found' }, 404);
    }

    // Update images if provided
    if (body.images && Array.isArray(body.images)) {
      await db.delete(productImages).where(eq(productImages.productId, id as string));
      if (body.images.length > 0) {
        const imageValues = body.images.map((img: any, i: number) => ({
          productId: id,
          url: typeof img === 'string' ? img : img.url,
          altText: typeof img === 'string' ? updated.name : (img.altText || updated.name),
          sortOrder: i,
          isPrimary: i === 0,
        }));
        await db.insert(productImages).values(imageValues);
      }
    }

    const result = await db.query.products.findFirst({
      where: eq(products.id, id as string),
      with: { images: true, category: true },
    });

    return c.json({ success: true, data: result });
  } catch (error) {
    console.error('Update product error:', error);
    return c.json({ success: false, error: 'Failed to update product' }, 500);
  }
});

// DELETE /api/products/:id — Admin: delete product
productsApp.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const [deleted] = await db.delete(products).where(eq(products.id, id as string)).returning();
    if (!deleted) {
      return c.json({ success: false, error: 'Product not found' }, 404);
    }
    return c.json({ success: true, data: { message: 'Product deleted' } });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to delete product' }, 500);
  }
});

export default productsApp;
