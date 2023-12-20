const express = require('express')
const router = express.Router()

const db = require('../models')
const restaurant = db.restaurant
const { Op } = require('sequelize')

// 讀取所有餐廳
router.get('/', (req, res, next) => {
  const keyword = req.query.keyword?.trim() //  等號右邊的keyword為html檔中input的name
  const userId = req.user.id

  if (keyword) {
    return restaurant.findAll({
      where: {
        [Op.and]: [
          { userId },
          {
            [Op.or]: [
              { name: { [Op.like]: `%${keyword}%` } },
              { category: { [Op.like]: `%${keyword}%` } }
            ]
          }]
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
      where: { userId },
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
  const userId = req.user.id

  return restaurant.findByPk(id, {
    attributes: ['id', 'name', 'image', 'category', 'location', 'google_map', 'phone', 'description', 'userId'],
    raw: true
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurantsCRUD')
      }
      if (restaurant.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('/restaurantsCRUD')
      }
      res.render('detail', { restaurant })
    })
    .catch((error) => {
      error.errorMessage = '檢視餐廳資料取得失敗'
      next(error)
    })
})

// 新增任一餐廳頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// 新增任一餐廳動作
router.post('/', (req, res, next) => {
  const formData = req.body // 從請求中獲取表單數據，且formData即為物件
  formData.userId = req.user.id // 運用passport擴充，可以從req.user.id拿到userId

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
  const userId = req.user.id

  return restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'image', 'category', 'location', 'google_map', 'phone', 'description', 'userId']
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurantsCRUD')
      }
      if (restaurant.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('/restaurantsCRUD')
      }
      return restaurant.destroy()
        .then(() => {
          req.flash('success', '刪除成功')
          return res.redirect('/restaurantsCRUD')
        })
    })
    .catch((error) => {
      error.errorMessage = '刪除失敗'
      next(error)
    })
})

// 編輯任一餐廳頁面
router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  return restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'image', 'category', 'location', 'phone', 'google_map', 'rating', 'description', 'userId'],
    raw: true
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurantsCRUD')
      }
      if (restaurant.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('/restaurantsCRUD')
      }
      res.render('edit', { restaurant })
    })
    .catch((error) => {
      error.errorMessage = '編輯資料取得失敗'
      next(error)
    })
})

// 編輯任一餐廳動作
router.put('/:id/edit', (req, res, next) => {
  const id = req.params.id
  const formData = req.body
  const userId = req.user.id
  formData.userId = req.user.id // 運用passport擴充，可以從req.user.id拿到userId

  return restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'image', 'category', 'location', 'phone', 'google_map', 'rating', 'description', 'userId']
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurantsCRUD')
      }
      if (restaurant.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('/restaurantsCRUD')
      }
      return restaurant.update(formData, { where: { id } })
        .then(() => {
          req.flash('success', '編輯成功')
          res.redirect('/restaurantsCRUD')
        })
    })
    .catch((error) => {
      error.errorMessage = '編輯失敗'
      next(error)
    })
})

module.exports = router
