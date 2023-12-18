const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
  return res.send('註冊成功')
})

module.exports = router