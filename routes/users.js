const express = require('express')
const router = express.Router()

const db = require('../models')
const User = db.User

router.post('/', (req, res, next) => {
  const { email, name, password, confirmPassword } = req.body

  if (!email || !password) {
    req.flash('error', 'email 及 password 為必填')
    return res.redirect('back')
  }

  if (password !== confirmPassword) {
    req.flash('error', '驗證密碼與密碼不符')
    return res.redirect('back')
  }

  return User.findOrCreate({
    where: { email },
    defaults: { name, password }
  })
    .then(([user, created]) => {
      if (!created) {
        // 如果用户已经存在，返回email已註冊的訊息
        req.flash('error', 'email已註冊')
        return res.redirect('back')
      } else {
        // 註冊成功
        req.flash('success', '註冊成功')
        return res.redirect('/login')
      }
    })
    .catch((error) => {
      error.errorMessage = '註冊失敗'
      next(error)
    })
})

module.exports = router