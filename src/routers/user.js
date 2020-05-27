const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const User=require('../models/User')

router.get('/',(req,res,next)=>{
    res.status(200).redirect('/user/register')
    next()
})
// Register User
router.get('/user/register',(req,res)=>{
    res.render('index')
})

router.post('/user/register', async (req,res)=>{
    try{    
    const user=new User(req.body)
    // console.log(req.body,req.header)
        const token=await user.generateAuthToken()
        user.token=token
        await user.save()
        // console.log(user)
        res.status(200).redirect('/user/login')
    } catch(err) {
        // console.log(err)
        res.status(500).send({"Error":"Internal Server Error encountered"})
    }
})

// Login User
router.get('/user/login',(req,res)=>{
    res.render('login')
})

router.post('/user/login',async (req,res)=>{
    
    try {
    const user=await User.findByCredentials(req.body.email,req.body.password)
    console.log("User ",user)
    const token=await user.generateAuthToken()
   
    user.token=token
    await user.save()
    res.cookie("Authorization","Bearer "+user.token)
    res.status(200).redirect('/tasks')
} catch(err) {
   console.log(err)
    res.status(404).send({"Error": err})
}
})

// loging Out User
router.post('/user/logout',auth,async (req,res)=>{
    
    // console.log(req.user, req.body) 
    try {
        req.user.token=' '  
        // console.log(req.user)
        await req.user.save()
        res.status(200).redirect('/user/login')
    } catch(err) {
        res.status(500).send(err)
    }
})

// Deleting user
router.post('/user',auth,async (req,res)=>{
    try {
        await req.user.remove()
        res.status(200).redirect('/user/registration')

    } catch(err) {
        res.status(500).send({"Error": "Internal Server Error Encountered"})
    }
})

module.exports=router


