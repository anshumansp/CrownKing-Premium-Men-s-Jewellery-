'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('user123', salt);

    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        name: 'Test User',
        email: 'user@crownking.com',
        password: hashedPassword,
        role: 'user',
        phone: '9876543210',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'user@crownking.com' });
  },
}; 