import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 401);
    }

    c.set('user', user);
    await next();
  } catch (error) {
    return c.json({ success: false, error: 'Invalid token' }, 401);
  }
};

export const adminMiddleware = async (c: Context, next: Next) => {
  const user = c.get('user');
  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return c.json({ success: false, error: 'Forbidden: Admin access required' }, 403);
  }
  await next();
};
