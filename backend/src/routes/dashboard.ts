import { Hono } from 'hono';
import { db } from '../db/index.js';
import { products, orders, users, categories } from '../db/schema.js';
import { sql, desc, eq } from 'drizzle-orm';

const dashboardApp = new Hono();

dashboardApp.get('/', async (c) => {
  try {
    const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
    const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(orders);
    const [customerCount] = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, 'customer'));
    const [categoryCount] = await db.select({ count: sql<number>`count(*)` }).from(categories);

    const recentOrders = await db.query.orders.findMany({
      orderBy: [desc(orders.createdAt)],
      limit: 5,
      with: { user: true, items: true },
    });

    return c.json({
      success: true,
      data: {
        totalProducts: Number(productCount?.count || 0),
        totalOrders: Number(orderCount?.count || 0),
        totalCustomers: Number(customerCount?.count || 0),
        totalCategories: Number(categoryCount?.count || 0),
        revenue: 0,
        recentOrders,
        salesChart: [],
        ordersByStatus: [],
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return c.json({ success: false, error: 'Failed to fetch dashboard data' }, 500);
  }
});

export default dashboardApp;
