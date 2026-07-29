const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedUsers = async () => {
  const count = await User.countDocuments();
  if (count > 0) return;

  const users = [
    {
      name: 'Admin User',
      email: 'admin@autovault.com',
      password: 'admin123',
      role: 'admin',
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    },
  ];

  const hashedUsers = await Promise.all(
    users.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      return {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      };
    })
  );

  await User.create(hashedUsers);
  console.log(`Seeded ${users.length} demo users into database.`);
};

module.exports = seedUsers;
