const User = require('../models/User');

/**
 * Seed default admin user if not exists.
 * Email: admin@test.com
 * Password: Admin@123
 */
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@test.com' });

    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'Admin@123',
        role: 'admin',
      });

      console.log('✅ Default admin user created (admin@test.com / Admin@123)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
  }
};

module.exports = seedAdmin;
