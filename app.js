const express = require('express')
const app = express()

const { engine } = require('express-handlebars')

const db = require('./models')
const restaurant = db.restaurant

const port = 3000

const { Op } = require('sequelize')

const methodOverride = require('method-override') // 使用 method override

const bodyParser = require('body-parser') // 使用 body-parser

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

// 使用public資料夾中檔案
app.use(express.static('public'));

// 使用 method override 以在表單使用PUT method(表單預設僅能使用GET&POST)
app.use(methodOverride('_method'))

// 透過 body-parser 從 POST 方法的路由中取得表單資料
app.use(bodyParser.urlencoded({ extended: false }));

// 首頁重新導入Restaurants-CRUD
app.get('/', (req, res) => {
  res.redirect('/restaurantsCRUD')
})

// 讀取所有餐廳
app.get('/restaurantsCRUD', (req, res) => {
  const keyword = req.query.keyword?.trim() //=右邊的keyword為html檔中input的name
  if (keyword) {
    return restaurant.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { category: { [Op.like]: `%${keyword}%` } },
        ]
      },
      attributes: ['id', 'name', 'image', 'category', 'rating'],
      raw: true
    })
      .then((restaurants) => {
        res.render('index', { restaurants })
      })
      .catch((err) => res.status(422).json(err))
  } else {
    return restaurant.findAll({
      attributes: ['id', 'name', 'image', 'category', 'rating'],
      raw: true
    })
      .then((restaurants) => res.render('index', { restaurants }))
      .catch((err) => console.log(err))
  }
})

// 讀取單一餐廳detail
app.get('/restaurantsCRUD/:id/detail', (req, res) => {
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
app.get('/restaurantsCRUD/new', (req, res) => {
  res.render('new')
})

app.post('/restaurantsCRUD', (req, res) => {
  const formData = req.body // 從請求中獲取表單數據，且formData即為物件
  return restaurant.create(formData) // formData即為物件可直接傳入create()
    .then(() => {
      console.log(formData)
      res.redirect('/restaurantsCRUD')
    })
    .catch((err) => console.log(err))
})

// 刪除任一餐廳
app.delete('/restaurantsCRUD/:id/delete', (req, res) => {
  const id = req.params.id
  return restaurant.destroy({ where: { id } })
    .then(() => res.redirect('/restaurantsCRUD'))
    .catch((err) => console.log(err))
})

// 編輯任一餐廳
app.get('/restaurantsCRUD/:id/edit', (req, res) => {
  res.send('edit restaurants')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})