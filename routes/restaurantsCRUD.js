const express = require('express')
const router = express.Router()

const db = require('../models')
const restaurant = db.restaurant
const { Op } = require('sequelize')

// 讀取所有餐廳
router.get('/', (req, res, next) => {
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
      .catch((error) => {
        error.errorMessage = '資料取得失敗'
        next(error)
      })
  } else {
    // 若使用者沒有輸入內容，就按下了送出鈕：需要防止表單送出並提示使用者
    if (keyword === '') {
      req.flash('error', '未輸入內容，請檢查！')
      return
    }
    // 未按下送出
    return restaurant.findAll({
      attributes: ['id', 'name', 'image', 'category', 'rating'],
      raw: true
    })
      .then((restaurants) => res.render('index', { restaurants }))
      .catch((error) => {
        error.errorMessage = '資料取得失敗'
        next(error)
      })
  }
})

// 讀取單一餐廳detail
router.get('/:id/detail', (req, res, next) => {
  const id = req.params.id
  return restaurant.findByPk(id, {
    attributes: ['id', 'name', 'image', 'category', 'location', 'google_map', 'phone', 'description'],
    raw: true
  })
    .then((restaurant) => {
      res.render('detail', { restaurant })
    })
    .catch((error) => {
      error.errorMessage = '檢視餐廳資料取得失敗'
      next(error)
    })
})

// 新增任一餐廳
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res, next) => {
  const formData = req.body // 從請求中獲取表單數據，且formData即為物件
  return restaurant.create(formData) // formData即為物件可直接傳入create()
    .then(() => {
      req.flash('success', '新增成功')
      return res.redirect('/restaurantsCRUD')
    })
    .catch((error) => {
      error.errorMessage = '新增失敗'
      next(error)
    })
})

// 刪除任一餐廳
router.delete('/:id/delete', (req, res, next) => {
  const id = req.params.id
  return restaurant.destroy({ where: { id } })
    .then(() => {
      req.flash('success', '刪除成功')
      return res.redirect('/restaurantsCRUD')
    })
    .catch((error) => {
      error.errorMessage = '刪除失敗'
      next(error)
    })
})

// 編輯任一餐廳
router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id
  return restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'image', 'category', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then((restaurant) => {
      res.render('edit', { restaurant })
    })
    .catch((error) => {
      error.errorMessage = '編輯資料取得失敗'
      next(error)
    })
})

router.put('/:id/edit', (req, res, next) => {
  const id = req.params.id
  const formData = req.body
  return restaurant.update(formData, { where: { id } })
    .then(() => {
      req.flash('success', '編輯成功')
      res.redirect('/restaurantsCRUD')
    })
    .catch((error) => {
      error.errorMessage = '編輯失敗'
      next(error)
    })
})

module.exports = router
