'use strict'
const restaurantsJson = require('./data/restaurant.json').results

// 使用 map 函式為每個物件添加 createdAt 和 updatedAt
const initialData = restaurantsJson.map((item, index) => ({
  ...item,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: index < 3 ? 1 : 2
}))

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'user1',
        email: 'user1@example.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user2',
        email: 'user2@example.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    );
    await queryInterface.bulkInsert('restaurants', initialData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null);
    await queryInterface.bulkDelete('restaurants', null);
  }
}
