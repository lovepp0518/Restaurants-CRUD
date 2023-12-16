'use strict'
const restaurantsJson = require('./data/restaurant.json').results

// 使用 map 函式為每個物件添加 createdAt 和 updatedAt
const initialData = restaurantsJson.map(item => ({
  ...item,
  createdAt: new Date(),
  updatedAt: new Date()
}))

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('restaurants', initialData)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurants', null)
  }
}
