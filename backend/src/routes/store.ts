import { Hono } from 'hono';
import { db } from '../db';
import { banners, products, categories, siteSettings, announcements } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

const storeApp = new Hono();

// Public storefront homepage data
storeApp.get('/homepage', async (c) => {
  try {
    const heroBanners = await db.query.banners.findMany({
      where: eq(banners.isActive, true),
      orderBy: [banners.sortOrder],
    });
    const featured = await db.query.products.findMany({
      where: eq(products.isFeatured, true),
      with: { images: true, category: true },
      limit: 8,
    });
    const newArrivals = await db.query.products.findMany({
      where: eq(products.isNewArrival, true),
      with: { images: true, category: true },
      limit: 8,
      orderBy: [desc(products.createdAt)],
    });
    const bestSellers = await db.query.products.findMany({
      where: eq(products.isBestSeller, true),
      with: { images: true, category: true },
      limit: 8,
    });
    const cats = await db.query.categories.findMany({
      where: eq(categories.isActive, true),
    });
    const activeAnnouncements = await db.query.announcements.findMany({
      where: eq(announcements.isActive, true),
      orderBy: [announcements.sortOrder],
    });

    return c.json({
      success: true,
      data: {
        banners: heroBanners,
        featuredProducts: featured,
        newArrivals,
        bestSellers,
        categories: cats,
        announcements: activeAnnouncements,
      },
    });
  } catch (error) {
    console.error('Homepage error:', error);
    return c.json({ success: false, error: 'Failed to fetch homepage' }, 500);
  }
});

// Public store settings
storeApp.get('/settings', async (c) => {
  try {
    const settings = await db.query.siteSettings.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });
    return c.json({ success: true, data: settingsMap });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch settings' }, 500);
  }
});

export default storeApp;
