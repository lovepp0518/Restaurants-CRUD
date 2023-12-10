const express = require('express')
const router = express.Router()

const restaurantsCRUD = require('./restaurantsCRUD')
router.use('/restaurantsCRUD', restaurantsCRUD)

// 首頁重新導入Restaurants-CRUD
router.get('/', (req, res) => {
  res.redirect('/restaurantsCRUD')
})

module.exports = router