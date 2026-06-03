/**
 * Run once to seed the initial admin account.
 * Usage: node src/seed.js
 */
require('dotenv').config();
const sequelize = require('./config/database');
require('./models/index');
const { User } = require('./models');

(async () => {
  try {
    await sequelize.sync({ alter: true });

    const existing = await User.findOne({ where: { email: 'admin@ratehub.com' } });
    if (existing) {
      console.log('Admin already exists. Email: admin@ratehub.com');
      process.exit(0);
    }

    await User.create({
      name: 'System Administrator Account',
      email: 'admin@ratehub.com',
      password: 'Admin@1234',
      address: '123 Admin Street, Platform City, 400001',
      role: 'admin',
    });

    console.log('✓ Admin seeded successfully');
    console.log('  Email:    admin@ratehub.com');
    console.log('  Password: Admin@1234');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
})();
