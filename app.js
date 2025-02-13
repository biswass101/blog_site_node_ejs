require('dotenv').config()
const epxress = require('express')
const expressEjsLayouts = require('express-ejs-layouts')
const ejs = require('ejs')
const app = epxress()

const connectDB = require('./config/db')
connectDB()
// const test = require('./views/layouts/mai')

app.use(epxress.static('public'))
app.use(epxress.urlencoded({extended: true}))
app.use(epxress.json())

//Template Engiene
app.use(expressEjsLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs')


app.use('/', require('./routes/main'))
app.use('/', require('./routes/admin'))

module.exports = app
