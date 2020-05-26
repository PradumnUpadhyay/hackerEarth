const express=require('express')
const app=express()
const path=require('path')
const hbs=require('hbs')
const cookieParser=require('cookie-parser')
const userRoutes=require('./routers/user')
const taskRoutes=require('./routers/task')
require('./db/mongoose')

const port=process.env.PORT

// Paths
const views=path.join(__dirname,'../','/templates','/views')
const public=path.join(__dirname,'../','/templates','/public')
const partials=path.join(__dirname,'../','/templates','/partials')

// Setting up utilities
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.set('view engine','hbs')
app.set('views',views)
app.use(express.static(public))
hbs.registerPartials(partials)

app.use(userRoutes)
app.use(taskRoutes)

app.listen(port,console.log("Server started on PORT: ",port))