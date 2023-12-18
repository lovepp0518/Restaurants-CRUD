const express = require('express')
const router = express.Router()

const restaurantsCRUD = require('./restaurantsCRUD')
router.use('/restaurantsCRUD', restaurantsCRUD)

const users = require('./users')
router.use('/users', users)

// 首頁重新導入Restaurants-CRUD
router.get('/', (req, res) => {
  res.redirect('/restaurantsCRUD')
})

router.get('/login', (req, res) => {
  return res.render('login')
})

router.get('/register', (req, res) => {
  return res.render('register')
})

router.post('/logout', (req, res) => {
  return res.redirect('/login')
})

module.exports = router
