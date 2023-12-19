const express = require('express')
const router = express.Router()

const db = require('../models')
const user = db.user

router.post('/', (req, res) => {
  return res.send('註冊成功')
})

module.exports = router