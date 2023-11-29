const express = require('express')
const app = express()

const { engine } = require('express-handlebars')

const db = require('./models')
const restaurant = db.restaurant

const port = 3000

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index')
})

// 讀取所有餐廳
app.get('/Restaurants-CRUD', (req, res) => {
  return restaurant.findAll()
    .then((restaurant) => res.send({ restaurant }))
    .catch((err) => res.status(422).json(err))
})

// 刪除任一餐廳
app.delete('/Restaurants-CRUD', (req, res) => {
  res.send('delete restaurants')
})

// 新增任一餐廳
app.post('/Restaurants-CRUD', (req, res) => {
  res.send('add restaurants')
})

// 編輯任一餐廳
app.get('/Restaurants-CRUD/edit', (req, res) => {
  res.send('edit restaurants')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})