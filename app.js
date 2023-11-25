const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello, Express!')
})

// 讀取所有餐廳
app.get('/Restaurants-CRUD', (req, res) => {
  res.send('read all restaurants')
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