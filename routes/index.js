const express = require('express')
const router = express.Router()

const passport = require('passport')
const LocalStrategy = require('passport-local')

const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  return User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email: username },
    raw: true
  })
    .then((user) => {
      if (!user || user.password !== password) {
        return done(null, false, { message: 'email 或密碼錯誤' })
      }
      return done(null, user)
    })
    .catch((error) => {
      error.errorMessage = '登入失敗'
      done(error)
    })
}))

passport.serializeUser((user, done) => {
  const { id, name, email } = user
  return done(null, { id, name, email })
})

passport.deserializeUser((user, done) => {
  done(null, { id: user.id })
})

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

router.post('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      next(error)
    }
    return res.redirect('/login')
  })
})

module.exports = router
