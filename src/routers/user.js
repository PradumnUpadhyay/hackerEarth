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
    res.render('index',{ name: "Pradumn Upadhyay" })
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
    res.render('login',{ name: "Pradumn Upadhyay" })
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
   
    res.status(404).send({"Error": "Invalid Credentials"})
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

module.exports=router


