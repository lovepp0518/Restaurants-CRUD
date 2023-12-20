const express = require('express')
const router = express.Router()
const passport = require('passport')

const restaurantsCRUD = require('./restaurantsCRUD')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')

router.use('/restaurantsCRUD', authHandler, restaurantsCRUD)
router.use('/users', users)

// 首頁重新導入Restaurants-CRUD
router.get('/', (req, res) => {
  res.redirect('/restaurantsCRUD')
})

router.get('/login', (req, res) => {
  return res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/restaurantsCRUD',
  failureRedirect: '/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  return res.render('register')
})

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/restaurantsCRUD',
  failureRedirect: '/login',
  failureFlash: true
}))

router.post('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      next(error)
    }
    // 使用者已登出
    req.flash('success', '使用者已登出')
    return res.redirect('/login')
  })
})

module.exports = router
