require('dotenv').config()
const epxress = require('express')
const expressEjsLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const ejs = require('ejs')
const app = epxress()

const cookieParser = require('cookie-parser')
const mongoStore = require('connect-mongo')
const { isActiveRoute } = require('./helpers/routeHelpers')

const connectDB = require('./config/db')
const session = require('express-session')
const MongoStore = require('connect-mongo')
connectDB()
// const test = require('./views/layouts/mai')

app.use(epxress.static('public'))
app.use(epxress.urlencoded({extended: true}))
app.use(epxress.json())
app.use(cookieParser())
app.use(methodOverride('_method'))
app.use(session({
    secret: 'keyboard car',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL
    })
}))

//Template Engiene
app.use(expressEjsLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs')

app.locals.isActiveRoute = isActiveRoute


app.use('/', require('./routes/main'))
app.use('/', require('./routes/admin'))

module.exports = app
