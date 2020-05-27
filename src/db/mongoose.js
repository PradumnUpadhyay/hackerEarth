const mongoose=require('mongoose')

mongoose.connect(process.env.URL,{ useCreateIndex: true, useNewUrlParser: true })

module.exports=mongoose