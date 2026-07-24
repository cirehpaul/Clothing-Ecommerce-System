import { db } from './index.js';
import { users } from './schema.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding database...');
  
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  await db.insert(users).values({
    email: 'admin@jonel.com',
    password: adminPassword,
    firstName: 'Jonel',
    lastName: 'Admin',
    role: 'admin',
    isActive: true,
    emailVerified: true
  }).onConflictDoNothing();

  console.log('Admin user seeded successfully!');
  console.log('Email: admin@jonel.com');
  console.log('Password: admin123');
  
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
