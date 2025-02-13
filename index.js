require('dotenv').config()
const epxress = require('express')
const expressEjsLayouts = require('express-ejs-layouts')
const ejs = require('ejs')
const app = epxress()
const port = process.env.PORT || 4000 

app.use(epxress.static('public'))

//Template Engiene
app.use(expressEjsLayouts);
// app.use('layout', './layouts/main');
// app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.send("Sever is okkk!!!")
})

app.listen(port, () => {
    console.log("Server is listening at http://localhost:"+port)
})