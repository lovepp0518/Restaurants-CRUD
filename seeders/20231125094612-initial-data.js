'use strict'
const restaurantsJson = require('./data/restaurant.json').results
const bcrypt = require('bcryptjs')

module.exports = {
  async up (queryInterface, Sequelize) {
    let transaction

    try {
      transaction = await queryInterface.sequelize.transaction()

      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash('12345678', salt)

      // 使用 map 函式為每個物件添加 createdAt 和 updatedAt
      const initialData = restaurantsJson.map((item, index) => ({
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: index < 3 ? 1 : 2
      }))

      await queryInterface.bulkInsert('Users', [
        {
          id: 1,
          name: 'user1',
          email: 'user1@example.com',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: 'user2',
          email: 'user2@example.com',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      { transaction }
      )
      await queryInterface.bulkInsert('restaurants', initialData, { transaction })
      await transaction.commit()
    } catch (error) {
      if (transaction) await transaction.rollback()
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
    await queryInterface.bulkDelete('restaurants', null)
  }
}
