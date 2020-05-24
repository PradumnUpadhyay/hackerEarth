const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const User=require('../models/User')

// Register User
router.get('/user/register',(req,res)=>{
    res.render('index',{name: "Pradumn Upadhyay"})
})

router.post('/user/register', async (req,res)=>{
    try{    
    const user=new User(req.body)
    // console.log(req.body,req.header)
        const token=await user.generateAuthToken()
        user.token=token
        await user.save()
        // console.log(user)
        res.status(200).redirect('/login')
    } catch(err) {
        // console.log(err)
        res.status(500).send(err)
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
    console.log("Token ",token)
    user.token=token
    await user.save()
    res.writeHead(200,{ "Authorization": `Bearer ${token}` })
} catch(err) {
    console.log(err)
    res.status(404).send(err)
}
})

// loging Out User
router.post('/user/logout',auth,async (req,res)=>{
    
    // console.log(req.user, req.body) 
    try {
        req.user.token=' '  
        console.log(req.user)
        await req.user.save()
        res.send(req.user)
    } catch(err) {
        res.status(500).send(err)
    }
})

module.exports=router


