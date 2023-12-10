const express = require('express')
const router = express.Router()

const db = require('../models')
const restaurant = db.restaurant
const { Op } = require('sequelize')

// 讀取所有餐廳
router.get('/', (req, res) => {
  const keyword = req.query.keyword?.trim() //  等號右邊的keyword為html檔中input的name
  if (keyword) {
    return restaurant.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { category: { [Op.like]: `%${keyword}%` } }
        ]
      },
      attributes: ['id', 'name', 'image', 'category', 'rating'],
      raw: true
    })
      .then((restaurants) => res.render('index', { restaurants }))
      .catch((err) => res.status(422).json(err))
  } else {
    // 若使用者沒有輸入內容，就按下了送出鈕：需要防止表單送出並提示使用者
    if (keyword === '') {
      // 用<script></script>包起來的是在client端執行JavaScript內容：alert彈窗，及重新導向"/restaurantsCRUD"路徑
      res.send('<script>alert("未輸入內容，請檢查！"); window.location.href = "/restaurantsCRUD";</script>')
      return
    }
    // 未按下送出
    return restaurant.findAll({
      attributes: ['id', 'name', 'image', 'category', 'rating'],
      raw: true
    })
      .then((restaurants) => res.render('index', { restaurants }))
      .catch((err) => console.log(err))
  }
})

// 讀取單一餐廳detail
router.get('/:id/detail', (req, res) => {
  const id = req.params.id
  return restaurant.findByPk(id, {
    attributes: ['id', 'name', 'image', 'category', 'location', 'google_map', 'phone', 'description'],
    raw: true
  })
    .then((restaurant) => {
      res.render('detail', { restaurant })
    })
    .catch((err) => console.log(err))
})

// 新增任一餐廳
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const formData = req.body // 從請求中獲取表單數據，且formData即為物件
  return restaurant.create(formData) // formData即為物件可直接傳入create()
    .then(() => res.redirect('/restaurantsCRUD'))
    .catch((err) => console.log(err))
})

// 刪除任一餐廳
router.delete('/:id/delete', (req, res) => {
  const id = req.params.id
  return restaurant.destroy({ where: { id } })
    .then(() => res.redirect('/restaurantsCRUD'))
    .catch((err) => console.log(err))
})

// 編輯任一餐廳
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'image', 'category', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then((restaurant) => {
      res.render('edit', { restaurant })
    })
    .catch((err) => console.log(err))
})

router.put('/:id/edit', (req, res) => {
  const id = req.params.id
  const formData = req.body
  return restaurant.update(formData, { where: { id } })
    .then(() => res.redirect('/restaurantsCRUD'))
})

module.exports = router