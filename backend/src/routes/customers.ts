import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const customersApp = new Hono();

customersApp.get('/', async (c) => {
  try {
    const result = await db.query.users.findMany({
      where: eq(users.role, 'customer'),
      orderBy: [desc(users.createdAt)],
    });
    // Strip passwords
    const safe = result.map(({ password, ...u }) => u);
    return c.json({ success: true, data: safe });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch customers' }, 500);
  }
});

export default customersApp;
