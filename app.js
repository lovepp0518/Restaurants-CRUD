const express = require('express')
const app = express()

const { engine } = require('express-handlebars')

const port = 3000

const methodOverride = require('method-override') // 使用 method override

const bodyParser = require('body-parser') // 使用 body-parser

// 引用路由器
const router = require('./routes')

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

// 使用public資料夾中檔案
app.use(express.static('public'))

// 使用 method override 以在表單使用PUT method(表單預設僅能使用GET&POST)
app.use(methodOverride('_method'))

// 透過 body-parser 從 POST 方法的路由中取得表單資料
app.use(bodyParser.urlencoded({ extended: false }))

// 將 request 導入路由器
app.use(router)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
