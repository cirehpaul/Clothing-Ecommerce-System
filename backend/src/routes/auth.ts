import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const authApp = new Hono();

authApp.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ success: false, error: 'Email and password are required' }, 400);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !user.isActive) {
      return c.json({ success: false, error: 'Invalid credentials or inactive account' }, 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return c.json({
      success: true,
      data: {
        token,
        user: userWithoutPassword,
      },
    });
  } catch (err) {
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

authApp.post('/register', async (c) => {
  try {
    const { email, password, fullName, phone } = await c.req.json();
    
    if (!email || !password || !fullName) {
      return c.json({ success: false, error: 'Email, password, and full name are required' }, 400);
    }

    // Check if email exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return c.json({ success: false, error: 'Email already exists' }, 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Split name
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Create user (default to admin)
    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      role: 'admin',
      isActive: true,
    }).returning();

    const { password: _, ...userWithoutPassword } = newUser;

    return c.json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    }, 201);
  } catch (err) {
    console.error('Registration Error:', err);
    return c.json({ success: false, error: 'Internal server error during registration' }, 500);
  }
});

authApp.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 401);
    }

    const { password: _, ...userWithoutPassword } = user;

    return c.json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Invalid token' }, 401);
  }
});

export default authApp;
