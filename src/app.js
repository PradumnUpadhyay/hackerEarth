const express=require('express')
const app=express()
const userRoutes=require('./routers/user')
const taskRoutes=require('./routers/task')
const path=require('path')
require('./db/mongoose')
const hbs=require('hbs')

const port=process.env.PORT || 3000

// Paths
const views=path.join(__dirname,'../','/templates','/views')
const public=path.join(__dirname,'../','/templates','/public')
const partials=path.join(__dirname,'../','/templates','/partials')

// Setting up utilities
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine','hbs')
app.set('views',views)
app.use(express.static(public))
hbs.registerPartials(partials)

// app.use('*',(req,res)=>{
//     res.writeHead(200,{ 'Authorization': "" })
// })
app.use(userRoutes)
app.use(taskRoutes)

app.listen(port,console.log("Server started on PORT: ",port))